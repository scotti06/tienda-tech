"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { getProductHref } from "@/lib/catalog";
import { getCartItemKey, type CartProductInput } from "@/lib/cart";
import type { Product } from "@/lib/data";
import { getButtonClassName } from "@/components/ui/Button";
import { isSiliconeCaseProduct } from "@/lib/store/silicone-case-product";

export type ProductCardQuickAddVariant = "home" | "compact" | "overlay";

type ProductCardQuickAddProps = {
  product: Product;
  className?: string;
  variant?: ProductCardQuickAddVariant;
};

/** Estilo unificado de botones de acción en cards (Agregar / Ver producto). */
export const productCardActionButtonClassName =
  "min-h-[36px] min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden px-2 py-2 text-center text-[10px] font-semibold sm:min-h-[40px] sm:gap-1.5 sm:px-3 sm:text-xs md:px-4";

export function getProductCardViewButtonClassName(extraClassName = "") {
  return getButtonClassName({
    variant: "primary",
    size: "surface",
    className: `${productCardActionButtonClassName} ${extraClassName}`.trim(),
  });
}

function getCartProduct(product: Product): CartProductInput {
  return {
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
  };
}

function getShellClass() {
  return getButtonClassName({
    variant: "primary",
    size: "surface",
    className: productCardActionButtonClassName,
  });
}

export function ProductCardQuickAdd({
  product,
  className = "",
  variant: _variant = "compact",
}: ProductCardQuickAddProps) {
  const router = useRouter();
  const { items, addItem, updateQuantity } = useCart();

  const cartProduct = useMemo(() => getCartProduct(product), [product]);
  const cartKey = getCartItemKey(cartProduct);
  const quantity =
    items.find((item) => item.cartKey === cartKey)?.quantity ?? 0;
  const stock = product.stock;
  const hasStockLimit = stock !== undefined;
  const isOutOfStock = hasStockLimit && stock <= 0;
  const maxQuantity = hasStockLimit ? stock : Number.POSITIVE_INFINITY;
  const requiresProductPage = isSiliconeCaseProduct(product);
  const shellClass = getShellClass();

  function stopNavigation(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleAdd(event: React.MouseEvent) {
    stopNavigation(event);
    if (isOutOfStock) return;

    if (requiresProductPage) {
      router.push(getProductHref(product));
      return;
    }

    addItem(cartProduct, 1);
  }

  function handleDecrease(event: React.MouseEvent) {
    stopNavigation(event);
    updateQuantity(cartKey, quantity - 1);
  }

  function handleIncrease(event: React.MouseEvent) {
    stopNavigation(event);
    if (isOutOfStock) return;
    if (quantity >= maxQuantity) return;

    if (quantity === 0) {
      addItem(cartProduct, 1);
      return;
    }

    updateQuantity(cartKey, quantity + 1);
  }

  if (isOutOfStock) return null;

  if (quantity === 0) {
    return (
      <button
        type="button"
        aria-label={`Agregar ${product.name} al carrito`}
        onClick={handleAdd}
        className={`${shellClass} ${className}`.trim()}
      >
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M4.5 4.5h1.2l1.1 6.2h8.4l1.3-4.7H6.1" />
          <circle cx="9" cy="15.5" r="1" />
          <circle cx="14.5" cy="15.5" r="1" />
        </svg>
        <span className="min-w-0 truncate">Agregar</span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Cantidad de ${product.name} en el carrito`}
      onClick={stopNavigation}
      className={`${shellClass} ${className} inline-flex justify-between px-1.5 sm:px-2.5`.trim()}
    >
      <button
        type="button"
        aria-label={`Quitar uno de ${product.name}`}
        onClick={handleDecrease}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white transition-colors hover:bg-white/10 active:scale-95"
      >
        −
      </button>
      <span
        aria-live="polite"
        aria-atomic="true"
        className="min-w-5 text-center text-xs font-semibold tabular-nums text-white sm:min-w-6 sm:text-sm"
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label={`Agregar uno de ${product.name}`}
        disabled={quantity >= maxQuantity}
        onClick={handleIncrease}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white transition-colors hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
