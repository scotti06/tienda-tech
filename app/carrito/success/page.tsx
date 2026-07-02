import type { Metadata } from "next";
import { Suspense } from "react";
import { StoreShell } from "@/components/layout/StoreShell";
import { CheckoutSuccessPageView } from "@/components/cart/CheckoutSuccessPageView";

export const metadata: Metadata = {
  title: "Pedido confirmado — Techstylebv",
  description: "Tu pedido fue registrado correctamente.",
};

export default function CheckoutSuccessPage() {
  return (
    <StoreShell>
      <Suspense
        fallback={
          <main className="pb-24">
            <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
              <p className="text-sm text-[var(--muted)]">Cargando confirmación...</p>
            </div>
          </main>
        }
      >
        <CheckoutSuccessPageView />
      </Suspense>
    </StoreShell>
  );
}
