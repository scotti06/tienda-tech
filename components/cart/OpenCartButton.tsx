"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import type { ButtonSize, ButtonVariant } from "@/components/ui/Button";

type OpenCartButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
};

export function OpenCartButton({
  variant = "secondary",
  size = "md",
  className = "",
  children = "Ver carrito",
}: OpenCartButtonProps) {
  const { openCart } = useCart();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={openCart}
    >
      {children}
    </Button>
  );
}
