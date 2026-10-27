'use client';

export default function ProductCart({ product, isAdmin, onAddToCart, onEdit, onDelete }) {
  if (!product) return null;

  const formattedPrice = Number(product.price || 0).toLocaleString('id-ID');
  const imageUrl = product.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';
  const inStock = Number(product.stock) > 0;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 hover:border-neutral-350 transition-all duration-200 flex flex-col group overflow-hidden shadow-2xs">
      {/* Product Image Frame */}
      <div className="relative aspect-4/3 sm:aspect-square w-full bg-neutral-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name || 'Produk'}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="bg-white/95 text-neutral-800 text-[11px] font-medium px-2 py-0.5 rounded shadow-2xs border border-neutral-200/60">
            {product.category || 'Pakaian'}
          </span>
          {product.size && (
            <span className="bg-neutral-900/80 text-white text-[11px] font-medium px-1.5 py-0.5 rounded">
              {product.size}
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
              inStock
                ? 'bg-white/95 text-emerald-700 border-emerald-200'
                : 'bg-white/95 text-rose-700 border-rose-200'
            }`}
          >
            {inStock ? `Stok: ${product.stock}` : 'Habis'}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-neutral-900 text-sm sm:text-base line-clamp-1 group-hover:text-neutral-700 transition-colors">
            {product.name || 'Tanpa Nama'}
          </h3>
          <p className="text-neutral-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {product.description || 'Pakaian bahan berkualitas tinggi, nyaman untuk harian.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-150">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Harga</span>
              <p className="text-base sm:text-lg font-bold text-neutral-950">
                Rp {formattedPrice}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={onAddToCart}
              disabled={!inStock}
              className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                inStock
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
              }`}
            >
              <span>{inStock ? '+ Keranjang' : 'Stok Kosong'}</span>
            </button>

            {/* HANYA MUNCUL JIKA ADMIN */}
            {isAdmin && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onEdit}
                  className="py-1.5 px-2 text-xs font-medium rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Edit</span>
                </button>
                <button
                  onClick={onDelete}
                  className="py-1.5 px-2 text-xs font-medium rounded-lg border border-neutral-200 text-neutral-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Hapus</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}