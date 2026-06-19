"use client";

import { useCart } from "@/components/layout/CartContext";

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
