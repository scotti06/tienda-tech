export const FUNDAS_CATEGORY_IDS = ["fundas", "fundas-magsafe"] as const;

export type FundasProductRef = {
  categoryId?: string | null;
  category?: string | null;
  slug?: string | null;
  name?: string | null;
  subcategory?: string | null;
};

function normalizeFundasText(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const fundasCategoryIdSet = new Set<string>(FUNDAS_CATEGORY_IDS);

export function isMagSafeFundasProduct(product: FundasProductRef): boolean {
  const categoryId = normalizeFundasText(product.categoryId);
  if (categoryId === "fundas-magsafe") return true;

  const haystack = [
    product.name,
    product.slug,
    product.subcategory,
    product.category,
  ]
    .map(normalizeFundasText)
    .filter(Boolean)
    .join(" ");

  return haystack.includes("magsafe") && haystack.includes("funda");
}

/** Fundas (silicona, MagSafe y resto) con selector de modelo de iPhone. */
export function isFundasProduct(product: FundasProductRef): boolean {
  const categoryId = normalizeFundasText(product.categoryId);
  if (fundasCategoryIdSet.has(categoryId)) {
    return true;
  }

  return isMagSafeFundasProduct(product);
}
