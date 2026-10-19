'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import ProductCart from '@/components/ProductCart';
import ProductModal from '@/components/ProductModal';
import CartDrawer from '@/components/CartDrawer';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'table'
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/product');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (e) {
      console.error('Fetch products error:', e);
    }
  };

  useEffect(() => {
    // Check user login
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      // If not logged in, demo user or redirect
      setUser({
        name: 'Administrator Toko',
        email: 'admin@clothstore.com',
      });
    }

    // Load cart
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }

    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleAddToCart = (product) => {
    let updated;
    const exist = cart.find((x) => x.id === product.id);
    if (exist) {
      updated = cart.map((x) => (x.id === product.id ? { ...x, qty: x.qty + 1 } : x));
    } else {
      updated = [...cart, { ...product, qty: 1 }];
    }
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Yakin ingin menghapus produk ini dari database?')) {
      await fetch(`/api/product?id=${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  const totalStock = products.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
  const totalCategories = new Set(products.map((p) => p.category)).size;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavBar
        cartCount={cart.reduce((a, c) => a + c.qty, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-blue-500/30">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black">{user?.name || 'Administrator Toko'}</h1>
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Pengelola Toko
                  </span>
                </div>
                <p className="text-sm text-slate-300 mt-0.5">{user?.email || 'admin@clothstore.com'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs text-center border border-white/10 transition-colors"
              >
                Lihat Katalog Publik
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs text-center transition-colors cursor-pointer"
              >
                Keluar Akun
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Produk</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">{products.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Stok Unit</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">{totalStock}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Variasi Kategori</p>
              <p className="text-2xl sm:text-3xl font-black text-cyan-300 mt-0.5">{totalCategories}</p>
            </div>
          </div>
        </div>

        {/* Catalog Management Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Manajemen Inventaris Baju</h2>
              <p className="text-xs text-slate-500 mt-0.5">Kelola data baju, stok, harga, dan informasi katalog</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Tab Switcher */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('grid')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'grid' ? 'bg-white shadow-xs text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Grid Kartu
                </button>
                <button
                  onClick={() => setActiveTab('table')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'table' ? 'bg-white shadow-xs text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Tabel Data
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>+ Baju Baru</span>
              </button>
            </div>
          </div>

          {/* Search bar inside panel */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Cari nama atau kategori baju..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:max-w-xs px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* View Modes: Grid or Table */}
          {activeTab === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <ProductCart
                  key={p.id}
                  product={p}
                  onAddToCart={() => handleAddToCart(p)}
                  onEdit={() => {
                    setSelectedProduct(p);
                    setIsModalOpen(true);
                  }}
                  onDelete={() => handleDeleteProduct(p.id)}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Produk</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Ukuran</th>
                    <th className="py-3 px-4">Harga</th>
                    <th className="py-3 px-4">Stok</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100'}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{p.description || '-'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-md">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{p.size || 'M'}</td>
                      <td className="py-3 px-4 font-bold text-blue-600">
                        Rp {Number(p.price).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold ${
                            p.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setIsModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
      />
    </div>
  );
}
