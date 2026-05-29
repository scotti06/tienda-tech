"use client";

import Link from "next/link";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/data";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface)] transition-all duration-500 hover:border-white/15 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-0.5"
    >
      <div className={`relative aspect-[4/5] overflow-hidden ${product.accent}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(157,78,221,0.1),transparent_60%)]" />

        {product.badge && (
          <span className="absolute top-4 left-4 z-10 rounded-md bg-gradient-brand px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
            {product.badge}
          </span>
        )}

        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative h-36 w-36 transition-transform duration-700 ease-out group-hover:scale-105">
            <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.12] to-white/[0.02] shadow-2xl backdrop-blur-sm" />
            <div className="absolute inset-4 rounded-2xl border border-white/5 bg-[var(--void)]/40" />
            <div className="absolute -inset-4 rounded-full bg-[var(--brand-purple)]/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        </div>

        <span className="absolute inset-x-4 bottom-4 z-10 flex translate-y-2 items-center justify-center rounded-full bg-gradient-brand py-3.5 text-sm font-semibold tracking-wide text-white uppercase opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
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
