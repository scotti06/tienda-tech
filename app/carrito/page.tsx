import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/StoreShell";
import { CartPageView } from "@/components/cart/CartPageView";

export const metadata: Metadata = {
  title: "Carrito — Techstylebv",
  description: "Tu carrito de compras en Techstylebv.",
};

export default function CarritoPage() {
  return (
    <StoreShell>
      <CartPageView />
    </StoreShell>
  );
}
