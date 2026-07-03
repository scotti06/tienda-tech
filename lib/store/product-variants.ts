import "server-only";

import { getServerClient } from "@/lib/supabase/server";
import type {
  ProductVariant,
  ProductVariantInput,
} from "@/lib/store/product-variant-types";

export type { ProductVariant, ProductVariantInput } from "@/lib/store/product-variant-types";

type ProductVariantRow = {
  id: string;
  product_id: string;
  product_model_id: string | null;
  color_name: string;
  color_hex: string;
  stock: number;
  active: boolean;
  image: string | null;
  created_at: string;
};

function mapVariantRow(row: ProductVariantRow): ProductVariant {
  return {
    id: row.id,
    productId: row.product_id,
    productModelId: row.product_model_id,
    colorName: row.color_name,
    colorHex: row.color_hex,
    stock: row.stock,
    active: row.active,
    image: row.image,
    createdAt: row.created_at,
  };
}

export function sumActiveVariantStock(
  variants: Pick<ProductVariant, "stock" | "active">[],
): number {
  return variants
    .filter((variant) => variant.active)
    .reduce((sum, variant) => sum + Math.max(0, variant.stock), 0);
}

export async function getActiveProductVariants(
  productId: string,
): Promise<ProductVariant[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`getActiveProductVariants: ${error.message}`);
  }

  return ((data ?? []) as ProductVariantRow[]).map(mapVariantRow);
}

export async function getActiveProductVariantsByModel(
  productId: string,
  modelId: string,
): Promise<ProductVariant[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .eq("product_model_id", modelId)
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`getActiveProductVariantsByModel: ${error.message}`);
  }

  return ((data ?? []) as ProductVariantRow[]).map(mapVariantRow);
}

export async function getProductVariants(
  productId: string,
): Promise<ProductVariant[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`getProductVariants: ${error.message}`);
  }

  return ((data ?? []) as ProductVariantRow[]).map(mapVariantRow);
}

export async function getProductVariantsByModel(
  productId: string,
  modelId: string,
): Promise<ProductVariant[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .eq("product_model_id", modelId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`getProductVariantsByModel: ${error.message}`);
  }

  return ((data ?? []) as ProductVariantRow[]).map(mapVariantRow);
}

export async function syncProductVariantsForModel(
  productId: string,
  modelId: string,
  variants: ProductVariantInput[],
): Promise<ProductVariant[]> {
  const supabase = getServerClient();
  const normalized = variants
    .map((variant) => {
      const row = {
        product_id: productId,
        product_model_id: modelId,
        color_name: variant.colorName.trim(),
        color_hex: variant.colorHex.trim(),
        stock: Math.max(0, Number(variant.stock) || 0),
        active: variant.active !== false,
        image: variant.image?.trim() || null,
      };

      return variant.id ? { ...row, id: variant.id } : row;
    })
    .filter((variant) => variant.color_name && variant.color_hex);

  const { data: existingRows, error: existingError } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", productId)
    .eq("product_model_id", modelId);

  if (existingError) {
    throw new Error(`syncProductVariantsForModel: ${existingError.message}`);
  }

  const keepIds = new Set(
    normalized
      .map((variant) => ("id" in variant ? variant.id : undefined))
      .filter(Boolean) as string[],
  );
  const deleteIds = (existingRows ?? [])
    .map((row) => row.id as string)
    .filter((id) => !keepIds.has(id));

  if (deleteIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("product_variants")
      .delete()
      .in("id", deleteIds);

    if (deleteError) {
      throw new Error(`syncProductVariantsForModel delete: ${deleteError.message}`);
    }
  }

  const toUpdate = normalized.filter((variant) => "id" in variant);
  const toInsert = normalized.filter((variant) => !("id" in variant));

  if (toUpdate.length > 0) {
    const { error: updateError } = await supabase
      .from("product_variants")
      .upsert(toUpdate, { onConflict: "id" });

    if (updateError) {
      throw new Error(`syncProductVariantsForModel upsert: ${updateError.message}`);
    }
  }

  if (toInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("product_variants")
      .insert(toInsert);

    if (insertError) {
      throw new Error(`syncProductVariantsForModel insert: ${insertError.message}`);
    }
  }

  return getProductVariantsByModel(productId, modelId);
}

/** Legacy: product-level variants without model (non-silicone). */
export async function syncProductVariants(
  productId: string,
  variants: ProductVariantInput[],
): Promise<ProductVariant[]> {
  const supabase = getServerClient();
  const normalized = variants
    .map((variant) => {
      const row = {
        product_id: productId,
        product_model_id: null,
        color_name: variant.colorName.trim(),
        color_hex: variant.colorHex.trim(),
        stock: Math.max(0, Number(variant.stock) || 0),
        active: variant.active !== false,
        image: variant.image?.trim() || null,
      };

      return variant.id ? { ...row, id: variant.id } : row;
    })
    .filter((variant) => variant.color_name && variant.color_hex);

  const { data: existingRows, error: existingError } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", productId)
    .is("product_model_id", null);

  if (existingError) {
    throw new Error(`syncProductVariants: ${existingError.message}`);
  }

  const keepIds = new Set(
    normalized
      .map((variant) => ("id" in variant ? variant.id : undefined))
      .filter(Boolean) as string[],
  );
  const deleteIds = (existingRows ?? [])
    .map((row) => row.id as string)
    .filter((id) => !keepIds.has(id));

  if (deleteIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("product_variants")
      .delete()
      .in("id", deleteIds);

    if (deleteError) {
      throw new Error(`syncProductVariants delete: ${deleteError.message}`);
    }
  }

  if (normalized.length === 0) {
    return getProductVariants(productId);
  }

  const toUpdate = normalized.filter((variant) => "id" in variant);
  const toInsert = normalized.filter((variant) => !("id" in variant));

  if (toUpdate.length > 0) {
    const { error: updateError } = await supabase
      .from("product_variants")
      .upsert(toUpdate, { onConflict: "id" });

    if (updateError) {
      throw new Error(`syncProductVariants upsert: ${updateError.message}`);
    }
  }

  if (toInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("product_variants")
      .insert(toInsert);

    if (insertError) {
      throw new Error(`syncProductVariants insert: ${insertError.message}`);
    }
  }

  return getProductVariants(productId);
}
