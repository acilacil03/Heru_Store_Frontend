'use client';
import { useState, useEffect, useRef } from 'react';
import { createProduct, updateProduct, uploadImage } from '@/lib/api';

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
  
  // Upload States
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

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
      setImageMode('upload');
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
      setImageMode('upload');
    }
    setError('');
    setUploadError('');
    setUploading(false);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.type || !file.type.startsWith('image/')) {
      setUploadError('Harap pilih file gambar (JPG, PNG, WEBP, GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran gambar maksimal 10 MB.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const res = await uploadImage(file);
      if (res?.url) {
        setForm((prev) => ({ ...prev, image_url: res.url }));
      }
    } catch (err) {
      setUploadError(err.message || 'Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;
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

          {/* Bagian Foto Produk */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Foto Produk
              </label>

              <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-md text-[11px]">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-2.5 py-0.5 rounded font-medium transition-all cursor-pointer ${
                    imageMode === 'upload'
                      ? 'bg-white text-neutral-900 shadow-2xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-2.5 py-0.5 rounded font-medium transition-all cursor-pointer ${
                    imageMode === 'url'
                      ? 'bg-white text-neutral-900 shadow-2xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  URL Gambar
                </button>
              </div>
            </div>

            {uploadError && (
              <div className="mb-2 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="leading-tight">{uploadError}</div>
              </div>
            )}

            {imageMode === 'upload' ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  className="hidden"
                />

                {form.image_url ? (
                  <div className="relative border border-neutral-200 bg-neutral-50 rounded-xl p-3 flex items-center gap-3">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-neutral-250 bg-white shrink-0"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-medium">
                          <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Foto Siap
                        </span>
                        <span className="text-[11px] text-neutral-500 font-medium truncate">Gambar Produk</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate" title={form.image_url}>
                        {form.image_url}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="text-[11px] font-semibold text-neutral-800 hover:text-black cursor-pointer underline disabled:opacity-50"
                        >
                          Ganti Gambar
                        </button>
                        <span className="text-neutral-300">•</span>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, image_url: '' })}
                          disabled={uploading}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer disabled:opacity-50"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                      dragActive
                        ? 'border-neutral-900 bg-neutral-100 scale-[0.99]'
                        : 'border-neutral-300 hover:border-neutral-500 bg-neutral-50/60 hover:bg-neutral-100/60'
                    } ${uploading ? 'opacity-70 pointer-events-none' : ''}`}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center justify-center py-2">
                        <svg className="animate-spin w-7 h-7 text-neutral-900 mb-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-xs font-medium text-neutral-800">
                          Sedang mengunggah foto...
                        </span>
                        <span className="text-[10px] text-neutral-500 mt-0.5">
                          Mohon tunggu sebentar
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-1">
                        <div className="w-11 h-11 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 mb-2 border border-neutral-200">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-neutral-800">
                          Klik untuk memilih foto dari komputer
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          atau tarik & letakkan file gambar di sini
                        </p>
                        <span className="inline-block mt-2.5 px-2.5 py-0.5 bg-neutral-200/70 text-neutral-700 text-[10px] rounded-full font-medium">
                          Mendukung PNG, JPG, WEBP, GIF (Maks. 10MB)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... atau URL gambar lainnya"
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
              disabled={loading || uploading}
              className="px-4 py-2 rounded-lg border border-neutral-250 text-neutral-700 text-xs sm:text-sm font-medium hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Menyimpan...</span>
                </>
              ) : uploading ? (
                <span>Mengunggah Foto...</span>
              ) : product ? (
                'Perbarui Produk'
              ) : (
                'Simpan ke Backend'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}