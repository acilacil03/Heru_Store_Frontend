'use client';
import { useState } from 'react';

export default function CartDrawer({ isOpen, onClose, cart = [], onUpdateQty, onRemove, onClear }) {
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const total = cart.reduce((acc, curr) => acc + (Number(curr.price) || 0) * (curr.qty || 1), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsOrdered(true);
    setTimeout(() => {
      setIsOrdered(false);
      if (onClear) onClear();
      onClose();
      alert('Pesanan berhasil dibuat! Terima kasih sudah berbelanja di toko kami.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-800">Keranjang Belanja</h2>
              <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((a, c) => a + c.qty, 0)} item
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-800">Keranjang masih kosong</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Pilih baju favorit Anda dari katalog dan klik tombol "+ Keranjang" untuk memesan.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'}
                    alt={item.name}
                    className="w-18 h-18 rounded-lg object-cover bg-slate-200 shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200';
                    }}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{item.name}</h4>
                        {onRemove && (
                          <button
                            onClick={() => onRemove(item.id)}
                            className="text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.category} • Size: <span className="font-semibold text-slate-700">{item.size || 'M'}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                      <p className="text-sm font-extrabold text-blue-600">
                        Rp {(Number(item.price) * item.qty).toLocaleString('id-ID')}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                        <button
                          onClick={() => onUpdateQty && onUpdateQty(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded font-bold text-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-800 min-w-[16px] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty && onUpdateQty(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded font-bold text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-white space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Ongkos Kirim</span>
                  <span className="text-emerald-600 font-semibold">GRATIS</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Tagihan:</span>
                  <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {onClear && (
                  <button
                    onClick={onClear}
                    className="px-3 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Kosongkan
                  </button>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={isOrdered}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isOrdered ? (
                    <span>Memproses Pesanan...</span>
                  ) : (
                    <>
                      <span>Checkout Sekarang</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}