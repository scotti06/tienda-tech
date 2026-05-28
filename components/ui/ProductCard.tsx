import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/data";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const discount =
    product.originalPrice &&
    Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    );

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1">
      <div
        className={`relative aspect-square overflow-hidden bg-gradient-to-br ${product.gradient}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
        </div>
        {product.badge && (
          <span className="absolute top-4 left-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/20">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          aria-label={`Agregar ${product.name} al carrito`}
          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-zinc-950 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium tracking-wide text-violet-400 uppercase">
          {product.category}
        </p>
        <h3 className="mt-2 text-base font-medium leading-snug text-white line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-1">
          <StarRating rating={product.rating} />
          <span className="text-xs text-zinc-500">({product.rating})</span>
        </div>

        <div className="mt-auto flex items-baseline gap-2 pt-4">
          <span className="text-lg font-semibold text-white">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-zinc-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              {discount && discount > 0 && (
                <span className="text-xs font-medium text-emerald-400">
                  -{discount}%
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? "text-amber-400" : "text-zinc-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
