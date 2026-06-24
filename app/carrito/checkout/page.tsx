import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/StoreShell";
import { CheckoutPageView } from "@/components/cart/CheckoutPageView";

export const metadata: Metadata = {
  title: "Checkout — Techstylebv",
  description: "Finalizá tu compra en Techstylebv.",
};

export default function CheckoutPage() {
  return (
    <StoreShell>
      <CheckoutPageView />
    </StoreShell>
  );
}
