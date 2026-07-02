"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { CheckoutOrderSuccess } from "@/components/cart/CheckoutOrderSuccess";
import { Button } from "@/components/ui/Button";

export function CheckoutSuccessPageView() {
  const searchParams = useSearchParams();
  const { clearCart, hydrated } = useCart();
  const orderNumber = searchParams.get("order_number")?.trim() ?? "";

  useEffect(() => {
    if (!hydrated) return;
    clearCart();
  }, [clearCart, hydrated]);

  if (!orderNumber) {
    return (
      <main className="pb-24">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-[var(--muted)]">
            No encontramos el número de pedido en esta página.
          </p>
          <div className="mt-6">
            <Button href="/tienda" variant="primary" size="lg">
              Ir a la tienda
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <CheckoutOrderSuccess
      orderNumber={orderNumber}
      description="fue registrado correctamente. Si el pago fue aprobado, te contactaremos para coordinar la entrega."
    />
  );
}
