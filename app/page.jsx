'use client';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import ProductCart from '@/components/ProductCart';
import ProductModal from '@/components/ProductModal';
import CartDrawer from '@/components/CartDrawer';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [toastMessage, setToastMessage] = useState('');

  const categories = ['Semua', 'Kaos', 'Kemeja', 'Jaket', 'Sweater', 'Celana'];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/product');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Load existing cart from localStorage if any
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }
  }, []);

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
    showToast(`"${product.name}" ditambahkan ke keranjang!`);
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
    if (confirm('Yakin ingin menghapus produk ini dari database?')) {
      try {
        const res = await fetch(`/api/product?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          showToast('Produk berhasil dihapus!');
          fetchProducts();
        } else {
          alert('Gagal menghapus produk');
        }
      } catch (e) {
        alert('Terjadi kesalahan saat menghapus produk');
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavBar
        cartCount={cartTotalQty}
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={(q) => setSearchQuery(q)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/20">
              ✨ Koleksi Fashion Berkualitas & Terjangkau
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Katalog <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Toko Baju</span>
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Temukan kaos oversize, kemeja kasual, jaket denim, celana, dan sweater terbaik untuk gayamu setiap hari.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Controls Bar: Categories & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
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
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Tambah Baju Baru</span>
          </button>
        </div>

        {/* Status / Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-slate-500">
            Menampilkan <span className="font-bold text-slate-800">{filteredProducts.length}</span> produk
            {selectedCategory !== 'Semua' && ` di kategori "${selectedCategory}"`}
            {searchQuery && ` untuk "${searchQuery}"`}
          </p>
          {(selectedCategory !== 'Semua' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs animate-pulse space-y-4">
                <div className="aspect-square bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-8 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Tidak ada produk ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">
              Coba gunakan kata kunci lain atau tambahkan produk baru ke dalam katalog.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
              }}
              className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        ) : (
          /* Product Grid */
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
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">© 2026 Cloth Store — CRUD Catalog Application</p>
        <p className="mt-1">Dibuat untuk Manajemen Aplikasi & Pemrograman Web</p>
      </footer>

      {/* Modals & Drawer */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => {
          showToast(selectedProduct ? 'Produk berhasil diubah!' : 'Produk baru berhasil ditambahkan!');
          fetchProducts();
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
