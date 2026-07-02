import "server-only";

import type { Product } from "@/lib/data";
import {
  getCatalogProducts,
  getCatalogProductBySlug,
  getStoreProductBySlug,
} from "@/lib/store/repository";
import type { StoreProduct } from "@/lib/store/types";
import {
  getCategoryById,
  normalizeProductSlug,
} from "@/lib/catalog";

export type ProductPageData = StoreProduct;

let catalogValidated = false;

export async function getProducts(): Promise<Product[]> {
  const products = await getCatalogProducts();

  if (!catalogValidated && process.env.NODE_ENV === "development") {
    validateProductCatalog(products);
    catalogValidated = true;
  }

  return products;
}

export async function getProductBySlug(
  rawSlug: string,
): Promise<Product | undefined> {
  const slug = normalizeProductSlug(rawSlug);
  if (!slug) return undefined;
  const products = await getProducts();
  return products.find(
    (product) => normalizeProductSlug(product.slug) === slug,
  );
}

export async function getProductPageData(
  rawSlug: string,
): Promise<ProductPageData | undefined> {
  const slug = normalizeProductSlug(rawSlug);
  if (!slug) return undefined;
  return getCatalogProductBySlug(slug);
}

export async function getStoreProductBySlugForPage(
  rawSlug: string,
): Promise<ProductPageData | undefined> {
  const slug = normalizeProductSlug(rawSlug);
  if (!slug) return undefined;
  return getStoreProductBySlug(slug);
}

export async function getProductsByCategoryId(
  categoryId: string,
): Promise<Product[]> {
  const meta = getCategoryById(categoryId);
  if (!meta) return [];
  const products = await getProducts();
  return products.filter(
    (product) => product.category === meta.productCategory,
  );
}

function validateProductCatalog(products: Product[]): void {
  const seen = new Map<string, string>();

  for (const product of products) {
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

export function getProductImages(product: ProductPageData): string[] {
  if (product.images?.length) return product.images;
  return product.image ? [product.image] : [];
}

export function getPriceWithoutTax(price: number): number {
  if (!price || price <= 0) return 0;
  return Math.round(price / 1.21);
}
