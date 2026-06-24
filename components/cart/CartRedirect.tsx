"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";

export function CartRedirect() {
  const router = useRouter();
  const { openCart } = useCart();

  useEffect(() => {
    router.replace("/tienda");
    const timer = window.setTimeout(() => openCart(), 320);
    return () => window.clearTimeout(timer);
  }, [openCart, router]);

  return null;
}
