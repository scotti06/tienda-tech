import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/StoreShell";
import { CartRedirect } from "@/components/cart/CartRedirect";

export const metadata: Metadata = {
  title: "Carrito — Techstylebv",
  description: "Tu carrito de compras en Techstylebv.",
};

export default function CarritoPage() {
  return (
    <StoreShell>
      <CartRedirect />
    </StoreShell>
  );
}
