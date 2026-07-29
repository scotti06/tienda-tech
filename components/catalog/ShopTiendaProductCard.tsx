"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { formatPrice, getImageFrame } from "@/lib/data";
import { getProductHref } from "@/lib/catalog";
import { getButtonClassName, Button } from "@/components/ui/Button";
import { ProductCardQuickAdd } from "@/components/catalog/ProductCardQuickAdd";

type ShopTiendaProductCardProps = {
  product: Product;
};

const LOW_STOCK_THRESHOLD = 5;

function getStockStatusText(stock: number): string {
  if (stock <= 0) return "sin stock";
  if (stock <= LOW_STOCK_THRESHOLD) return `quedan ${stock} unidades`;
  return "en stock";
}

function CardStockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span
        aria-hidden
        className="pointer-events-none absolute top-2 right-2 z-10 rounded-md bg-red-500/90 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase md:top-4 md:right-4 md:px-2.5 md:py-1 md:text-[10px]"
      >
        Sin stock
      </span>
    );
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return (
      <span
        aria-hidden
        className="pointer-events-none absolute top-2 right-2 z-10 rounded-md bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase md:top-4 md:right-4 md:px-2.5 md:py-1 md:text-[10px]"
      >
        Quedan {stock}
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-2 right-2 z-10 rounded-md bg-emerald-500/80 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase md:top-4 md:right-4 md:px-2.5 md:py-1 md:text-[10px]"
    >
      En stock
    </span>
  );
}

export function ShopTiendaProductCard({ product }: ShopTiendaProductCardProps) {
  const productHref = getProductHref(product);
  const imageFrame = getImageFrame(product.imageFrame);
  const priceLabel = formatPrice(product.price);
  const stockLabel =
    product.stock !== undefined ? getStockStatusText(product.stock) : "";
  const articleLabel = `${product.name}, ${product.category}, ${priceLabel}${
    stockLabel ? `, ${stockLabel}` : ""
  }`;

  return (
    <article
      aria-label={articleLabel}
      className="group card-hover relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface)]"
    >
      <div
        className={`relative aspect-[3/4] overflow-hidden md:aspect-[4/5] ${product.accent}`}
      >
        <Link
          href={productHref}
          aria-label={`Ver ${product.name}`}
          className="absolute inset-0 z-0 block"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(157,78,221,0.1),transparent_60%)]" />

          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <div
              className="relative card-hover-image"
              style={{
                width: `min(100%, ${imageFrame.width}px)`,
                aspectRatio: `${imageFrame.width} / ${imageFrame.height}`,
                maxHeight: "100%",
              }}
            >
              <Image
                src={product.image}
                alt=""
                fill
                className="object-contain object-center drop-shadow-[0_14px_22px_rgba(0,0,0,0.22)]"
                sizes={`(max-width: 768px) 50vw, ${Math.max(imageFrame.width, imageFrame.height)}px`}
              />
            </div>
          </div>
        </Link>

        {product.badge && (
          <span
            aria-hidden
            className={getButtonClassName({
              variant: "surface-primary",
              size: "surface",
              rounded: "rounded-md",
              className:
                "pointer-events-none absolute top-2 left-2 z-10 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase md:top-4 md:left-4 md:px-2.5 md:py-1 md:text-[10px]",
            })}
          >
            {product.badge}
          </span>
        )}

        {product.stock !== undefined && <CardStockBadge stock={product.stock} />}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 pt-2.5 md:gap-2 md:p-5 md:pt-4">
        <p className="text-[9px] font-medium tracking-[0.15em] text-[var(--brand-cyan)] uppercase md:text-[10px]">
          {product.category}
        </p>

        <h3 className="text-sm font-semibold leading-snug tracking-[-0.01em] text-white line-clamp-2 md:text-[15px]">
          <Link href={productHref} className="hover:text-white">
            {product.name}
          </Link>
        </h3>

        {product.description && (
          <p className="line-clamp-1 text-xs leading-relaxed text-[var(--muted)] md:line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-0.5 flex flex-wrap items-baseline gap-2 md:mt-1">
          <p className="text-base font-semibold tracking-tight text-white md:text-xl">
            {priceLabel}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-sm text-[var(--muted)] line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>

        <div className="mt-auto flex min-w-0 items-stretch gap-2 pt-2 md:pt-3">
          <ProductCardQuickAdd product={product} variant="compact" className="min-w-0 flex-1" />
          <Button
            href={productHref}
            variant="primary"
            size="surface"
            className="min-h-[36px] min-w-0 flex-1 items-center justify-center overflow-hidden px-2 py-2 text-center text-[10px] font-semibold sm:min-h-[40px] sm:px-3 sm:text-xs md:px-4"
          >
            <span className="min-w-0 truncate">Ver producto</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
