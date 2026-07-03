export type ProductVariant = {
  id: string;
  productId: string;
  productModelId?: string | null;
  colorName: string;
  colorHex: string;
  stock: number;
  active: boolean;
  image?: string | null;
  createdAt: string;
};

export type ProductVariantInput = {
  id?: string;
  productModelId?: string | null;
  colorName: string;
  colorHex: string;
  stock: number;
  active?: boolean;
  image?: string | null;
};
