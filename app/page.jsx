'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import ProductCart from '@/components/ProductCart';
import ProductModal from '@/components/ProductModal';
import CartDrawer from '@/components/CartDrawer';
import { getProducts, deleteProduct } from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [toastMessage, setToastMessage] = useState('');

  const categories = ['Semua', 'Kaos', 'Kemeja', 'Jaket', 'Sweater', 'Celana', 'Aksesoris'];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchProductsList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products from backend:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.replace('/login');
      return;
    }
    setCheckingAuth(false);
    fetchProductsList();

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }
  }, [router, fetchProductsList]);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleAddToCart = (product) => {
    let updated;
    const exist = cart.find((x) => x.id === product.id);
    if (exist) {
      updated = cart.map((x) => (x.id === product.id ? { ...x, qty: x.qty + 1 } : x));
    } else {
      updated = [...cart, { ...product, qty: 1 }];
    }
    saveCart(updated);
    showToast(`"${product.name}" ditambahkan ke keranjang`);
  };

  const handleUpdateQty = (id, delta) => {
    const updated = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    saveCart(updated);
  };

  const handleRemoveFromCart = (id) => {
    const updated = cart.filter((x) => x.id !== id);
    saveCart(updated);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Hapus produk ini dari database backend?')) {
      try {
        await deleteProduct(id);
        showToast('Produk berhasil dihapus dari database.');
        fetchProductsList();
      } catch (e) {
        alert(e.message || 'Gagal menghapus produk');
      }
    }
  };

  // Filter products by category and search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'Semua' ||
      (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const cartTotalQty = cart.reduce((a, c) => a + c.qty, 0);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-neutral-500 font-medium">Memeriksa sesi pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col text-neutral-900">
      <NavBar
        cartCount={cartTotalQty}
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={(q) => setSearchQuery(q)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2.5 text-xs font-medium transition-all">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean Modern Header Section */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-2">
                <span>Koleksi Terkini</span>
                <span>•</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                  Backend Express (Port 5000)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-950">
                Katalog Pakaian & Streetwear
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed">
                Koleksi kaos oversize, kemeja kasual, celana, jaket, dan outerwear. Terhubung langsung dengan server REST API Node.js & database MySQL.
              </p>
            </div>

            {/* Quick stats counter */}
            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-6 text-xs text-neutral-500">
              <div>
                <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Total Produk</p>
                <p className="text-xl font-bold text-neutral-900 mt-0.5">{products.length}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Kategori</p>
                <p className="text-xl font-bold text-neutral-900 mt-0.5">
                  {new Set(products.map((p) => p.category)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Controls: Categories & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Produk</span>
          </button>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs text-neutral-500 font-medium">
            Menampilkan <span className="font-semibold text-neutral-900">{filteredProducts.length}</span> produk
            {selectedCategory !== 'Semua' && ` di kategori "${selectedCategory}"`}
            {searchQuery && ` untuk "${searchQuery}"`}
          </p>
          {(selectedCategory !== 'Semua' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
              }}
              className="text-xs text-neutral-700 hover:text-neutral-950 font-medium underline underline-offset-2 cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-xl p-4 border border-neutral-200 animate-pulse space-y-3">
                <div className="aspect-square bg-neutral-200 rounded-lg" />
                <div className="h-4 bg-neutral-200 rounded w-2/3" />
                <div className="h-3 bg-neutral-150 rounded w-1/2" />
                <div className="h-7 bg-neutral-200 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl p-12 text-center border border-neutral-200 max-w-sm mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-neutral-900">Produk Tidak Ditemukan</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Tidak ada pakaian yang cocok dengan filter atau kata kunci saat ini.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Tampilkan Semua
            </button>
          </div>
        ) : (
          /* Product Grid */
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
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-neutral-700">CLOTH STUDIO — Katalog Manajemen Baju</p>
          <p className="text-neutral-400">Backend API Terhubung: http://localhost:5000</p>
        </div>
      </footer>

      {/* Modals & Drawer */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => {
          showToast(selectedProduct ? 'Data produk berhasil diperbarui' : 'Produk baru berhasil ditambahkan');
          fetchProductsList();
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
      />
    </div>
  );
}
