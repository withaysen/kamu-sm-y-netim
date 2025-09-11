"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function NavAuth() {
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const t = localStorage.getItem("access_token");
      setHasToken(!!t);
      if (t) {
        try {
          const res = await apiFetch("/auth/me");
          if (res.ok) {
            const data = await res.json();
            setRole(data.role ?? null);
          }
        } catch {}
      } else {
        setRole(null);
      }
    };
    check();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") check();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setHasToken(false);
    setRole(null);
    router.push("/giris");
  }

  if (!hasToken) {
    return (
      <Link href="/giris">
        <Button variant="default" className="gradient-primary text-white">Giriş</Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {role === "admin" && (
        <Link href="/admin">
          <Button variant="ghost" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50">Admin</Button>
        </Link>
      )}
      <Link href="/dashboard">
        <Button variant="ghost" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50">Dashboard</Button>
      </Link>
      <Link href="/profil">
        <Button variant="ghost" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50">Profilim</Button>
      </Link>
      <Button onClick={handleLogout} variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">Çıkış</Button>
    </div>
  );
}


