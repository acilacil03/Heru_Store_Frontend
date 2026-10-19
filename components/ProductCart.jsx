'use client';

export default function ProductCart({ product, onAddToCart, onEdit, onDelete }) {
  const formattedPrice = Number(product.price || 0).toLocaleString('id-ID');
  const imageUrl = product.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col group">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';
          }}
        />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {product.category || 'Pakaian'}
          </span>
          {product.size && (
            <span className="bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              Size {product.size}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${
              product.stock > 0
                ? 'bg-emerald-500/90 text-white'
                : 'bg-rose-500/90 text-white'
            }`}
          >
            {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {product.description || 'Tidak ada deskripsi.'}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-slate-400 font-medium">Harga</span>
              <p className="text-xl font-extrabold text-blue-600">
                Rp {formattedPrice}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onAddToCart}
              disabled={product.stock <= 0}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                product.stock > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200 active:scale-[0.98]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              + Keranjang
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onEdit}
                className="py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={onDelete}
                className="py-2 px-3 text-xs font-semibold rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}