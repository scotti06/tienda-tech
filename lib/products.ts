import "server-only";

import type { Product } from "@/lib/data";
import {
  getCatalogProducts,
  getStoreProductBySlug,
} from "@/lib/store/repository";
import type { StoreProduct } from "@/lib/store/types";
import {
  getCategoryById,
  normalizeProductSlug,
} from "@/lib/catalog";

export type ProductPageData = StoreProduct;

export function getProducts(): Product[] {
  return getCatalogProducts();
}

export function getProductBySlug(rawSlug: string): Product | undefined {
  const slug = normalizeProductSlug(rawSlug);
  if (!slug) return undefined;
  return getProducts().find(
    (product) => normalizeProductSlug(product.slug) === slug,
  );
}

export function getProductPageData(rawSlug: string): ProductPageData | undefined {
  const slug = normalizeProductSlug(rawSlug);
  if (!slug) return undefined;
  return getStoreProductBySlug(slug);
}

export function getProductsByCategoryId(categoryId: string): Product[] {
  const meta = getCategoryById(categoryId);
  if (!meta) return [];
  return getProducts().filter((product) => product.category === meta.productCategory);
}

function validateProductCatalog(): void {
  if (process.env.NODE_ENV !== "development") return;

  const seen = new Map<string, string>();

  for (const product of getProducts()) {
    if (!product.imageFrame?.width || !product.imageFrame?.height) {
      console.error("[product-catalog] imageFrame inválido", {
        id: product.id,
        name: product.name,
      });
    }

    const slug = product.slug?.trim();

    if (!slug) {
      console.error("[product-catalog] slug vacío", {
        id: product.id,
        name: product.name,
      });
      continue;
    }

    const key = slug.toLowerCase();
    if (seen.has(key)) {
      console.error("[product-catalog] slug duplicado", {
        slug: key,
        ids: [seen.get(key), product.id],
      });
    } else {
      seen.set(key, product.id);
    }
  }
}

validateProductCatalog();

export function getProductImages(product: ProductPageData): string[] {
  if (product.images?.length) return product.images;
  return product.image ? [product.image] : [];
}

export function getPriceWithoutTax(price: number): number {
  if (!price || price <= 0) return 0;
  return Math.round(price / 1.21);
}
