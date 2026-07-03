import "server-only";

import { getServerClient } from "@/lib/supabase/server";
import type {
  ProductModel,
  ProductModelInput,
} from "@/lib/store/product-model-types";
import {
  getProductVariantsByModel,
  getActiveProductVariantsByModel,
  sumActiveVariantStock,
  syncProductVariantsForModel,
} from "@/lib/store/product-variants";

export type { ProductModel, ProductModelInput } from "@/lib/store/product-model-types";

type ProductModelRow = {
  id: string;
  product_id: string;
  model_name: string;
  stock: number;
  active: boolean;
  created_at: string;
};

function mapModelRow(row: ProductModelRow): ProductModel {
  return {
    id: row.id,
    productId: row.product_id,
    modelName: row.model_name,
    stock: row.stock,
    active: row.active,
    createdAt: row.created_at,
  };
}

export function sumActiveModelStock(models: Pick<ProductModel, "stock" | "active">[]): number {
  return models
    .filter((model) => model.active)
    .reduce((sum, model) => sum + Math.max(0, model.stock), 0);
}

export async function syncModelStockFromVariants(
  productId: string,
  modelId: string,
): Promise<number> {
  const supabase = getServerClient();
  const variants = await getProductVariantsByModel(productId, modelId);
  const totalStock = sumActiveVariantStock(variants);

  const { error } = await supabase
    .from("product_models")
    .update({ stock: totalStock })
    .eq("id", modelId)
    .eq("product_id", productId);

  if (error) {
    throw new Error(`syncModelStockFromVariants: ${error.message}`);
  }

  return totalStock;
}

export async function getProductModelsWithVariants(
  productId: string,
): Promise<ProductModel[]> {
  const models = await getProductModels(productId);
  const modelsWithVariants = await Promise.all(
    models.map(async (model) => {
      const variants = await getProductVariantsByModel(productId, model.id);
      return {
        ...model,
        variants: variants.map((variant) => ({
          id: variant.id,
          productModelId: variant.productModelId,
          colorName: variant.colorName,
          colorHex: variant.colorHex,
          stock: variant.stock,
          active: variant.active,
          image: variant.image,
        })),
      };
    }),
  );

  return modelsWithVariants;
}

export async function syncProductStockFromModels(productId: string): Promise<number> {
  const supabase = getServerClient();
  const models = await getProductModels(productId);
  const totalStock = sumActiveModelStock(models);

  const { error } = await supabase
    .from("products")
    .update({
      stock: totalStock,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (error) {
    throw new Error(`syncProductStockFromModels: ${error.message}`);
  }

  return totalStock;
}

export async function getActiveProductModels(
  productId: string,
): Promise<ProductModel[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("product_models")
    .select("*")
    .eq("product_id", productId)
    .eq("active", true)
    .order("model_name", { ascending: true });

  if (error) {
    throw new Error(`getActiveProductModels: ${error.message}`);
  }

  return ((data ?? []) as ProductModelRow[]).map(mapModelRow);
}

export async function getActiveProductModelsWithVariants(
  productId: string,
): Promise<ProductModel[]> {
  const models = await getActiveProductModels(productId);
  const modelsWithVariants = await Promise.all(
    models.map(async (model) => {
      const variants = await getActiveProductVariantsByModel(productId, model.id);
      return { ...model, variants };
    }),
  );

  return modelsWithVariants;
}

export async function getProductModels(
  productId: string,
): Promise<ProductModel[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("product_models")
    .select("*")
    .eq("product_id", productId)
    .order("model_name", { ascending: true });

  if (error) {
    throw new Error(`getProductModels: ${error.message}`);
  }

  return ((data ?? []) as ProductModelRow[]).map(mapModelRow);
}

export async function adjustProductModelStock(
  productId: string,
  modelId: string,
  delta: number,
): Promise<{ model: ProductModel; totalStock: number }> {
  const supabase = getServerClient();
  const { data: currentRow, error: fetchError } = await supabase
    .from("product_models")
    .select("*")
    .eq("id", modelId)
    .eq("product_id", productId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`adjustProductModelStock: ${fetchError.message}`);
  }

  if (!currentRow) {
    throw new Error("Modelo no encontrado.");
  }

  const nextStock = Math.max(0, (currentRow.stock as number) + delta);

  const { data: updatedRow, error: updateError } = await supabase
    .from("product_models")
    .update({ stock: nextStock })
    .eq("id", modelId)
    .eq("product_id", productId)
    .select("*")
    .single();

  if (updateError) {
    throw new Error(`adjustProductModelStock update: ${updateError.message}`);
  }

  const totalStock = await syncProductStockFromModels(productId);

  return {
    model: mapModelRow(updatedRow as ProductModelRow),
    totalStock,
  };
}

export async function syncProductModels(
  productId: string,
  models: ProductModelInput[],
  options?: { syncVariantsPerModel?: boolean },
): Promise<{ models: ProductModel[]; totalStock: number }> {
  const supabase = getServerClient();
  const syncVariantsPerModel = options?.syncVariantsPerModel ?? false;
  const normalized = models
    .map((model) => {
      const row = {
        product_id: productId,
        model_name: model.modelName.trim(),
        stock: Math.max(0, Number(model.stock) || 0),
        active: model.active !== false,
      };

      return model.id ? { ...row, id: model.id } : row;
    })
    .filter((model) => model.model_name);

  const { data: existingRows, error: existingError } = await supabase
    .from("product_models")
    .select("id")
    .eq("product_id", productId);

  if (existingError) {
    throw new Error(`syncProductModels: ${existingError.message}`);
  }

  const keepIds = new Set(
    normalized
      .map((model) => ("id" in model ? model.id : undefined))
      .filter(Boolean) as string[],
  );
  const deleteIds = (existingRows ?? [])
    .map((row) => row.id as string)
    .filter((id) => !keepIds.has(id));

  if (deleteIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("product_models")
      .delete()
      .in("id", deleteIds);

    if (deleteError) {
      throw new Error(`syncProductModels delete: ${deleteError.message}`);
    }
  }

  const toUpdate = normalized.filter((model) => "id" in model);
  const toInsert = normalized.filter((model) => !("id" in model));

  if (toUpdate.length > 0) {
    const { error: updateError } = await supabase
      .from("product_models")
      .upsert(toUpdate, { onConflict: "id" });

    if (updateError) {
      throw new Error(`syncProductModels upsert: ${updateError.message}`);
    }
  }

  if (toInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("product_models")
      .insert(toInsert);

    if (insertError) {
      throw new Error(`syncProductModels insert: ${insertError.message}`);
    }
  }

  const syncedModels = await getProductModels(productId);

  if (syncVariantsPerModel) {
    for (const input of models) {
      if (!input.modelName.trim()) continue;

      const syncedModel = syncedModels.find(
        (model) =>
          model.modelName.trim().toLowerCase() ===
          input.modelName.trim().toLowerCase(),
      );

      if (!syncedModel) continue;

      await syncProductVariantsForModel(
        productId,
        syncedModel.id,
        input.variants ?? [],
      );
      await syncModelStockFromVariants(productId, syncedModel.id);
    }
  }

  const totalStock = await syncProductStockFromModels(productId);

  return { models: await getProductModelsWithVariants(productId), totalStock };
}
