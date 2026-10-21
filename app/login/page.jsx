'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '@/lib/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: 'rakaraka48246@gmail.com', password: '123' });
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

      // Save user session in localStorage
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
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight text-neutral-950">Heru Store</span>
          </Link>
          <h2 className="text-xl font-bold text-neutral-900 mt-2">Selamat Datang</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Masuk untuk mengelola katalog pakaian</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-none transition-all"
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
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-none transition-all"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50 mt-1"
          >
            {loading ? 'Memverifikasi...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-neutral-150 text-center">
          <p className="text-xs text-neutral-500">
            Belum punya akun?{' '}
            <Link href="/register" className="text-neutral-900 font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}