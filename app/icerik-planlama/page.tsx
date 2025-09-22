"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch } from "@/lib/api";

type Content = {
  id: number;
  title: string;
  content_text?: string | null;
  mode: string;
  tone?: string | null;
  user_prompt?: string | null;
  generated_content?: string | null;
  platforms: string[];
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
};

const TONE_OPTIONS = [
  { value: "ciddi", label: "Ciddi" },
  { value: "kurumsal", label: "Kurumsal" },
  { value: "samimi", label: "Samimi" },
  { value: "eğlenceli", label: "Eğlenceli" },
  { value: "bilgilendirici", label: "Bilgilendirici" },
  { value: "motive edici", label: "Motive Edici" }
];

const PLATFORM_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" }
];

export default function ContentPlanningPage() {
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("manuel");

  // Manuel mod states
  const [manualTitle, setManualTitle] = useState("");
  const [manualContent, setManualContent] = useState("");
  const [manualPlatforms, setManualPlatforms] = useState<string[]>([]);

  // Otomatik mod states
  const [autoTitle, setAutoTitle] = useState("");
  const [autoTone, setAutoTone] = useState("");
  const [autoPrompt, setAutoPrompt] = useState("");
  const [autoPlatforms, setAutoPlatforms] = useState<string[]>([]);

  // Submission states
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await apiFetch("/content/list");
      const data = await response.json();
      setContents(data);
    } catch (err) {
      setError("İçerikler yüklenirken hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformToggle = (platform: string, isManual: boolean) => {
    if (isManual) {
      setManualPlatforms(prev => 
        prev.includes(platform) 
          ? prev.filter(p => p !== platform)
          : [...prev, platform]
      );
    } else {
      setAutoPlatforms(prev => 
        prev.includes(platform) 
          ? prev.filter(p => p !== platform)
          : [...prev, platform]
      );
    }
  };

  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await apiFetch("/content/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: manualTitle,
          mode: "manuel",
          content_text: manualContent,
          platforms: manualPlatforms
        })
      });

      // Form'u temizle
      setManualTitle("");
      setManualContent("");
      setManualPlatforms([]);
      
      // Listeyi yenile
      await fetchContents();
      
      alert("İçerik başarıyla oluşturuldu!");
    } catch (err) {
      setError("İçerik oluşturulurken hata oluştu");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAuto = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await apiFetch("/content/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: autoTitle,
          mode: "otomatik",
          tone: autoTone,
          user_prompt: autoPrompt,
          platforms: autoPlatforms
        })
      });

      // Form'u temizle
      setAutoTitle("");
      setAutoTone("");
      setAutoPrompt("");
      setAutoPlatforms([]);
      
      // Listeyi yenile
      await fetchContents();
      
      alert("İçerik başarıyla oluşturuldu!");
    } catch (err) {
      setError("İçerik oluşturulurken hata oluştu");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegenerate = async (contentId: number) => {
    try {
      setSubmitting(true);
      await apiFetch(`/content/${contentId}/regenerate`, {
        method: "POST"
      });
      
      await fetchContents();
      alert("İçerik yeniden üretildi!");
    } catch (err) {
      setError("İçerik yeniden üretilirken hata oluştu");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (contentId: number) => {
    if (!confirm("Bu içeriği silmek istediğinizden emin misiniz?")) return;

    try {
      await apiFetch(`/content/${contentId}`, {
        method: "DELETE"
      });
      
      await fetchContents();
      alert("İçerik silindi!");
    } catch (err) {
      setError("İçerik silinirken hata oluştu");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">İçerik Planlama</h1>
          <div>Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">İçerik Planlama</h1>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Dashboard'a Dön
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* İçerik Oluşturma */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Yeni İçerik Oluştur</CardTitle>
                <CardDescription>
                  Manuel mod veya yapay zeka destekli otomatik mod ile içerik oluşturun
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manuel">Manuel Mod</TabsTrigger>
                    <TabsTrigger value="otomatik">Otomatik Mod</TabsTrigger>
                  </TabsList>

                  <TabsContent value="manuel" className="space-y-4">
                    <form onSubmit={handleSubmitManual} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Başlık</label>
                        <input
                          type="text"
                          value={manualTitle}
                          onChange={(e) => setManualTitle(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">İçerik</label>
                        <textarea
                          value={manualContent}
                          onChange={(e) => setManualContent(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Platformlar</label>
                        <div className="flex flex-wrap gap-2">
                          {PLATFORM_OPTIONS.map((platform) => (
                            <Button
                              key={platform.value}
                              type="button"
                              variant={manualPlatforms.includes(platform.value) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePlatformToggle(platform.value, true)}
                            >
                              {platform.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? "Oluşturuluyor..." : "İçerik Oluştur"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="otomatik" className="space-y-4">
                    <form onSubmit={handleSubmitAuto} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Başlık</label>
                        <input
                          type="text"
                          value={autoTitle}
                          onChange={(e) => setAutoTitle(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Ton</label>
                        <select
                          value={autoTone}
                          onChange={(e) => setAutoTone(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Ton seçin</option>
                          {TONE_OPTIONS.map((tone) => (
                            <option key={tone.value} value={tone.value}>
                              {tone.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Prompt</label>
                        <textarea
                          value={autoPrompt}
                          onChange={(e) => setAutoPrompt(e.target.value)}
                          rows={3}
                          placeholder="Ne hakkında içerik üretilmesini istiyorsunuz? Detayları buraya yazın..."
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Platformlar</label>
                        <div className="flex flex-wrap gap-2">
                          {PLATFORM_OPTIONS.map((platform) => (
                            <Button
                              key={platform.value}
                              type="button"
                              variant={autoPlatforms.includes(platform.value) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePlatformToggle(platform.value, false)}
                            >
                              {platform.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? "AI İçerik Üretiliyor..." : "AI ile İçerik Üret"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* İçerik Listesi */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Oluşturulan İçerikler ({contents.length})</CardTitle>
                <CardDescription>
                  Son oluşturulan içeriklerinizi görüntüleyin ve yönetin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {contents.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Henüz içerik oluşturulmamış</p>
                  ) : (
                    contents.map((content) => (
                      <Card key={content.id} className="border border-gray-200">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-sm">{content.title}</h3>
                            <div className="flex gap-1">
                              <Badge variant={content.mode === "manuel" ? "default" : "secondary"}>
                                {content.mode}
                              </Badge>
                              <Badge variant="outline">{content.status}</Badge>
                            </div>
                          </div>

                          {content.mode === "manuel" && content.content_text && (
                            <p className="text-sm text-gray-600 mb-2">
                              {content.content_text.length > 100 
                                ? content.content_text.substring(0, 100) + "..." 
                                : content.content_text}
                            </p>
                          )}

                          {content.mode === "otomatik" && (
                            <div className="space-y-1 mb-2">
                              {content.tone && (
                                <p className="text-xs text-gray-500">Ton: {content.tone}</p>
                              )}
                              {content.generated_content && (
                                <p className="text-sm text-gray-600">
                                  {content.generated_content.length > 100 
                                    ? content.generated_content.substring(0, 100) + "..." 
                                    : content.generated_content}
                                </p>
                              )}
                            </div>
                          )}

                          {content.platforms.length > 0 && (
                            <div className="flex gap-1 mb-2">
                              {content.platforms.map((platform) => (
                                <Badge key={platform} variant="outline" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2 mt-3">
                            {content.mode === "otomatik" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRegenerate(content.id)}
                                disabled={submitting}
                              >
                                Yeniden Üret
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(content.id)}
                            >
                              Sil
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}