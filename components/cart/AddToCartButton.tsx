"use client";

import { useState } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import type { CartProductInput } from "@/lib/cart";

type AddToCartButtonProps = {
  product: CartProductInput;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function AddToCartButton({
  product,
  variant = "secondary",
  size = "lg",
  className,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  return (
    <div className="mx-auto flex w-max max-w-full flex-col gap-3">
      <Button
        type="button"
        variant={variant}
        size={size}
        className={[
          "duration-250 hover:!bg-emerald-600 hover:border-emerald-400/35 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_14px_36px_-8px_rgba(0,0,0,0.48),0_0_24px_rgba(34,197,94,0.2)] active:!bg-emerald-700 active:border-emerald-400/45 active:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_10px_28px_-8px_rgba(0,0,0,0.4),0_0_20px_rgba(34,197,94,0.25)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => addItem(product, quantity)}
      >
        Agregar al carrito
      </Button>

      <div className="flex justify-center">
        <div className="inline-flex shrink-0 items-center rounded-full border border-white/[0.12] bg-white/[0.04]">
        <Button
          type="button"
          variant="ghost"
          size="compact"
          aria-label="Disminuir cantidad"
          disabled={quantity <= 1}
          className="duration-250 enabled:hover:!bg-red-600 enabled:hover:!text-white enabled:hover:border-red-400/35 enabled:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_8px_20px_-6px_rgba(0,0,0,0.4),0_0_16px_rgba(239,68,68,0.2)] enabled:active:!bg-red-700 enabled:active:!text-white enabled:active:border-red-400/45"
          onClick={decreaseQuantity}
        >
          −
        </Button>
        <span className="min-w-8 px-2 text-center text-sm font-semibold text-white">
          {quantity}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="compact"
          aria-label="Aumentar cantidad"
          className="duration-250 enabled:hover:!bg-emerald-600 enabled:hover:!text-white enabled:hover:border-emerald-400/35 enabled:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_8px_20px_-6px_rgba(0,0,0,0.4),0_0_16px_rgba(34,197,94,0.2)] enabled:active:!bg-emerald-700 enabled:active:!text-white enabled:active:border-emerald-400/45"
          onClick={increaseQuantity}
        >
          +
        </Button>
        </div>
      </div>
    </div>
  );
}
