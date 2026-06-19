"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { formatPrice, getImageFrame } from "@/lib/data";
import { getProductHref } from "@/lib/catalog";
import { getButtonClassName } from "@/components/ui/Button";

type ProductCardProps = {
  product: Product;
  layout?: "default" | "home";
};

export function ProductCard({ product, layout = "default" }: ProductCardProps) {
  const productHref = getProductHref(product);
  const imageFrame = getImageFrame(product.imageFrame);
  const isHome = layout === "home";

  if (isHome) {
    return (
      <Link
        href={productHref}
        className="card-tap card-hover group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface)] lg:rounded-2xl"
      >
        <div
          className={`relative aspect-square overflow-hidden ${product.accent}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(157,78,221,0.1),transparent_60%)]" />

          <div className="absolute inset-0 flex items-center justify-center p-2.5 sm:p-3">
            <div
              className="relative card-hover-image h-full w-full"
              style={{
                maxWidth: `${imageFrame.width}px`,
                aspectRatio: `${imageFrame.width} / ${imageFrame.height}`,
              }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain object-center drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)]"
                sizes="(max-width: 1024px) 45vw, 240px"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:p-3">
          <h3 className="text-[12px] font-semibold leading-snug tracking-[-0.01em] text-white line-clamp-2 sm:text-[13px]">
            {product.name}
          </h3>

          <p className="text-sm font-semibold tracking-tight text-white">
            {formatPrice(product.price)}
          </p>

          <span
            className={getButtonClassName({
              variant: "surface-primary",
              size: "surface",
              className:
                "mt-0.5 w-full py-2 text-[10px] font-semibold tracking-wide uppercase sm:text-[11px]",
            })}
          >
            Ver producto
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={productHref}
      className="group card-hover relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface)]"
    >
      <div className={`relative aspect-[4/5] overflow-hidden ${product.accent}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(157,78,221,0.1),transparent_60%)]" />

        {product.badge && (
          <span
            className={getButtonClassName({
              variant: "surface-primary",
              size: "surface",
              rounded: "rounded-md",
              className:
                "pointer-events-none absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase",
            })}
          >
            {product.badge}
          </span>
        )}

        <div className="absolute inset-0 flex items-center justify-center p-8">
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
              alt={product.name}
              fill
              className="object-contain object-center drop-shadow-[0_14px_22px_rgba(0,0,0,0.22)]"
              sizes={`(max-width: 768px) 50vw, ${Math.max(imageFrame.width, imageFrame.height)}px`}
            />
          </div>
        </div>

        <span
          aria-hidden
          className={getButtonClassName({
            variant: "surface-primary",
            size: "surface",
            className:
              "pointer-events-none absolute inset-x-4 bottom-4 z-10 translate-y-2 py-3.5 text-sm font-semibold tracking-wide uppercase opacity-0 transition-all duration-350 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-y-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100",
          })}
        >
          Ver producto
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5 pt-4">
        {product.freeShipping && (
          <p className="text-[10px] font-medium tracking-[0.15em] text-[var(--muted)] uppercase">
            Envío gratis
          </p>
        )}

        <h3 className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-white line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-1 space-y-1">
          <p className="text-xl font-semibold tracking-tight text-white">
            {formatPrice(product.price)}
          </p>
          {product.installments && (
            <p className="text-xs leading-relaxed text-[var(--brand-cyan)]">
              {product.installments}
            </p>
          )}
          {product.cashPrice && (
            <p className="text-xs text-[var(--brand-purple-soft)]">
              Transferencia: {formatPrice(product.cashPrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
