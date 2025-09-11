"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<Array<{id:number; username:string; role:string}>>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/giris");
      return;
    }
    (async () => {
      try {
        const me = await apiFetch("/auth/me");
        if (!me.ok) throw new Error("Kimlik doğrulanamadı");
        const meJson = await me.json();
        if (meJson.role !== "admin") {
          router.replace("/");
          return;
        }
        const res = await apiFetch("/admin/ping");
        if (!res.ok) { setAuthorized(false); return; }
        setAuthorized(true);
        const list = await apiFetch("/auth/admin/users");
        if (list.ok) setUsers(await list.json());
      } catch (e: any) {
        setError(e.message || "Hata");
        setAuthorized(false);
      }
    })();
  }, [router]);

  if (authorized === null) return <div className="p-8 text-gray-600">Yükleniyor...</div>;
  if (authorized === false) return <div className="p-8 text-red-600">Yetkiniz yok.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center">
            <Badge className="mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">Admin</Badge>
            <CardTitle className="text-3xl">Yönetim Paneli</CardTitle>
            <CardDescription>Sadece admin yetkisine sahip kullanıcılar erişebilir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-700 mb-6">Hoş geldiniz! (Demo ping başarılı)</div>
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="grid grid-cols-4 gap-2 p-3 text-xs text-gray-500">
                <div>ID</div>
                <div>Kullanıcı Adı</div>
                <div>Rol</div>
                <div>İşlem</div>
              </div>
              {users.map(u => (
                <div key={u.id} className="grid grid-cols-4 gap-2 p-3 border-t border-gray-100 items-center">
                  <div>{u.id}</div>
                  <div className="font-medium">{u.username}</div>
                  <div className="text-sm">{u.role}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50" onClick={async () => {
                      const res = await apiFetch(`/auth/admin/users/${u.id}/role`, { method:'POST', body: JSON.stringify({ role: u.role === 'admin' ? 'user' : 'admin' }) });
                      if (res.ok) {
                        const updated = await res.json();
                        setUsers(prev => prev.map(x => x.id === u.id ? updated : x));
                      }
                    }}>{u.role === 'admin' ? 'User Yap' : 'Admin Yap'}</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


