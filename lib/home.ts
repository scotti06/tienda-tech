import type { Product } from "@/lib/data";

export type HomeCategoryFilter = "all" | "fundas" | "vidrios" | "carga" | "airpods";

export const homeCategoryNav: { id: HomeCategoryFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "fundas", label: "Fundas" },
  { id: "vidrios", label: "Vidrios" },
  { id: "airpods", label: "AirPods" },
  { id: "carga", label: "Cargadores" },
];

const featuredIds = ["1", "2", "3", "5", "7", "8"];
const newIds = ["4", "6", "8", "2"];
const bestsellerIds = ["1", "3", "5", "7"];

const byIds = (products: Product[], ids: string[]) =>
  ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

export function getHomeFeatured(products: Product[]) {
  return byIds(products, featuredIds);
}

export function getHomeNew(products: Product[]) {
  return byIds(products, newIds);
}

export function getHomeBestsellers(products: Product[]) {
  return byIds(products, bestsellerIds);
}

export function filterHomeProducts(
  list: Product[],
  categoryId: HomeCategoryFilter,
): Product[] {
  if (categoryId === "all") return list;
  return list.filter((product) => product.categoryId === categoryId);
}

export function getSimilarProducts(current: Product, allProducts: Product[]): Product[] {
  const sameCategory = allProducts.filter(
    (item) =>
      item.id !== current.id && item.categoryId === current.categoryId,
  );

  const related = allProducts.filter(
    (item) =>
      item.id !== current.id &&
      !sameCategory.some((categoryItem) => categoryItem.id === item.id),
  );

  return [...sameCategory, ...related];
}
