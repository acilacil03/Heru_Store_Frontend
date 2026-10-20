'use client';
import { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '@/lib/api';

export default function ProductModal({ isOpen, onClose, product, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Kaos',
    price: '',
    stock: '',
    size: 'M',
    description: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        category: product.category || 'Kaos',
        price: product.price || '',
        stock: product.stock !== undefined ? product.stock : '',
        size: product.size || 'M',
        description: product.description || '',
        image_url: product.image_url || ''
      });
    } else {
      setForm({
        name: '',
        category: 'Kaos',
        price: '',
        stock: '10',
        size: 'M',
        description: '',
        image_url: ''
      });
    }
    setError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        size: form.size,
        description: form.description.trim(),
        image_url: form.image_url.trim() || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
      };

      if (product) {
        await updateProduct({ ...payload, id: product.id });
      } else {
        await createProduct(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan data ke backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-7 z-10 my-8 border border-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-150 mb-5">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              {product ? 'Edit Data Produk' : 'Tambah Produk Baru'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {product ? 'Data akan langsung tersimpan di database backend.' : 'Masukkan rincian pakaian untuk menambahkan ke katalog.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Tutup"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Nama Produk <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Kaos Oversize Cotton Combed"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-none transition-all"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Kategori</label>
              <select
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none transition-all"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Kaos">Kaos</option>
                <option value="Kemeja">Kemeja</option>
                <option value="Jaket">Jaket</option>
                <option value="Sweater">Sweater</option>
                <option value="Celana">Celana</option>
                <option value="Aksesoris">Aksesoris</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Ukuran (Size)</label>
              <select
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none transition-all"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="All Size">All Size</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Harga (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                placeholder="129000"
                min="0"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-none transition-all"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Stok Unit <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                placeholder="10"
                min="0"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-none transition-all"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">URL Gambar (Opsional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-none transition-all"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
            {form.image_url && (
              <div className="mt-2 flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-9 h-9 object-cover rounded bg-neutral-200"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="text-xs text-neutral-500 truncate">{form.image_url}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Deskripsi Produk</label>
            <textarea
              rows="3"
              placeholder="Keterangan bahan, potongan, atau instruksi perawatan..."
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-none transition-all resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-150">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-neutral-250 text-neutral-700 text-xs sm:text-sm font-medium hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : product ? 'Perbarui Produk' : 'Simpan ke Backend'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}