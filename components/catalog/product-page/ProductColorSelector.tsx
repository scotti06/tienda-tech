"use client";

import type { ProductVariant } from "@/lib/store/product-variant-types";

type ProductColorSelectorProps = {
  variants: ProductVariant[];
  selectedVariantId: string;
  onSelect: (variantId: string) => void;
};

export function ProductColorSelector({
  variants,
  selectedVariantId,
  onSelect,
}: ProductColorSelectorProps) {
  if (variants.length === 0) return null;

  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-white">Color</span>
        {selectedVariant && (
          <span className="text-sm text-[var(--muted)]">
            {selectedVariant.colorName}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          const isOutOfStock = variant.stock <= 0;

          return (
            <button
              key={variant.id}
              type="button"
              title={`${variant.colorName}${isOutOfStock ? " (sin stock)" : ""}`}
              aria-label={`Color ${variant.colorName}${isOutOfStock ? ", sin stock" : ""}`}
              aria-pressed={isSelected}
              disabled={isOutOfStock}
              onClick={() => onSelect(variant.id)}
              className={`relative h-10 w-10 rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-purple)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)] disabled:cursor-not-allowed disabled:opacity-35 ${
                isSelected
                  ? "border-white ring-2 ring-[var(--brand-cyan)] ring-offset-2 ring-offset-[#0b0b10] scale-105"
                  : "border-white/20 hover:border-white/50"
              }`}
              style={{ backgroundColor: variant.colorHex }}
            >
              {isOutOfStock && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-black/45"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
