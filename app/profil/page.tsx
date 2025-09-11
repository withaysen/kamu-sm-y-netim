"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";

type MeResponse = {
  id: number;
  username: string;
  role?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
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
        const res = await apiFetch(`/auth/me`);
        if (res.status === 401) {
          localStorage.removeItem("access_token");
          router.replace("/giris");
          return;
        }
        if (!res.ok) throw new Error("Profil bilgisi alınamadı");
        const data = (await res.json()) as MeResponse;
        setMe(data);
        if (data.role === "admin") {
          const list = await apiFetch("/auth/admin/users");
          if (list.ok) setUsers(await list.json());
        }
      } catch (e: any) {
        setError(e.message || "Hata");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    router.push("/giris");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-16 px-4">
      <div className="max-w-lg mx-auto">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center">
            <Badge className="mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">{me?.role === 'admin' ? 'Admin' : 'Profil'}</Badge>
            <CardTitle className="text-3xl">{me?.role === 'admin' ? 'Yönetim Paneli' : 'Kullanıcı Profili'}</CardTitle>
            <CardDescription>{me?.role === 'admin' ? 'Admin yetkisine sahipsiniz' : 'Kimlik doğrulaması gerektirir'}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-gray-600">Yükleniyor...</div>}
            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}
            {me && me.role !== 'admin' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-sm text-gray-500">Kullanıcı Adı</div>
                  <div className="text-lg font-semibold">{me.username}</div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleLogout} variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">Çıkış</Button>
                  <Link href="/">
                    <Button className="gradient-primary text-white">Ana sayfaya dön</Button>
                  </Link>
                </div>
              </div>
            )}

            {me && me.role === 'admin' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-sm text-gray-500">Admin Kullanıcı</div>
                  <div className="text-lg font-semibold">{me.username}</div>
                </div>
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
                <div className="flex gap-3">
                  <Button onClick={handleLogout} variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">Çıkış</Button>
                  <Link href="/">
                    <Button className="gradient-primary text-white">Ana sayfaya dön</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


