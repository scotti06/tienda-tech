import { products, type Product } from "@/lib/data";

export type HomeCategoryFilter = "all" | "fundas" | "vidrios" | "carga" | "airpods";

export const homeCategoryNav: { id: HomeCategoryFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "fundas", label: "Fundas" },
  { id: "vidrios", label: "Vidrios" },
  { id: "airpods", label: "AirPods" },
  { id: "carga", label: "Cargadores" },
];

const byIds = (ids: string[]) =>
  ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

/** Curación comercial para la Home (la tienda mantiene el catálogo completo). */
export const homeFeatured = byIds(["1", "2", "3", "5", "7", "8"]);
export const homeNew = byIds(["4", "6", "8", "2"]);
export const homeBestsellers = byIds(["1", "3", "5", "7"]);

export function filterHomeProducts(
  list: Product[],
  categoryId: HomeCategoryFilter,
): Product[] {
  if (categoryId === "all") return list;
  return list.filter((p) => p.categoryId === categoryId);
}
