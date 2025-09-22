import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import NavAuth from "@/components/nav-auth";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Sosyal Medya Yönetimi</h1>
                <p className="text-sm text-purple-600 font-medium">Kamu Kurumları İçin</p>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Button variant="ghost" className="text-purple-600 bg-purple-50">Ana Sayfa</Button>
              <Link href="/hakkimizda">
                <Button variant="ghost" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50">Hakkımızda</Button>
              </Link>
              <NavAuth />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-20">
          <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold">
            🚀 Yeni Nesil Yönetim
          </Badge>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Kamu Kurumları İçin<br/>
            <span className="gradient-text">Sosyal Medya Yönetim Platformu</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Sosyal medya hesaplarınızı tek bir platformdan yönetin, içeriklerinizi planlayın,
            onay süreçlerini yönetin ve performansınızı analiz edin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kayit">
              <Button className="gradient-primary text-white text-lg px-8 py-6">
                Hemen Başlayın
              </Button>
            </Link>
            <Link href="/hakkimizda">
              <Button variant="outline" className="text-lg px-8 py-6 border-purple-300 text-purple-700 hover:bg-purple-50">
                Daha Fazla Bilgi
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 py-12">
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <CardTitle>Merkezi Yönetim</CardTitle>
              <CardDescription>Tüm sosyal medya hesaplarınızı tek bir yerden yönetin</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <CardTitle>İçerik Planlama</CardTitle>
              <CardDescription>Paylaşımlarınızı önceden planlayın ve otomatik yayınlayın</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <CardTitle>Onay Süreçleri</CardTitle>
              <CardDescription>Kurumsal onay süreçlerini dijitalleştirin ve hızlandırın</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="py-24 bg-white/50 backdrop-blur-lg rounded-3xl my-12">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold">
              📈 Rakamlarla Biz
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Güvenilir ve Ölçeklenebilir Platform</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Türkiye'nin önde gelen kamu kurumları tarafından tercih edilen sosyal medya yönetim platformu
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">50+</div>
              <div className="text-gray-600">Aktif Kurum</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-gray-600">Aylık Paylaşım</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-gray-600">Destek</div>
            </div>
          </div>
        </div>

        {/* More Features */}
        <div className="py-16">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold">
              ✨ Özellikler
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Her İhtiyaca Uygun Çözümler</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Modern ve kullanıcı dostu arayüzümüz ile sosyal medya yönetimini kolaylaştırıyoruz
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow p-6">
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle>Detaylı Analitik</CardTitle>
                <CardDescription className="mt-4">
                  • Etkileşim oranları takibi<br/>
                  • Hedef kitle analizi<br/>
                  • Performans raporları<br/>
                  • Özelleştirilebilir dashboard
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow p-6">
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle>Otomatik Planlama</CardTitle>
                <CardDescription className="mt-4">
                  • Zamanlanmış paylaşımlar<br/>
                  • İçerik takvimi<br/>
                  • Tekrarlanan paylaşımlar<br/>
                  • Akıllı zamanlama önerileri
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow p-6">
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle>Ekip Yönetimi</CardTitle>
                <CardDescription className="mt-4">
                  • Rol tabanlı yetkilendirme<br/>
                  • Çoklu kullanıcı desteği<br/>
                  • Aktivite logları<br/>
                  • Departman bazlı organizasyon
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow p-6">
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <CardTitle>Güvenlik ve Uyumluluk</CardTitle>
                <CardDescription className="mt-4">
                  • İki faktörlü doğrulama<br/>
                  • KVKK uyumluluğu<br/>
                  • SSL güvenliği<br/>
                  • Düzenli yedekleme
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-24 bg-white/50 backdrop-blur-lg rounded-3xl my-12">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold">
              💬 Referanslar
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Kurumlar Bizi Tercih Ediyor</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Türkiye'nin önde gelen kamu kurumları tarafından güvenle kullanılıyor
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-purple-600">A</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Ankara Büyükşehir</CardTitle>
                    <CardDescription>Sosyal Medya Koordinatörü</CardDescription>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Sosyal medya yönetimimizi çok daha verimli hale getirdi. Özellikle onay süreçleri artık çok daha hızlı."
                </p>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-purple-600">İ</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">İzmir Belediyesi</CardTitle>
                    <CardDescription>Dijital İletişim Müdürü</CardDescription>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Kullanıcı dostu arayüzü ve detaylı analitik özellikleriyle sosyal medya stratejimizi geliştirmemize yardımcı oldu."
                </p>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-purple-600">B</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Bursa Valiliği</CardTitle>
                    <CardDescription>Basın ve Halkla İlişkiler</CardDescription>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Çoklu kullanıcı desteği ve güvenlik özellikleri sayesinde tüm ekibimiz uyum içinde çalışabiliyor."
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-20">
          <h2 className="text-4xl font-bold mb-6">
            Hemen Ücretsiz Deneyin
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            14 gün boyunca tüm özellikleri ücretsiz kullanın, kurumunuz için en iyi çözümü keşfedin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kayit">
              <Button className="gradient-primary text-white text-lg px-8 py-6">
                Ücretsiz Başlayın
              </Button>
            </Link>
            <Link href="/hakkimizda">
              <Button variant="outline" className="text-lg px-8 py-6 border-purple-300 text-purple-700 hover:bg-purple-50">
                Demo Talep Edin
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">© 2025 Kamu SM. Tüm hakları saklıdır.</p>
            <div className="flex space-x-6">
              <Link href="/hakkimizda" className="text-gray-600 hover:text-purple-600">Hakkımızda</Link>
              <a href="#" className="text-gray-600 hover:text-purple-600">Gizlilik</a>
              <a href="#" className="text-gray-600 hover:text-purple-600">İletişim</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
