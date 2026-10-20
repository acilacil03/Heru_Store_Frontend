'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import ProductCart from '@/components/ProductCart';
import ProductModal from '@/components/ProductModal';
import CartDrawer from '@/components/CartDrawer';
import { getProducts, deleteProduct } from '@/lib/api';

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

  const fetchProductsList = useCallback(async () => {
    try {
      const data = await getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (e) {
      console.error('Fetch products error:', e);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.replace('/login');
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (e) {
      router.replace('/login');
      return;
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }

    fetchProductsList();
  }, [router, fetchProductsList]);

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
    if (confirm('Hapus produk ini dari database backend?')) {
      try {
        await deleteProduct(id);
        fetchProductsList();
      } catch (e) {
        alert(e.message || 'Gagal menghapus produk');
      }
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-neutral-500 font-medium">Memeriksa status login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col text-neutral-900">
      <NavBar
        cartCount={cart.reduce((a, c) => a + c.qty, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Profile Card Header */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-7 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white font-bold text-lg flex items-center justify-center shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-neutral-900">{user?.name || 'Administrator'}</h1>
                  <span className="bg-neutral-100 text-neutral-700 border border-neutral-200 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                    Pengelola
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">{user?.email || 'admin@clothstore.com'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Link
                href="/"
                className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg border border-neutral-250 hover:bg-neutral-50 text-neutral-700 font-medium text-xs text-center transition-colors"
              >
                Katalog Publik
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg border border-rose-250 text-rose-600 hover:bg-rose-50 font-medium text-xs text-center transition-colors cursor-pointer"
              >
                Keluar
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-neutral-150">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Total Item</p>
              <p className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">{products.length}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Total Stok</p>
              <p className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">{totalStock}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Kategori</p>
              <p className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">{totalCategories}</p>
            </div>
          </div>
        </div>

        {/* Catalog Management Panel */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-7 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Manajemen Inventaris Pakaian</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Kelola data produk, update stok, harga, dan hapus dari backend</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Tab Switcher */}
              <div className="bg-neutral-100 p-0.5 rounded-lg flex items-center text-xs font-medium border border-neutral-200">
                <button
                  onClick={() => setActiveTab('grid')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'grid' ? 'bg-white shadow-2xs text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setActiveTab('table')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'table' ? 'bg-white shadow-2xs text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Tabel
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setIsModalOpen(true);
                }}
                className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah Baju</span>
              </button>
            </div>
          </div>

          {/* Filter Search */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="Cari nama pakaian atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:max-w-xs px-3 py-1.5 bg-neutral-50 border border-neutral-250 rounded-lg text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-none transition-all"
            />
          </div>

          {/* Views: Grid or Table */}
          {activeTab === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
            <div className="overflow-x-auto border border-neutral-200 rounded-lg">
              <table className="w-full text-left text-xs text-neutral-600">
                <thead className="bg-neutral-50 text-neutral-700 font-semibold uppercase text-[10px] tracking-wider border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-3.5">Produk</th>
                    <th className="py-2.5 px-3.5">Kategori</th>
                    <th className="py-2.5 px-3.5">Ukuran</th>
                    <th className="py-2.5 px-3.5">Harga</th>
                    <th className="py-2.5 px-3.5">Stok</th>
                    <th className="py-2.5 px-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-150">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-2.5 px-3.5 flex items-center gap-3">
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100'}
                          alt={p.name}
                          className="w-9 h-9 rounded object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-neutral-900">{p.name}</p>
                          <p className="text-[11px] text-neutral-400 line-clamp-1">{p.description || '-'}</p>
                        </div>
                      </td>
                      <td className="py-2.5 px-3.5">
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 font-medium rounded text-[11px] border border-neutral-200">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 font-medium text-neutral-800">{p.size || 'M'}</td>
                      <td className="py-2.5 px-3.5 font-semibold text-neutral-950">
                        Rp {Number(p.price).toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            p.stock > 0
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {p.stock > 0 ? `${p.stock} pcs` : 'Habis'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setIsModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded border border-neutral-250 text-neutral-700 hover:bg-neutral-50 font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="px-2.5 py-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium cursor-pointer"
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
        onSuccess={fetchProductsList}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
      />
    </div>
  );
}
