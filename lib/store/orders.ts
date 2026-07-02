"use server";

import { revalidatePath } from "next/cache";
import type { CheckoutFormData } from "@/lib/checkout";
import type { CartItem } from "@/lib/cart";
import { getServerClient } from "@/lib/supabase/server";
import {
  createNotificationForOrder,
  generateOrderNumber,
} from "@/lib/store/repository";
import {
  decrementStockForOrderItems,
  restoreStockForOrderItems,
  validateCartStockAvailability,
} from "@/lib/store/stock";
import type { Order } from "@/lib/store/types";

type RegisterOrderInput = {
  items: CartItem[];
  form: CheckoutFormData;
  subtotal: number;
  shippingCost: number;
  total: number;
};

async function rollbackOrder(orderId: string): Promise<void> {
  const supabase = getServerClient();
  const { error } = await supabase.from("orders").delete().eq("id", orderId);

  if (error) {
    console.error(
      `[registerCartOrder] rollback failed for order ${orderId}:`,
      error.message,
    );
  }
}

export async function registerCartOrder(input: RegisterOrderInput) {
  if (!input.items.length) {
    return { ok: false as const, error: "El carrito está vacío." };
  }

  const supabase = getServerClient();
  const now = new Date().toISOString();
  const orderId = `order-${Date.now()}`;
  let stockDecremented = false;

  try {
    const stockValidation = await validateCartStockAvailability(supabase, input.items);
    if (!stockValidation.ok) {
      return { ok: false as const, error: stockValidation.error };
    }

    const orderNumber = await generateOrderNumber();

    const order: Order = {
      id: orderId,
      orderNumber,
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
        model: item.model?.trim() || undefined,
      })),
      total: input.total,
      status: "pendiente",
      createdAt: now,
    };

    const { error: orderError } = await supabase.from("orders").insert({
      id: order.id,
      order_number: order.orderNumber,
      customer_name: order.customerName,
      customer_email: order.customerEmail ?? null,
      customer_phone: order.customerPhone ?? null,
      shipping_street: order.shippingAddress?.street ?? null,
      shipping_city: order.shippingAddress?.city ?? null,
      shipping_province: order.shippingAddress?.province ?? null,
      shipping_postal_code: order.shippingAddress?.postalCode ?? null,
      shipping_notes: order.shippingAddress?.notes ?? null,
      shipping_method: order.shippingMethod ?? null,
      shipping_cost: order.shippingCost ?? null,
      subtotal: order.subtotal ?? null,
      payment_method: order.paymentMethod ?? null,
      total: order.total,
      status: order.status,
      created_at: order.createdAt,
    });

    if (orderError) {
      console.error("[registerCartOrder] order insert failed:", orderError.message);
      return {
        ok: false as const,
        error: "No se pudo registrar el pedido. Intentá nuevamente.",
      };
    }

    const orderItemRows = input.items.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      model: item.model?.trim() || null,
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItemRows);

    if (orderItemsError) {
      console.error(
        "[registerCartOrder] order_items insert failed:",
        orderItemsError.message,
      );
      await rollbackOrder(orderId);
      return {
        ok: false as const,
        error: "No se pudo registrar el pedido. Intentá nuevamente.",
      };
    }

    const notification = createNotificationForOrder(order);
    const { error: notificationError } = await supabase.from("notifications").insert({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      order_id: notification.orderId,
      order_number: notification.orderNumber,
      customer_name: notification.customerName,
      total: notification.total,
      read: notification.read,
      created_at: notification.createdAt,
    });

    if (notificationError) {
      console.error(
        "[registerCartOrder] notification insert failed:",
        notificationError.message,
      );
      await rollbackOrder(orderId);
      return {
        ok: false as const,
        error: "No se pudo registrar el pedido. Intentá nuevamente.",
      };
    }

    const stockUpdate = await decrementStockForOrderItems(
      supabase,
      input.items,
      now,
    );

    if (!stockUpdate.ok) {
      await rollbackOrder(orderId);
      return { ok: false as const, error: stockUpdate.error };
    }

    stockDecremented = true;

    revalidatePath("/admin");
    revalidatePath("/admin/pedidos");
    revalidatePath("/admin/notificaciones");
    revalidatePath("/admin/productos");
    revalidatePath("/tienda");
    revalidatePath("/");

    return { ok: true as const, orderNumber: order.orderNumber };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[registerCartOrder] unexpected error:", message);
    await rollbackOrder(orderId);
    if (stockDecremented) {
      await restoreStockForOrderItems(supabase, input.items, now).catch(() => undefined);
    }
    return {
      ok: false as const,
      error: "No se pudo registrar el pedido. Intentá nuevamente.",
    };
  }
}
