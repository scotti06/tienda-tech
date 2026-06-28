"use client";

import { useCart } from "@/components/cart/CartProvider";

type CartFooterLinkProps = {
  children: React.ReactNode;
  className?: string;
};

export function CartFooterLink({ children, className }: CartFooterLinkProps) {
  const { openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className={className}
    >
      {children}
    </button>
  );
}
