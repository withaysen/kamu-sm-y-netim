"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiFetch } from "@/lib/api";


type Post = { 
  id: number; 
  title: string; 
  content: string; 
  scheduled_at?: string | null;
  status: string;
  retry_count: number;
  last_error?: string | null;
  author_id: number;
  author_username: string;
  platforms: string[];
  caption?: string | null;
  tone?: string | null;
  account_id?: number | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [editScheduledAt, setEditScheduledAt] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [tone, setTone] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [accounts, setAccounts] = useState<Array<{id:number; name:string|null; platform:string; external_id:string}>>([]);
  const [editPlatforms, setEditPlatforms] = useState<string[]>([]);
  const [editCaption, setEditCaption] = useState("");
  const [editTone, setEditTone] = useState("");
  const [editSelectedAccounts, setEditSelectedAccounts] = useState<number[]>([]);
  const [userRole, setUserRole] = useState<string>("user");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/giris");
      return;
    }
    (async () => {
      try {
        // Get user info first
        const userRes = await apiFetch("/auth/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserRole(userData.role || "user");
        }
        
        const res = await apiFetch("/posts/");
        if (!res.ok) throw new Error("Kayıtlar alınamadı");
        const data = (await res.json()) as Post[];
        setPosts(data);

        // load accounts for selection
        const accRes = await apiFetch("/accounts/");
        if (accRes.ok) {
          const accs = await accRes.json();
          setAccounts(accs);
        }
      } catch (e: any) {
        setError(e.message || "Hata");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiFetch("/posts/", {
        method: "POST",
        body: JSON.stringify({ 
          title, 
          content, 
          scheduled_at: scheduledAt || undefined,
          platforms,
          caption: caption || undefined,
          tone: tone || undefined,
          account_id: selectedAccounts.length > 0 ? selectedAccounts[0] : undefined,
        }),
      });
      if (!res.ok) throw new Error("Kayıt oluşturulamadı");
      const item = (await res.json()) as Post;
      setPosts((p) => [item, ...p]);
      setTitle("");
      setContent("");
      setScheduledAt("");
      setPlatforms([]);
      setCaption("");
      setTone("");
      setSelectedAccounts([]);
    } catch (e: any) {
      setError(e.message || "Hata");
    }
  }

  async function handleDelete(id: number) {
    const res = await apiFetch(`/posts/${id}`, { method: "DELETE" });
    if (res.ok) setPosts((p) => p.filter((x) => x.id !== id));
  }

  function startEdit(p: Post) {
    setEditingId(p.id);
    setEditTitle(p.title);
    setEditContent(p.content);
    setEditScheduledAt(p.scheduled_at ?? "");
    setEditPlatforms(p.platforms || []);
    setEditCaption(p.caption || "");
    setEditTone(p.tone || "");
    setEditSelectedAccounts(p.account_id ? [p.account_id] : []);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    setEditScheduledAt("");
  }

  async function changeStatus(postId: number, newStatus: string) {
    try {
      const res = await apiFetch(`/posts/${postId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) throw new Error("Durum güncellenemedi");
      
      const updatedPost = await res.json();
      setPosts(posts => posts.map(p => p.id === postId ? updatedPost : p));
      
    } catch (e: any) {
      setError(e.message || "Hata");
    }
  }

  interface StatusTransition {
  status: string;
  label: string;
  color: string;
}

type StatusTransitions = {
  [key: string]: StatusTransition[];
};

function getAvailableStatusTransitions(currentStatus: string, isAdmin: boolean): StatusTransition[] {
    if (isAdmin) {
      // Admin all transitions
      const adminTransitions: StatusTransitions = {
        "taslak": [
          { status: "inceleme", label: "İncelemeye Gönder", color: "orange" },
          { status: "onaylandi", label: "Onayla", color: "blue" },
          { status: "planlandi", label: "Planla", color: "purple" },
          { status: "iptal", label: "İptal Et", color: "gray" }
        ],
        "inceleme": [
          { status: "onaylandi", label: "Onayla", color: "blue" },
          { status: "rededildi", label: "Reddet", color: "red" },
          { status: "taslak", label: "Taslağa Döndür", color: "gray" }
        ],
        "onaylandi": [
          { status: "planlandi", label: "Planla", color: "purple" },
          { status: "yayinlandi", label: "Yayınla", color: "green" },
          { status: "taslak", label: "Taslağa Döndür", color: "gray" }
        ],
        "planlandi": [
          { status: "yayinlandi", label: "Yayınla", color: "green" },
          { status: "iptal", label: "İptal Et", color: "gray" },
          { status: "taslak", label: "Taslağa Döndür", color: "gray" }
        ],
        "rededildi": [
          { status: "taslak", label: "Taslağa Döndür", color: "gray" },
          { status: "iptal", label: "İptal Et", color: "gray" }
        ],
        "iptal": [
          { status: "taslak", label: "Yeniden Başlat", color: "gray" }
        ]
      };
      return adminTransitions[currentStatus] || [];
    } else {
      // User limited transitions
      const userTransitions: StatusTransitions = {
        "taslak": [
          { status: "inceleme", label: "İncelemeye Gönder", color: "orange" },
          { status: "iptal", label: "İptal Et", color: "gray" }
        ],
        "rededildi": [
          { status: "taslak", label: "Düzenle", color: "gray" },
          { status: "iptal", label: "İptal Et", color: "gray" }
        ],
        "iptal": [
          { status: "taslak", label: "Yeniden Başlat", color: "gray" }
        ]
      };
      return userTransitions[currentStatus] || [];
    }
  }

  async function saveEdit(id: number) {
    const res = await apiFetch(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ 
        title: editTitle, 
        content: editContent, 
        scheduled_at: editScheduledAt || undefined,
        platforms: editPlatforms,
        caption: editCaption || undefined,
        tone: editTone || undefined,
        account_id: editSelectedAccounts.length > 0 ? editSelectedAccounts[0] : undefined,
      }),
    });
    if (!res.ok) return;
    const updated = (await res.json()) as Post;
    setPosts((list) => list.map((x) => (x.id === id ? updated : x)));
    cancelEdit();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <Badge className="w-fit bg-gradient-to-r from-purple-500 to-pink-500 text-white">Dashboard</Badge>
            <CardTitle className="text-3xl">İçerik Planlama</CardTitle>
            <CardDescription>Gönderileri listeleyin ve yeni gönderi oluşturun</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
                onClick={async ()=>{
                  const res = await apiFetch('/auth/instagram/login');
                  if (res.ok) {
                    const data = await res.json();
                    if (data.login_url) window.location.href = data.login_url;
                  }
                }}
              >
                Instagram hesabı bağla
              </Button>
            </div>
            <form onSubmit={handleCreate} className="grid md:grid-cols-4 gap-3">
              <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Başlık" className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" required />
              <input value={content} onChange={(e)=>setContent(e.target.value)} placeholder="İçerik" className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" required />
              <input type="datetime-local" value={scheduledAt} onChange={(e)=>setScheduledAt(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
              <Button type="submit" className="gradient-primary text-white">Oluştur</Button>
            </form>
            <div className="grid md:grid-cols-4 gap-3 mt-3">
              <div className="col-span-2 flex flex-wrap gap-2">
                {[
                  {key:'instagram', label:'Instagram'},
                  {key:'twitter', label:'Twitter'},
                  {key:'linkedin', label:'LinkedIn'},
                  {key:'facebook', label:'Facebook'},
                ].map(opt => (
                  <label key={opt.key} className="flex items-center gap-2 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <input type="checkbox" checked={platforms.includes(opt.key)} onChange={(e)=>{
                      setPlatforms(prev => e.target.checked ? [...prev, opt.key] : prev.filter(x => x !== opt.key));
                    }} />
                    {opt.label}
                  </label>
                ))}
              </div>
              <select value={tone} onChange={(e)=>setTone(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option value="">Ton (opsiyonel)</option>
                <option value="ciddi">Ciddi</option>
                <option value="kurumsal">Kurumsal</option>
                <option value="samimi">Samimi</option>
                <option value="eğlenceli">Eğlenceli</option>
                <option value="bilgilendirici">Bilgilendirici</option>
                <option value="motive edici">Motive Edici</option>
              </select>
            </div>
            
            {/* Sosyal Medya Hesap Seçimi */}
            <div className="col-span-4 mt-3">
              <label className="block text-sm font-medium mb-2 text-gray-700">Sosyal Medya Hesapları</label>
              <div className="flex flex-wrap gap-3">
                {accounts.length === 0 ? (
                  <span className="text-gray-500 text-sm">Henüz bağlı hesap yok</span>
                ) : (
                  accounts.map(account => (
                    <label key={account.id} className="flex items-center gap-2 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedAccounts.includes(account.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAccounts(prev => [...prev, account.id]);
                          } else {
                            setSelectedAccounts(prev => prev.filter(id => id !== account.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <div className="flex items-center gap-2">
                        <span className="capitalize text-xs px-2 py-1 bg-gray-100 rounded">
                          {account.platform}
                        </span>
                        <span className="font-medium">
                          {account.name || account.external_id}
                        </span>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
                onClick={async ()=>{
                  try {
                    const res = await apiFetch('/content/create', {
                      method: 'POST',
                      body: JSON.stringify({ 
                        title: title || "Otomatik İçerik",
                        mode: "otomatik",
                        tone: tone || "kurumsal",
                        user_prompt: content || "Bu konu hakkında sosyal medya içeriği oluştur",
                        platforms: platforms 
                      }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setCaption(data.generated_content || '');
                    }
                  } catch (e) {
                    setError("İçerik üretilirken hata oluştu");
                  }
                }}
                disabled={!title && !content}
              >
                🤖 AI ile İçerik Üret
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
                onClick={async ()=>{
                  try {
                    const res = await apiFetch('/posts/caption', {
                      method: 'POST',
                      body: JSON.stringify({ title, content, tone, platforms }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setCaption(data.caption || '');
                    }
                  } catch {}
                }}
              >
                Caption üret
              </Button>
              <span className="text-xs text-gray-500">AI ile akıllı içerik üretimi</span>
            </div>
            <textarea value={caption} onChange={(e)=>setCaption(e.target.value)} placeholder="Caption (opsiyonel)" className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" rows={3} />
            {error && <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Gönderiler</CardTitle>
            <CardDescription>Kendi oluşturduğunuz gönderiler</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-gray-600">Yükleniyor...</div>
            ) : posts.length === 0 ? (
              <div className="text-gray-600">Henüz gönderi yok.</div>
            ) : (
              <div className="space-y-3">
                {posts.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    {editingId === p.id ? (
                      <div className="grid md:grid-cols-4 gap-3 items-center">
                        <input value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                        <input value={editContent} onChange={(e)=>setEditContent(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                        <input type="datetime-local" value={editScheduledAt} onChange={(e)=>setEditScheduledAt(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={cancelEdit}>İptal</Button>
                          <Button onClick={() => saveEdit(p.id)} className="gradient-primary text-white">Kaydet</Button>
                        </div>
                        <div className="md:col-span-4 mt-2 flex flex-wrap gap-2">
                          {[
                            {key:'instagram', label:'Instagram'},
                            {key:'twitter', label:'Twitter'},
                            {key:'linkedin', label:'LinkedIn'},
                            {key:'facebook', label:'Facebook'},
                          ].map(opt => (
                            <label key={opt.key} className="flex items-center gap-2 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2">
                              <input type="checkbox" checked={editPlatforms.includes(opt.key)} onChange={(e)=>{
                                setEditPlatforms(prev => e.target.checked ? [...prev, opt.key] : prev.filter(x => x !== opt.key));
                              }} />
                              {opt.label}
                            </label>
                          ))}
                        </div>
                        <div className="md:col-span-4 grid md:grid-cols-3 gap-3 mt-2">
                          <select value={editTone} onChange={(e)=>setEditTone(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400">
                            <option value="">Ton (opsiyonel)</option>
                            <option value="resmi">Resmi</option>
                            <option value="kurumsal">Kurumsal</option>
                            <option value="bilgilendirici">Bilgilendirici</option>
                            <option value="samimi">Samimi</option>
                            <option value="acil_uyari">Acil / Uyarı</option>
                            <option value="tesvik_edici">Teşvik Edici</option>
                            <option value="kapsayici">Kapsayıcı</option>
                          </select>
                          
                          {/* Edit: Sosyal Medya Hesap Seçimi */}
                          <div className="col-span-4">
                            <label className="block text-sm font-medium mb-2 text-gray-700">Sosyal Medya Hesapları</label>
                            <div className="flex flex-wrap gap-2">
                              {accounts.map(account => (
                                <label key={account.id} className="flex items-center gap-2 text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={editSelectedAccounts.includes(account.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setEditSelectedAccounts(prev => [...prev, account.id]);
                                      } else {
                                        setEditSelectedAccounts(prev => prev.filter(id => id !== account.id));
                                      }
                                    }}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="capitalize text-xs px-1 py-0.5 bg-gray-100 rounded">
                                    {account.platform}
                                  </span>
                                  <span className="text-xs">
                                    {account.name || account.external_id}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          <input value={editCaption} onChange={(e)=>setEditCaption(e.target.value)} placeholder="Caption (opsiyonel)" className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                        </div>
                        <div className="md:col-span-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                            onClick={async ()=>{
                              try {
                                const res = await apiFetch('/posts/caption', {
                                  method: 'POST',
                                  body: JSON.stringify({ title: editTitle, content: editContent, tone: editTone, platforms: editPlatforms }),
                                });
                                if (res.ok) {
                                  const data = await res.json();
                                  setEditCaption(data.caption || '');
                                }
                              } catch {}
                            }}
                          >
                            Caption üret
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-semibold text-gray-900">{p.title}</div>
                            <Badge 
                              className={
                                p.status === 'taslak' ? 'bg-gray-100 text-gray-800' :
                                p.status === 'inceleme' ? 'bg-orange-100 text-orange-800' :
                                p.status === 'onaylandi' ? 'bg-blue-100 text-blue-800' :
                                p.status === 'planlandi' ? 'bg-purple-100 text-purple-800' :
                                p.status === 'yayinlandi' ? 'bg-green-100 text-green-800' :
                                p.status === 'rededildi' ? 'bg-red-100 text-red-800' :
                                p.status === 'iptal' ? 'bg-gray-200 text-gray-700' :
                                p.status === 'kuyruk' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {p.status === 'taslak' ? 'Taslak' :
                               p.status === 'inceleme' ? 'İnceleme Bekliyor' :
                               p.status === 'onaylandi' ? 'Onaylandı' :
                               p.status === 'planlandi' ? 'Planlandı' :
                               p.status === 'yayinlandi' ? 'Yayınlandı' :
                               p.status === 'rededildi' ? 'Red Edildi' :
                               p.status === 'iptal' ? 'İptal Edildi' :
                               p.status === 'kuyruk' ? 'Kuyruğa Alındı' : p.status}
                            </Badge>
                            {p.retry_count > 0 && (
                              <Badge className="bg-orange-100 text-orange-800">
                                {p.retry_count} deneme
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">{p.content}</div>
                          <div className="text-xs text-gray-500 mt-1">Oluşturan: {p.author_username} (#{p.author_id})</div>
                          {p.caption && (
                            <div className="text-xs text-gray-600 mt-1">Caption: {p.caption}</div>
                          )}
                          {p.platforms?.length ? (
                            <div className="text-xs text-gray-500 mt-1">Platformlar: {p.platforms.join(', ')}</div>
                          ) : null}
                          {p.scheduled_at && (
                            <div className="text-xs text-gray-500 mt-1">Planlı: {p.scheduled_at}</div>
                          )}
                          {p.last_error && (
                            <div className="text-xs text-red-600 mt-1 bg-red-50 p-1 rounded">Hata: {p.last_error}</div>
                          )}
                          
                          {/* Status Action Buttons */}
                          {getAvailableStatusTransitions(p.status, userRole === "admin").length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {getAvailableStatusTransitions(p.status, userRole === "admin").map((transition) => (
                                <Button
                                  key={transition.status}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => changeStatus(p.id, transition.status)}
                                  className={
                                    transition.color === 'green' ? 'border-green-300 text-green-700 hover:bg-green-50' :
                                    transition.color === 'blue' ? 'border-blue-300 text-blue-700 hover:bg-blue-50' :
                                    transition.color === 'purple' ? 'border-purple-300 text-purple-700 hover:bg-purple-50' :
                                    transition.color === 'orange' ? 'border-orange-300 text-orange-700 hover:bg-orange-50' :
                                    transition.color === 'red' ? 'border-red-300 text-red-700 hover:bg-red-50' :
                                    'border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }
                                >
                                  {transition.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => startEdit(p)} className="border-purple-300 text-purple-700 hover:bg-purple-50">Düzenle</Button>
                          <Button variant="outline" onClick={() => handleDelete(p.id)} className="border-red-300 text-red-700 hover:bg-red-50">Sil</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


