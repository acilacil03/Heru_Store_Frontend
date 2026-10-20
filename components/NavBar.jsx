'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

export default function NavBar({ cartCount = 0, onOpenCart, onSearch }) {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [backendOnline, setBackendOnline] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        setUser(null);
      }
    }

    // Ping backend health
    fetch(`${API_BASE_URL}/`)
      .then((r) => setBackendOnline(r.ok))
      .catch(() => setBackendOnline(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-neutral-950 flex items-center gap-1.5">
                CLOTH<span className="font-light text-neutral-500">STUDIO</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase -mt-0.5">
                Katalog Produk
              </span>
            </div>
          </Link>

          {/* Search Input */}
          {onSearch && (
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Cari nama pakaian, kemeja, kaos..."
                  className="w-full pl-10 pr-4 py-2 bg-neutral-100 hover:bg-neutral-150 focus:bg-white text-sm text-neutral-900 placeholder-neutral-400 rounded-lg border border-transparent focus:border-neutral-300 focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      onSearch('');
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Backend Connectivity Indicator */}
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                backendOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
              title={backendOnline ? 'Terhubung ke Backend port 5000' : 'Backend port 5000 tidak terdeteksi'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span>{backendOnline ? 'API :5000' : 'Offline'}</span>
            </div>

            <Link
              href="/"
              className="text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-950 px-2.5 py-1.5 rounded-md hover:bg-neutral-100 transition-colors hidden sm:inline-block"
            >
              Katalog
            </Link>

            {/* Cart Button */}
            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-neutral-900 text-neutral-900 font-medium text-xs sm:text-sm transition-all hover:bg-neutral-50 cursor-pointer"
                title="Buka Keranjang Belanja"
              >
                <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="hidden sm:inline">Keranjang</span>
                <span className="bg-neutral-900 text-white text-[11px] font-semibold px-1.5 py-0.2 rounded-full min-w-[20px] text-center">
                  {cartCount}
                </span>
              </button>
            )}

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-left"
                  title="Ke Halaman Profil & Manajemen"
                >
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white font-semibold flex items-center justify-center text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:block text-xs">
                    <p className="font-medium text-neutral-900 leading-tight truncate max-w-[110px]">{user.name}</p>
                    <p className="text-neutral-400 text-[10px] leading-tight">Pengelola</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-neutral-400 hover:text-neutral-900 p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-medium text-neutral-700 hover:text-neutral-950 px-2.5 py-1.5 rounded-md hover:bg-neutral-100 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="text-xs sm:text-sm font-medium bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-lg transition-colors shadow-xs"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}