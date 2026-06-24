"use server";

import { buildCheckoutPayload } from "@/lib/checkout";
import type { CheckoutFormData } from "@/lib/checkout";
import type { CartItem } from "@/lib/cart";
import { registerCartOrder } from "@/lib/store/orders";

export async function submitCheckoutOrderAction(
  items: CartItem[],
  form: CheckoutFormData,
) {
  try {
    const payload = buildCheckoutPayload(items, form);

    if ("error" in payload) {
      return { ok: false as const, error: payload.error };
    }

    return await registerCartOrder(payload);
  } catch {
    return {
      ok: false as const,
      error: "No se pudo registrar el pedido. Intentá nuevamente.",
    };
  }
}
