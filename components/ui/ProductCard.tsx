"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import {
  formatPrice,
  getImageFrame,
  getProductImageBoxStyle,
  getProductImagePaddingClass,
  getProductImagePaddingStyle,
} from "@/lib/data";
import { getProductHref } from "@/lib/catalog";
import { getButtonClassName } from "@/components/ui/Button";
import { TextScramble } from "@/components/ui/text-scramble";
import { ProductCardQuickAdd } from "@/components/catalog/ProductCardQuickAdd";

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
      <article className="card-tap card-hover group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface)] lg:rounded-2xl">
        <div
          className={`relative aspect-square overflow-hidden ${product.accent}`}
        >
          <Link href={productHref} className="absolute inset-0 z-0 block">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(157,78,221,0.1),transparent_60%)]" />

            <div
              className={`absolute inset-0 flex items-center justify-center ${getProductImagePaddingClass(product, "p-2.5 sm:p-3")}`}
              style={getProductImagePaddingStyle(product)}
            >
              <div
                className="relative card-hover-image h-full w-full"
                style={getProductImageBoxStyle(product, imageFrame, "home")}
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
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:p-3">
          <h3 className="text-[12px] font-semibold leading-snug tracking-[-0.01em] text-white line-clamp-2 sm:text-[13px]">
            <Link href={productHref} className="hover:text-white">
              {product.name}
            </Link>
          </h3>

          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-sm font-semibold tracking-tight text-white">
              <TextScramble
                variant="price"
                text={formatPrice(product.price)}
              />
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-xs text-[var(--muted)] line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>

          <div className="mt-0.5 flex min-w-0 items-stretch gap-2">
            <ProductCardQuickAdd product={product} variant="home" className="min-w-0 flex-1" />
            <Link
              href={productHref}
              className={getButtonClassName({
                variant: "surface-primary",
                size: "surface",
                className:
                  "min-w-0 flex-1 items-center justify-center overflow-hidden px-2 py-2 text-center text-[10px] font-semibold tracking-wide uppercase sm:px-3 sm:text-[11px]",
              })}
            >
              <span className="min-w-0 truncate">Ver producto</span>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group card-hover relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface)]">
      <div className={`relative aspect-[4/5] overflow-hidden ${product.accent}`}>
        <Link href={productHref} className="absolute inset-0 z-0 block">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(157,78,221,0.1),transparent_60%)]" />

          <div
            className={`absolute inset-0 flex items-center justify-center ${getProductImagePaddingClass(product, "p-8")}`}
            style={getProductImagePaddingStyle(product)}
          >
            <div
              className="relative card-hover-image"
              style={getProductImageBoxStyle(product, imageFrame, "default")}
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
        </Link>

        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex min-w-0 translate-y-2 items-stretch gap-2 opacity-0 transition-all duration-350 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-y-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 max-md:pointer-events-auto max-md:translate-y-0 max-md:opacity-100">
          <ProductCardQuickAdd product={product} variant="overlay" className="pointer-events-auto min-w-0 flex-1" />
          <Link
            href={productHref}
            className={getButtonClassName({
              variant: "surface-primary",
              size: "surface",
              className:
                "pointer-events-auto min-w-0 flex-1 items-center justify-center overflow-hidden px-2 py-3 text-center text-[11px] font-semibold tracking-wide uppercase sm:px-3 sm:py-3.5 sm:text-sm",
            })}
          >
            <span className="min-w-0 truncate">Ver producto</span>
          </Link>
        </div>

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

      </div>

      <div className="flex flex-1 flex-col gap-2 p-5 pt-4">
        {product.freeShipping && (
          <p className="text-[10px] font-medium tracking-[0.15em] text-[var(--muted)] uppercase">
            Envío gratis
          </p>
        )}

        <h3 className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-white line-clamp-2">
          <Link href={productHref} className="hover:text-white">
            {product.name}
          </Link>
        </h3>

        <div className="mt-1 space-y-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-xl font-semibold tracking-tight text-white">
              <TextScramble
                variant="price"
                text={formatPrice(product.price)}
              />
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-sm text-[var(--muted)] line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          {product.cashPrice && (
            <p className="text-xs text-[var(--brand-purple-soft)]">
              Transferencia:{" "}
              <TextScramble
                variant="price"
                text={formatPrice(product.cashPrice)}
              />
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
