"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { formatPrice, getImageFrame, siteConfig } from "@/lib/data";
import { getProductHref } from "@/lib/catalog";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { ProductCardQuickAdd } from "@/components/catalog/ProductCardQuickAdd";
import { getStockLevel } from "@/lib/store/types";

type ShopProductCardProps = {
  product: Product;
};

function CardStockBadge({ stock }: { stock: number }) {
  const level = getStockLevel(stock);

  if (level === "out") {
    return (
      <span className="pointer-events-none absolute top-2 right-2 z-10 rounded-md bg-red-500/90 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase md:top-4 md:right-4 md:px-2.5 md:py-1 md:text-[10px]">
        Sin stock
      </span>
    );
  }

  if (level === "low") {
    return (
      <span className="pointer-events-none absolute top-2 right-2 z-10 rounded-md bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white md:top-4 md:right-4 md:px-2.5 md:py-1 md:text-[10px]">
        Quedan {stock}
      </span>
    );
  }

  return (
    <span className="pointer-events-none absolute top-2 right-2 z-10 rounded-md bg-emerald-500/80 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white md:top-4 md:right-4 md:px-2.5 md:py-1 md:text-[10px]">
      En stock
    </span>
  );
}

export function ShopProductCard({ product }: ShopProductCardProps) {
  const productHref = getProductHref(product);
  const imageFrame = getImageFrame(product.imageFrame);
  const whatsappText = encodeURIComponent(
    `Hola! Quiero consultar por: ${product.name}`,
  );
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp}?text=${whatsappText}`;

  return (
    <article className="group card-hover relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface)]">
      <div
        className={`relative aspect-[3/4] overflow-hidden md:aspect-[4/5] ${product.accent}`}
      >
        <Link href={productHref} className="absolute inset-0 z-0 block">
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
                alt={product.name}
                fill
                className="object-contain object-center drop-shadow-[0_14px_22px_rgba(0,0,0,0.22)]"
                sizes={`(max-width: 768px) 50vw, ${Math.max(imageFrame.width, imageFrame.height)}px`}
              />
            </div>
          </div>
        </Link>

        {product.badge && (
          <span
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
          <p className="hidden text-xs leading-relaxed text-[var(--muted)] line-clamp-2 md:block">
            {product.description}
          </p>
        )}

        <div className="mt-0.5 flex flex-wrap items-baseline gap-2 md:mt-1">
          <p className="text-base font-semibold tracking-tight text-white md:text-xl">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-sm text-[var(--muted)] line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-2 md:pt-3">
          <div className="flex items-stretch gap-2">
            <ProductCardQuickAdd product={product} variant="compact" className="flex-1" />
            <Button
              href={productHref}
              variant="primary"
              size="compact"
              className="min-w-0 flex-1"
            >
              Ver producto
            </Button>
          </div>
          <Button
            href={whatsappHref}
            external
            variant="secondary"
            size="compact"
            className="hidden w-full md:inline-flex"
          >
            Consultar por WhatsApp
          </Button>
        </div>
      </div>
    </article>
  );
}
