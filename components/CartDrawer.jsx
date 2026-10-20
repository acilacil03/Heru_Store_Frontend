'use client';
import { useState } from 'react';

export default function CartDrawer({ isOpen, onClose, cart = [], onUpdateQty, onRemove, onClear }) {
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const total = cart.reduce((acc, curr) => acc + (Number(curr.price) || 0) * (curr.qty || 1), 0);
  const totalItems = cart.reduce((a, c) => a + c.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsOrdered(true);
    setTimeout(() => {
      setIsOrdered(false);
      if (onClear) onClear();
      onClose();
      alert('Pesanan berhasil dibuat! Terima kasih sudah berbelanja.');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-neutral-150 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-neutral-900 text-white flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-neutral-900">Keranjang Belanja</h2>
              <span className="text-xs bg-neutral-100 text-neutral-600 font-medium px-2 py-0.5 rounded-full border border-neutral-200">
                {totalItems} item
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Tutup"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3 border border-neutral-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">Keranjang masih kosong</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Pilih pakaian favorit Anda dari katalog dan klik tombol "+ Keranjang".
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover bg-neutral-200 shrink-0 border border-neutral-200"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200';
                    }}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">{item.name}</h4>
                        {onRemove && (
                          <button
                            onClick={() => onRemove(item.id)}
                            className="text-neutral-400 hover:text-neutral-800 p-0.5 transition-colors cursor-pointer"
                            title="Hapus item"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.category} • Size <span className="font-medium text-neutral-800">{item.size || 'M'}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200">
                      <p className="text-xs sm:text-sm font-bold text-neutral-950">
                        Rp {(Number(item.price) * item.qty).toLocaleString('id-ID')}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded border border-neutral-200">
                        <button
                          onClick={() => onUpdateQty && onUpdateQty(item.id, -1)}
                          className="w-4 h-4 flex items-center justify-center text-neutral-600 hover:text-neutral-950 font-bold text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold text-neutral-900 min-w-[14px] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty && onUpdateQty(item.id, 1)}
                          className="w-4 h-4 flex items-center justify-center text-neutral-600 hover:text-neutral-950 font-bold text-xs cursor-pointer"
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

          {/* Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-white space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="text-neutral-800 font-medium">Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Biaya Pengiriman</span>
                  <span className="text-emerald-700 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-950 pt-2 border-t border-neutral-150">
                  <span>Total Tagihan:</span>
                  <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {onClear && (
                  <button
                    onClick={onClear}
                    className="px-3 py-2.5 border border-neutral-250 hover:bg-neutral-50 text-neutral-600 rounded-lg font-medium text-xs transition-colors cursor-pointer"
                  >
                    Kosongkan
                  </button>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={isOrdered}
                  className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isOrdered ? (
                    <span>Memproses...</span>
                  ) : (
                    <>
                      <span>Checkout ({totalItems})</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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