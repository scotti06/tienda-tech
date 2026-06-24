import { products as seedProducts } from "@/lib/data";
import type { StoreData, StoreProduct } from "@/lib/store/types";

const defaultStockById: Record<string, number> = {
  "1": 24,
  "2": 18,
  "3": 32,
  "4": 12,
  "5": 8,
  "6": 15,
  "7": 6,
  "8": 0,
};

function buildStoreProduct(
  product: (typeof seedProducts)[number],
  index: number,
): StoreProduct {
  const brand =
    product.categoryId === "carga" ||
    product.categoryId === "airpods" ||
    product.name.toLowerCase().includes("apple")
      ? "Apple"
      : "Techstylebv";

  return {
    ...product,
    description: `${product.name}. Consultá modelos compatibles y disponibilidad en el local.`,
    subcategory: product.category,
    stock: defaultStockById[product.id] ?? 10,
    sku: `TS-${product.id.padStart(4, "0")}`,
    brand,
    images: [product.image],
    updatedAt: new Date().toISOString(),
  };
}

export function createInitialStore(): StoreData {
  return {
    version: 1,
    products: seedProducts.map(buildStoreProduct),
    orders: [],
    notifications: [],
  };
}
