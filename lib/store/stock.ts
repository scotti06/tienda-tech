import type { SupabaseClient } from "@supabase/supabase-js";
import type { CartItem } from "@/lib/cart";

type ProductStockRow = {
  id: string;
  name: string;
  stock: number;
};

export function aggregateCartQuantities(items: CartItem[]): Map<string, number> {
  const quantities = new Map<string, number>();

  for (const item of items) {
    quantities.set(item.id, (quantities.get(item.id) ?? 0) + item.quantity);
  }

  return quantities;
}

function formatStockError(productName: string, available: number, requested: number): string {
  if (available <= 0) {
    return `"${productName}" no tiene stock disponible.`;
  }

  const unitLabel = available === 1 ? "unidad disponible" : "unidades disponibles";
  return `"${productName}" solo tiene ${available} ${unitLabel} (pediste ${requested}).`;
}

export async function validateCartStockAvailability(
  supabase: SupabaseClient,
  items: CartItem[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const quantities = aggregateCartQuantities(items);
  const productIds = [...quantities.keys()];

  if (productIds.length === 0) {
    return { ok: false, error: "El carrito está vacío." };
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, name, stock")
    .in("id", productIds);

  if (error) {
    console.error("[validateCartStockAvailability] fetch failed:", error.message);
    return {
      ok: false,
      error: "No se pudo verificar el stock. Intentá nuevamente.",
    };
  }

  const stockById = new Map<string, ProductStockRow>(
    (data ?? []).map((row) => [row.id, row as ProductStockRow]),
  );

  const problems: string[] = [];

  for (const [productId, requestedQty] of quantities) {
    const product = stockById.get(productId);
    const fallbackName =
      items.find((item) => item.id === productId)?.name ?? "Un producto";

    if (!product) {
      problems.push(`"${fallbackName}" ya no está disponible.`);
      continue;
    }

    if (product.stock < requestedQty) {
      problems.push(formatStockError(product.name, product.stock, requestedQty));
    }
  }

  if (problems.length === 0) {
    return { ok: true };
  }

  return {
    ok: false,
    error:
      problems.length === 1
        ? problems[0]
        : `No hay stock suficiente:\n${problems.join("\n")}`,
  };
}

export async function decrementStockForOrderItems(
  supabase: SupabaseClient,
  items: CartItem[],
  updatedAt: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const quantities = aggregateCartQuantities(items);

  for (const [productId, quantity] of quantities) {
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id, name, stock")
      .eq("id", productId)
      .single();

    if (fetchError || !product) {
      console.error(
        "[decrementStockForOrderItems] fetch failed:",
        fetchError?.message ?? "product missing",
      );
      return {
        ok: false,
        error: "No se pudo actualizar el stock del pedido.",
      };
    }

    if (product.stock < quantity) {
      return {
        ok: false,
        error: formatStockError(product.name, product.stock, quantity),
      };
    }

    const { data: updated, error: updateError } = await supabase
      .from("products")
      .update({
        stock: product.stock - quantity,
        updated_at: updatedAt,
      })
      .eq("id", productId)
      .eq("stock", product.stock)
      .select("id")
      .maybeSingle();

    if (updateError || !updated) {
      console.error(
        "[decrementStockForOrderItems] update failed:",
        updateError?.message ?? "optimistic lock conflict",
      );
      return {
        ok: false,
        error: "No se pudo actualizar el stock del pedido. Intentá nuevamente.",
      };
    }
  }

  return { ok: true };
}

export async function restoreStockForOrderItems(
  supabase: SupabaseClient,
  items: CartItem[],
  updatedAt: string,
): Promise<void> {
  const quantities = aggregateCartQuantities(items);

  for (const [productId, quantity] of quantities) {
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .single();

    if (!product) continue;

    await supabase
      .from("products")
      .update({
        stock: product.stock + quantity,
        updated_at: updatedAt,
      })
      .eq("id", productId);
  }
}
