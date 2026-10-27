'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';

export default function SettingsPage() {
  const router = useRouter();
  const [cloudName, setCloudName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [configured, setConfigured] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    // Check current config from backend
    fetch('http://localhost:5000/api/cloudinary-config/config')
      .then((res) => res.json())
      .then((data) => {
        setConfigured(data.configured);
        if (data.cloud_name) {
          setCloudName(data.cloud_name);
        }
      })
      .catch((err) => console.error('Error checking config:', err));

    // Check DB status
    fetch('http://localhost:5000/api')
      .then((res) => res.json())
      .then((data) => {
        setDbStatus({
          status: 'connected',
          config: { database: 'mapil_project (Aiven)' },
        });
      })
      .catch((err) => {
        setDbStatus({
          status: 'error',
          error: err.message,
        });
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/cloudinary-config/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Gagal mengkonfigurasi Cloudinary');
        return;
      }

      setMessage('✅ Cloudinary berhasil dikonfigurasi di backend!');
      setConfigured(true);
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col text-neutral-900">
      <NavBar cartCount={0} onOpenCart={() => {}} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Database Status Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-2xs">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-neutral-900">Status Database MySQL</h1>
            <p className="text-xs text-neutral-500 mt-1">
              Koneksi ke database produk
            </p>
          </div>

          {dbStatus ? (
            <div
              className={`p-4 rounded-lg border ${
                dbStatus.status === 'connected'
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-rose-50 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    dbStatus.status === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                <p className="text-sm font-bold text-neutral-900">
                  {dbStatus.status === 'connected' ? '✅ Terkoneksi' : '❌ Gagal Koneksi'}
                </p>
              </div>
              {dbStatus.status === 'connected' ? (
                <div className="text-xs text-neutral-600 space-y-1">
                  <p>Host: {dbStatus.config.host}:{dbStatus.config.port}</p>
                  <p>Database: {dbStatus.config.database}</p>
                  <p>Tables: {dbStatus.tables?.join(', ') || 'N/A'}</p>
                </div>
              ) : (
                <p className="text-xs text-rose-700">{dbStatus.error}</p>
              )}
            </div>
          ) : (
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <p className="text-xs text-neutral-500">Loading status database...</p>
            </div>
          )}
        </div>

        {/* Cloudinary Config Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-2xs">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-neutral-900">Konfigurasi Cloudinary</h1>
            <p className="text-xs text-neutral-500 mt-1">
              Setup Cloudinary untuk upload gambar produk ke cloud
            </p>
          </div>

          {configured && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm font-medium text-emerald-700">
                ✅ Cloudinary sudah terkonfigurasi dengan cloud_name: {cloudName}
              </p>
            </div>
          )}

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                message.includes('✅')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Cloud Name
              </label>
              <input
                type="text"
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                placeholder="Contoh: my-cloud-name"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Contoh: 123456789012345"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                API Secret
              </label>
              <input
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Klik ikon mata di dashboard Cloudinary untuk melihat"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <p className="text-xs font-medium text-neutral-700 mb-2">ATAU paste CLOUDINARY_URL lengkap:</p>
              <input
                type="text"
                value={cloudinaryUrl}
                onChange={(e) => setCloudinaryUrl(e.target.value)}
                placeholder="cloudinary://api_key:api_secret@cloud_name"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Simpan & Test Koneksi'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-neutral-250 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Kembali
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-xs font-semibold text-neutral-700 mb-2">💡 Cara mendapatkan kredensial:</p>
            <ol className="text-xs text-neutral-600 space-y-1 list-decimal list-inside">
              <li>Login ke <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">cloudinary.com</a></li>
              <li>Buka Dashboard → Settings → API Security</li>
              <li>Copy Cloud Name, API Key, dan klik ikon mata untuk API Secret</li>
              <li>Paste di form di atas dan klik "Simpan & Test Koneksi"</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
