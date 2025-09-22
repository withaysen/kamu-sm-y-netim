"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`OAuth hatası: ${error}`);
          return;
        }

        if (!code || !state) {
          setStatus('error');
          setMessage('OAuth parametreleri eksik');
          return;
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
          setStatus('error');
          setMessage('Giriş yapmanız gerekiyor');
          setTimeout(() => router.push('/giris'), 2000);
          return;
        }

        // Backend'e callback verilerini gönder
        const response = await fetch('http://localhost:8000/posts/connect/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ code, state }),
        });

        const result = await response.json();

        if (result.success) {
          setStatus('success');
          setMessage('Hesap başarıyla bağlandı! Yönlendiriliyorsunuz...');
          setTimeout(() => router.push('/hesaplar'), 2000);
        } else {
          setStatus('error');
          setMessage(result.error || 'Hesap bağlama başarısız');
          setTimeout(() => router.push('/hesaplar'), 3000);
        }

      } catch (error) {
        console.error('OAuth callback hatası:', error);
        setStatus('error');
        setMessage('Beklenmeyen bir hata oluştu');
        setTimeout(() => router.push('/hesaplar'), 3000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                <h2 className="text-xl font-semibold">Hesap Bağlanıyor...</h2>
                <p className="text-gray-600">
                  Sosyal medya hesabınız bağlanıyor, lütfen bekleyin.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
                <h2 className="text-xl font-semibold text-green-700">Başarılı!</h2>
                <p className="text-gray-600">{message}</p>
              </>
            )}

            {status === 'error' && (
              <>
                <AlertCircle className="h-12 w-12 mx-auto text-red-600" />
                <h2 className="text-xl font-semibold text-red-700">Hata</h2>
                <p className="text-gray-600">{message}</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}