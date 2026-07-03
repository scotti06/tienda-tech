type FundasProductRef = {
  categoryId?: string | null;
  category?: string | null;
};

export function isFundasProduct(product: FundasProductRef): boolean {
  return product.categoryId === "fundas";
}
