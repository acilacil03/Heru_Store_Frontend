'use client';
import { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '@/lib/api';

export default function ProductModal({ isOpen, onClose, product, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Kaos',
    price: '',
    stock: '',
    size: 'M',
    image_url: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        category: product.category || 'Kaos',
        price: product.price || '',
        stock: product.stock || '',
        size: product.size || 'M',
        image_url: product.image_url || '',
        description: product.description || '',
      });
    } else {
      setForm({
        name: '',
        category: 'Kaos',
        price: '',
        stock: '',
        size: 'M',
        image_url: '',
        description: '',
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/internal/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Upload gagal');
      }

      setForm({ ...form, image_url: data.url });
    } catch (err) {
      setError(err.message || 'Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (product) {
        await updateProduct(product.id, form);
      } else {
        await addProduct(form);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200">
          <h3 className="text-base font-bold text-neutral-900">
            {product ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Nama Produk</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Kategori</label>
              <select
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Kaos">Kaos</option>
                <option value="Kemeja">Kemeja</option>
                <option value="Jaket">Jaket</option>
                <option value="Sweater">Sweater</option>
                <option value="Celana">Celana</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Ukuran (Size)</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Harga (Rp)</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Stok</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">URL Gambar (Image URL)</label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
              />
              <label className="px-3 py-2 bg-neutral-100 border border-neutral-250 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-200 cursor-pointer whitespace-nowrap">
                {uploading ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Deskripsi</label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-250 rounded-lg text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}