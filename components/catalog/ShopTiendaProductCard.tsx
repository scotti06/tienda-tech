"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { formatPrice, getImageFrame } from "@/lib/data";
import { getProductHref } from "@/lib/catalog";
import { useCart } from "@/components/cart/CartProvider";
import { Button, getButtonClassName } from "@/components/ui/Button";

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
        className="pointer-events-none absolute top-2 right-2 z-10 rounded-md bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white md:top-4 md:right-4 md:px-2.5 md:py-1 md:text-[10px]"
      >
        Quedan {stock}
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-2 right-2 z-10 rounded-md bg-emerald-500/80 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white md:top-4 md:right-4 md:px-2.5 md:py-1 md:text-[10px]"
    >
      En stock
    </span>
  );
}

export function ShopTiendaProductCard({ product }: ShopTiendaProductCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const productHref = getProductHref(product);
  const imageFrame = getImageFrame(product.imageFrame);

  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const cartQuantity = items.find((item) => item.id === product.id)?.quantity ?? 0;
  const priceLabel = formatPrice(product.price);
  const stockLabel =
    product.stock !== undefined ? getStockStatusText(product.stock) : "";
  const articleLabel = `${product.name}, ${product.category}, ${priceLabel}${
    stockLabel ? `, ${stockLabel}` : ""
  }`;

  const cartProduct = {
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
  };

  function handleAddToCart() {
    if (isOutOfStock) return;
    addItem(cartProduct, 1);
  }

  function handleDecrease() {
    if (cartQuantity <= 1) {
      removeItem(product.id);
      return;
    }
    updateQuantity(product.id, cartQuantity - 1);
  }

  function handleIncrease() {
    if (isOutOfStock) return;
    if (cartQuantity >= stock) return;
    if (cartQuantity === 0) {
      addItem(cartProduct, 1);
      return;
    }
    updateQuantity(product.id, cartQuantity + 1);
  }

  const stepperClassName = getButtonClassName({
    variant: "primary",
    size: "compact",
    className: "w-full justify-between gap-2 px-2",
  });

  return (
    <article
      aria-label={articleLabel}
      className="group card-hover relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface)]"
    >
      <Link
        href={productHref}
        aria-label={`Ver ${product.name}`}
        className={`relative block aspect-[3/4] overflow-hidden md:aspect-[4/5] ${product.accent}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(157,78,221,0.1),transparent_60%)]" />

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

        <p className="mt-0.5 text-base font-semibold tracking-tight text-white md:mt-1 md:text-xl">
          {priceLabel}
        </p>

        <div className="mt-auto pt-2 md:pt-3">
          {cartQuantity === 0 ? (
            <Button
              type="button"
              variant="primary"
              size="compact"
              className="w-full"
              disabled={isOutOfStock}
              aria-label={
                isOutOfStock
                  ? `${product.name}, sin stock`
                  : `Agregar ${product.name} al carrito`
              }
              onClick={handleAddToCart}
            >
              {isOutOfStock ? "Sin stock" : "Agregar al carrito"}
            </Button>
          ) : (
            <div
              className={stepperClassName}
              role="group"
              aria-label={`Cantidad de ${product.name} en el carrito`}
            >
              <button
                type="button"
                aria-label={`Quitar uno de ${product.name}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white transition-colors hover:bg-white/10 active:scale-95"
                onClick={handleDecrease}
              >
                −
              </button>
              <span
                aria-live="polite"
                aria-atomic="true"
                className="min-w-8 text-center text-sm font-semibold tabular-nums text-white"
              >
                {cartQuantity}
              </span>
              <button
                type="button"
                aria-label={`Agregar uno de ${product.name}`}
                disabled={cartQuantity >= stock}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white transition-colors hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={handleIncrease}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
