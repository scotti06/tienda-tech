"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { CartItem } from "@/lib/cart";
import { submitCartOrderAction } from "@/app/carrito/actions";

type CheckoutConsultButtonProps = {
  items: CartItem[];
};

export function CheckoutConsultButton({ items }: CheckoutConsultButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await submitCartOrderAction(items);
      router.push("/contacto");
    });
  }

  return (
    <Button
      type="button"
      variant="primary"
      size="lg"
      className="sm:flex-1"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "Procesando..." : "Consultar compra"}
    </Button>
  );
}
