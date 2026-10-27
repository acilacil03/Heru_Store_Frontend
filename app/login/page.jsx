'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '@/lib/api';

// PERHATIKAN: Harus ada 'export default' di sini!
export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      router.replace('/');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await loginUser(form);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess('Login berhasil! Mengalihkan ke beranda...');
      setTimeout(() => {
        router.push('/');
      }, 600);
    } catch (err) {
      setError(err.message || 'Login gagal, periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="bg-white p-7 sm:p-8 rounded-xl border border-neutral-200 shadow-xs w-full max-w-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-neutral-900 mt-2">Selamat Datang</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Masuk untuk mengelola katalog pakaian</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium text-xs sm:text-sm cursor-pointer disabled:opacity-50 mt-1"
          >
            {loading ? 'Memverifikasi...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}