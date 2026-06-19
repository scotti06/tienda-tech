"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { formatPrice, getImageFrame, siteConfig } from "@/lib/data";
import { getProductHref } from "@/lib/catalog";
import { Button, getButtonClassName } from "@/components/ui/Button";

type ShopProductCardProps = {
  product: Product;
};

export function ShopProductCard({ product }: ShopProductCardProps) {
  const productHref = getProductHref(product);
  const imageFrame = getImageFrame(product.imageFrame);
  const whatsappText = encodeURIComponent(
    `Hola! Quiero consultar por: ${product.name}`,
  );
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp}?text=${whatsappText}`;

  return (
    <article className="group card-hover relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface)]">
      <Link
        href={productHref}
        className={`relative block aspect-[4/5] overflow-hidden ${product.accent}`}
      >
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
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5 pt-4">
        <p className="text-[10px] font-medium tracking-[0.15em] text-[var(--brand-cyan)] uppercase">
          {product.category}
        </p>

        <h3 className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-white line-clamp-2">
          <Link href={productHref} className="hover:text-white">
            {product.name}
          </Link>
        </h3>

        {product.description && (
          <p className="text-xs leading-relaxed text-[var(--muted)] line-clamp-2">
            {product.description}
          </p>
        )}

        <p className="mt-1 text-xl font-semibold tracking-tight text-white">
          {formatPrice(product.price)}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-3">
          <Button href={productHref} variant="primary" size="compact" className="w-full">
            Ver producto
          </Button>
          <Button
            href={whatsappHref}
            external
            variant="secondary"
            size="compact"
            className="w-full"
          >
            Consultar por WhatsApp
          </Button>
        </div>
      </div>
    </article>
  );
}
