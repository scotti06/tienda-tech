import { categoryCatalog } from "@/lib/catalog";
import { getStockLevel } from "@/lib/store/types";
import type { StoreProduct } from "@/lib/store/types";

export type AdminCategoryFilter =
  | "all"
  | "accesorios"
  | "fundas"
  | "cargadores"
  | "auriculares"
  | "tablets"
  | "celulares"
  | "otros";

export type AdminStockFilter = "all" | "in_stock" | "low" | "out";

export type AdminStatusFilter = "all" | "active" | "inactive";

export const ADMIN_CATEGORY_FILTERS: {
  id: AdminCategoryFilter;
  label: string;
}[] = [
  { id: "all", label: "Todas las categorías" },
  { id: "accesorios", label: "Accesorios" },
  { id: "fundas", label: "Fundas" },
  { id: "cargadores", label: "Cargadores" },
  { id: "auriculares", label: "Auriculares" },
  { id: "tablets", label: "Tablets" },
  { id: "celulares", label: "Celulares" },
  { id: "otros", label: "Otros" },
];

export const ADMIN_STOCK_FILTERS: { id: AdminStockFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "in_stock", label: "Con stock" },
  { id: "low", label: "Stock bajo" },
  { id: "out", label: "Sin stock" },
];

export const ADMIN_STATUS_FILTERS: {
  id: AdminStatusFilter;
  label: string;
}[] = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Activos" },
  { id: "inactive", label: "Inactivos" },
];

const SPECIFIC_CATEGORY_FILTERS: Exclude<AdminCategoryFilter, "all" | "otros">[] =
  [
    "accesorios",
    "fundas",
    "cargadores",
    "auriculares",
    "tablets",
    "celulares",
  ];

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getCategoryDisplayName(categoryId: string): string {
  return (
    categoryCatalog.find((category) => category.id === categoryId)?.name ??
    categoryId
  );
}

function getSearchHaystack(product: StoreProduct): string {
  return normalize(
    [
      product.name,
      product.category,
      product.subcategory,
      product.sku,
      product.brand,
      getCategoryDisplayName(product.categoryId),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function matchesProductSearch(
  product: StoreProduct,
  query: string,
): boolean {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;
  return getSearchHaystack(product).includes(normalizedQuery);
}

function matchesSpecificCategory(
  product: StoreProduct,
  filter: Exclude<AdminCategoryFilter, "all" | "otros">,
): boolean {
  const haystack = getSearchHaystack(product);

  switch (filter) {
    case "fundas":
      return product.categoryId === "fundas" || haystack.includes("funda");
    case "cargadores":
      return product.categoryId === "carga" || haystack.includes("cargador");
    case "auriculares":
      return (
        product.categoryId === "airpods" ||
        haystack.includes("airpod") ||
        haystack.includes("auricular")
      );
    case "accesorios":
      return (
        product.categoryId === "vidrios" ||
        haystack.includes("vidrio") ||
        haystack.includes("templado") ||
        haystack.includes("accesorio")
      );
    case "tablets":
      return haystack.includes("tablet") || haystack.includes("ipad");
    case "celulares":
      return haystack.includes("iphone") || haystack.includes("celular");
    default:
      return false;
  }
}

export function matchesCategoryFilter(
  product: StoreProduct,
  filter: AdminCategoryFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "otros") {
    return !SPECIFIC_CATEGORY_FILTERS.some((item) =>
      matchesSpecificCategory(product, item),
    );
  }
  return matchesSpecificCategory(product, filter);
}

export function matchesStockFilter(
  product: StoreProduct,
  filter: AdminStockFilter,
): boolean {
  if (filter === "all") return true;

  const stock = product.stock ?? 0;
  const level = getStockLevel(stock);

  if (filter === "in_stock") return stock > 0;
  if (filter === "low") return level === "low";
  if (filter === "out") return level === "out";
  return true;
}

export function isProductActive(product: StoreProduct): boolean {
  return product.active !== false;
}

export function matchesStatusFilter(
  product: StoreProduct,
  filter: AdminStatusFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "active") return isProductActive(product);
  if (filter === "inactive") return !isProductActive(product);
  return true;
}

export function filterAdminProducts(
  products: StoreProduct[],
  options: {
    query: string;
    category: AdminCategoryFilter;
    stock: AdminStockFilter;
    status: AdminStatusFilter;
  },
): StoreProduct[] {
  return products.filter(
    (product) =>
      matchesProductSearch(product, options.query) &&
      matchesCategoryFilter(product, options.category) &&
      matchesStockFilter(product, options.stock) &&
      matchesStatusFilter(product, options.status),
  );
}
