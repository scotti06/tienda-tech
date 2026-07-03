import type { ProductVariantInput } from "@/lib/store/product-variant-types";

export type ProductModel = {
  id: string;
  productId: string;
  modelName: string;
  stock: number;
  active: boolean;
  createdAt: string;
  variants?: ProductVariantInput[];
};

export type ProductModelInput = {
  id?: string;
  modelName: string;
  stock: number;
  active?: boolean;
  variants?: ProductVariantInput[];
};
