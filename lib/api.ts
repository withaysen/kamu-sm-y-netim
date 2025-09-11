export async function apiFetch(input: string, init: RequestInit = {}, _retried = false) {
  const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8081";
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers = new Headers(init.headers as HeadersInit);
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(base + input, { ...init, headers });

  if (res.status === 401 && typeof window !== "undefined") {
    if (_retried) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/giris";
      return Promise.reject(new Error("Yetkisiz"));
    }
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      localStorage.removeItem("access_token");
      window.location.href = "/giris";
      return Promise.reject(new Error("Oturum süresi doldu"));
    }
    try {
      const refreshRes = await fetch(base + "/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!refreshRes.ok) throw new Error("refresh failed");
      const data = await refreshRes.json();
      localStorage.setItem("access_token", data.access_token);
      if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
      // Retry original request once
      return apiFetch(input, init, true);
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/giris";
      return Promise.reject(new Error("Yenileme başarısız"));
    }
  }

  return res;
}


