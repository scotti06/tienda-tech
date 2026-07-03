import type { SupabaseClient } from "@supabase/supabase-js";
import type { CartItem } from "@/lib/cart";

type ProductStockRow = {
  id: string;
  name: string;
  stock: number;
};

type VariantStockRow = {
  id: string;
  product_id: string;
  color_name: string;
  stock: number;
};

type StockLine = {
  key: string;
  label: string;
  requested: number;
  available: number;
};

function formatStockError(label: string, available: number, requested: number): string {
  if (available <= 0) {
    return `"${label}" no tiene stock disponible.`;
  }

  const unitLabel = available === 1 ? "unidad disponible" : "unidades disponibles";
  return `"${label}" solo tiene ${available} ${unitLabel} (pediste ${requested}).`;
}

function aggregateProductQuantities(items: CartItem[]): Map<string, number> {
  const quantities = new Map<string, number>();

  for (const item of items) {
    if (item.variantId) continue;
    quantities.set(item.id, (quantities.get(item.id) ?? 0) + item.quantity);
  }

  return quantities;
}

function aggregateVariantQuantities(items: CartItem[]): Map<string, number> {
  const quantities = new Map<string, number>();

  for (const item of items) {
    if (!item.variantId) continue;
    quantities.set(item.variantId, (quantities.get(item.variantId) ?? 0) + item.quantity);
  }

  return quantities;
}

export function aggregateCartQuantities(items: CartItem[]): Map<string, number> {
  return aggregateProductQuantities(items);
}

export async function validateCartStockAvailability(
  supabase: SupabaseClient,
  items: CartItem[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (items.length === 0) {
    return { ok: false, error: "El carrito está vacío." };
  }

  const productQuantities = aggregateProductQuantities(items);
  const variantQuantities = aggregateVariantQuantities(items);
  const problems: string[] = [];

  if (productQuantities.size > 0) {
    const productIds = [...productQuantities.keys()];
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

    for (const [productId, requestedQty] of productQuantities) {
      const product = stockById.get(productId);
      const fallbackName =
        items.find((item) => item.id === productId && !item.variantId)?.name ??
        "Un producto";

      if (!product) {
        problems.push(`"${fallbackName}" ya no está disponible.`);
        continue;
      }

      if (product.stock < requestedQty) {
        problems.push(formatStockError(product.name, product.stock, requestedQty));
      }
    }
  }

  if (variantQuantities.size > 0) {
    const variantIds = [...variantQuantities.keys()];
    const { data, error } = await supabase
      .from("product_variants")
      .select("id, product_id, color_name, stock")
      .in("id", variantIds);

    if (error) {
      console.error("[validateCartStockAvailability] variant fetch failed:", error.message);
      return {
        ok: false,
        error: "No se pudo verificar el stock. Intentá nuevamente.",
      };
    }

    const stockByVariantId = new Map<string, VariantStockRow>(
      (data ?? []).map((row) => [row.id, row as VariantStockRow]),
    );

    for (const [variantId, requestedQty] of variantQuantities) {
      const variant = stockByVariantId.get(variantId);
      const fallbackItem = items.find((item) => item.variantId === variantId);
      const fallbackName = fallbackItem
        ? `${fallbackItem.name} (${fallbackItem.colorName ?? "color"})`
        : "Una variante";

      if (!variant) {
        problems.push(`"${fallbackName}" ya no está disponible.`);
        continue;
      }

      if (variant.stock < requestedQty) {
        problems.push(formatStockError(fallbackName, variant.stock, requestedQty));
      }
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
  const productQuantities = aggregateProductQuantities(items);
  const variantQuantities = aggregateVariantQuantities(items);

  for (const [productId, quantity] of productQuantities) {
    const result = await decrementProductStock(
      supabase,
      productId,
      quantity,
      updatedAt,
    );
    if (!result.ok) return result;
  }

  for (const [variantId, quantity] of variantQuantities) {
    const result = await decrementVariantStock(
      supabase,
      variantId,
      quantity,
      updatedAt,
    );
    if (!result.ok) return result;
  }

  return { ok: true };
}

async function decrementProductStock(
  supabase: SupabaseClient,
  productId: string,
  quantity: number,
  updatedAt: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
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

  return { ok: true };
}

async function decrementVariantStock(
  supabase: SupabaseClient,
  variantId: string,
  quantity: number,
  _updatedAt: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: variant, error: fetchError } = await supabase
    .from("product_variants")
    .select("id, color_name, stock")
    .eq("id", variantId)
    .single();

  if (fetchError || !variant) {
    console.error(
      "[decrementStockForOrderItems] variant fetch failed:",
      fetchError?.message ?? "variant missing",
    );
    return {
      ok: false,
      error: "No se pudo actualizar el stock del pedido.",
    };
  }

  if (variant.stock < quantity) {
    return {
      ok: false,
      error: formatStockError(`Color ${variant.color_name}`, variant.stock, quantity),
    };
  }

  const { data: updated, error: updateError } = await supabase
    .from("product_variants")
    .update({ stock: variant.stock - quantity })
    .eq("id", variantId)
    .eq("stock", variant.stock)
    .select("id")
    .maybeSingle();

  if (updateError || !updated) {
    console.error(
      "[decrementStockForOrderItems] variant update failed:",
      updateError?.message ?? "optimistic lock conflict",
    );
    return {
      ok: false,
      error: "No se pudo actualizar el stock del pedido. Intentá nuevamente.",
    };
  }

  return { ok: true };
}

export async function restoreStockForOrderItems(
  supabase: SupabaseClient,
  items: CartItem[],
  updatedAt: string,
): Promise<void> {
  const productQuantities = aggregateProductQuantities(items);
  const variantQuantities = aggregateVariantQuantities(items);

  for (const [productId, quantity] of productQuantities) {
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

  for (const [variantId, quantity] of variantQuantities) {
    const { data: variant } = await supabase
      .from("product_variants")
      .select("stock")
      .eq("id", variantId)
      .single();

    if (!variant) continue;

    await supabase
      .from("product_variants")
      .update({ stock: variant.stock + quantity })
      .eq("id", variantId);
  }
}
