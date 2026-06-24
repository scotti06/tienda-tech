"use server";

import { revalidatePath } from "next/cache";
import type { CheckoutFormData } from "@/lib/checkout";
import type { CartItem } from "@/lib/cart";
import {
  createNotificationForOrder,
  generateOrderNumber,
  readStore,
  writeStore,
} from "@/lib/store/repository";
import type { Order } from "@/lib/store/types";

type RegisterOrderInput = {
  items: CartItem[];
  form: CheckoutFormData;
  subtotal: number;
  shippingCost: number;
  total: number;
};

export async function registerCartOrder(input: RegisterOrderInput) {
  if (!input.items.length) {
    return { ok: false as const, error: "El carrito está vacío." };
  }

  const store = readStore();
  const now = new Date().toISOString();
  const orderId = `order-${Date.now()}`;

  const order: Order = {
    id: orderId,
    orderNumber: generateOrderNumber(store),
    customerName: input.form.customerName.trim(),
    customerEmail: input.form.customerEmail.trim(),
    customerPhone: input.form.customerPhone.trim(),
    shippingAddress: {
      street: input.form.street.trim(),
      city: input.form.city.trim(),
      province: input.form.province.trim(),
      postalCode: input.form.postalCode.trim(),
      notes: input.form.shippingNotes.trim() || undefined,
    },
    shippingMethod: input.form.shippingMethod || undefined,
    shippingCost: input.shippingCost,
    subtotal: input.subtotal,
    paymentMethod: input.form.paymentMethod || undefined,
    items: input.items.map((item) => ({
      productId: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
    total: input.total,
    status: "pendiente",
    createdAt: now,
  };

  store.orders.unshift(order);
  store.notifications.unshift(createNotificationForOrder(order));
  writeStore(store);

  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin/notificaciones");

  return { ok: true as const, orderNumber: order.orderNumber };
}
