"use server";

import { revalidatePath } from "next/cache";
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
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
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
    customerName: input.customerName?.trim() || "Cliente de la tienda",
    customerEmail: input.customerEmail?.trim() || undefined,
    customerPhone: input.customerPhone?.trim() || undefined,
    items: input.items.map((item) => ({
      productId: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
    total: input.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    ),
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
