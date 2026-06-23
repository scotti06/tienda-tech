"use server";

import { revalidatePath } from "next/cache";
import type { CartItem } from "@/lib/cart";
import { registerCartOrder } from "@/lib/store/orders";

export async function submitCartOrderAction(items: CartItem[]) {
  return registerCartOrder({ items });
}
