"use client";

import type { ReactNode } from "react";
import type { Product } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/layout/CartContext";

type AddToCartButtonProps = {
  product: Product;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
};

export function AddToCartButton({
  product,
  variant = "secondary",
  size = "lg",
  className = "",
  children = "Agregar al carrito",
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        addItem(product);
        openCart();
      }}
    >
      {children}
    </Button>
  );
}
