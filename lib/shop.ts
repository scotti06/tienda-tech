import { products, type Product } from "@/lib/data";

export type ShopGroupId = "accesorios" | "tecnologia" | "hogar";
export type ShopFilterGroup = ShopGroupId | "all";
export type ShopFilterSubcategory = string | "all";

export type ShopGroup = {
  id: ShopGroupId;
  name: string;
  description: string;
  image: string;
  accent: string;
};

export type ShopSubcategory = {
  id: string;
  groupId: ShopGroupId;
  name: string;
  productCategory: string;
};

export const shopGroups: ShopGroup[] = [
  {
    id: "accesorios",
    name: "Accesorios",
    description: "Fundas, cargadores, auriculares y más",
    image: "/categories/fundas.webp",
    accent: "group-hover:shadow-[#9D4EDD]/15",
  },
  {
    id: "tecnologia",
    name: "Tecnología",
    description: "Gaming, audio y wearables",
    image: "/categories/airpods.webp",
    accent: "group-hover:shadow-[#00B4D8]/15",
  },
  {
    id: "hogar",
    name: "Hogar",
    description: "Streaming, termos y vasos",
    image: "/categories/carga.webp",
    accent: "group-hover:shadow-[#9D4EDD]/15",
  },
];

export const shopSubcategories: ShopSubcategory[] = [
  { id: "airpods", groupId: "accesorios", name: "Auriculares", productCategory: "AirPods" },
  { id: "carga", groupId: "accesorios", name: "Cargadores", productCategory: "Cargadores" },
  { id: "fundas", groupId: "accesorios", name: "Fundas", productCategory: "Fundas" },
  {
    id: "vidrios",
    groupId: "accesorios",
    name: "Vidrios templados",
    productCategory: "Vidrios templados",
  },
  {
    id: "consolas",
    groupId: "tecnologia",
    name: "Consolas y Gaming",
    productCategory: "Consolas y Gaming",
  },
  { id: "parlantes", groupId: "tecnologia", name: "Parlantes", productCategory: "Parlantes" },
  {
    id: "apple-watch",
    groupId: "tecnologia",
    name: "Apple Watch",
    productCategory: "Apple Watch",
  },
  { id: "tv-stick", groupId: "hogar", name: "TV Stick", productCategory: "TV Stick" },
  { id: "tv-box", groupId: "hogar", name: "TV Box", productCategory: "TV Box" },
  { id: "termos", groupId: "hogar", name: "Termos", productCategory: "Termos" },
  { id: "vasos", groupId: "hogar", name: "Vasos", productCategory: "Vasos" },
];

const subcategoryById = new Map(shopSubcategories.map((s) => [s.id, s]));

export function getSubcategoryById(id: string): ShopSubcategory | undefined {
  return subcategoryById.get(id);
}

export function getSubcategoriesForGroup(groupId: ShopFilterGroup): ShopSubcategory[] {
  if (groupId === "all") return shopSubcategories;
  return shopSubcategories.filter((s) => s.groupId === groupId);
}

export function getGroupForProduct(product: Product): ShopGroupId | undefined {
  return subcategoryById.get(product.categoryId)?.groupId;
}

export function countProductsByGroup(groupId: ShopGroupId): number {
  return products.filter((p) => getGroupForProduct(p) === groupId).length;
}

export function countProductsBySubcategory(subcategoryId: string): number {
  return products.filter((p) => p.categoryId === subcategoryId).length;
}

export type ShopFilterState = {
  query: string;
  groupId: ShopFilterGroup;
  subcategoryId: ShopFilterSubcategory;
};

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

function productSearchText(product: Product): string {
  const parts = [
    product.name,
    product.category,
    product.description ?? "",
    ...(product.tags ?? []),
  ];
  return parts.join(" ").toLowerCase();
}

export function filterShopProducts(
  list: Product[],
  { query, groupId, subcategoryId }: ShopFilterState,
): Product[] {
  const normalizedQuery = normalizeSearch(query);

  return list.filter((product) => {
    if (groupId !== "all") {
      const productGroup = getGroupForProduct(product);
      if (productGroup !== groupId) return false;
    }

    if (subcategoryId !== "all" && product.categoryId !== subcategoryId) {
      return false;
    }

    if (normalizedQuery && !productSearchText(product).includes(normalizedQuery)) {
      return false;
    }

    return true;
  });
}

const byIds = (ids: string[]) =>
  ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

export const shopBestsellers = byIds(["1", "3", "5", "7", "9", "12"]);

export type ShopSortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export const shopSortOptions: { value: ShopSortOption; label: string }[] = [
  { value: "featured", label: "Destacados" },
  { value: "newest", label: "Más recientes" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre: A-Z" },
  { value: "name-desc", label: "Nombre: Z-A" },
];

const featuredOrder = new Map(shopBestsellers.map((product, index) => [product.id, index]));

function comparePrice(a: number, b: number, ascending: boolean): number {
  const aMissing = a <= 0;
  const bMissing = b <= 0;
  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;
  return ascending ? a - b : b - a;
}

export function sortShopProducts(
  list: Product[],
  sort: ShopSortOption,
): Product[] {
  const sorted = [...list];

  switch (sort) {
    case "featured":
      sorted.sort((a, b) => {
        const aRank = featuredOrder.get(a.id) ?? Number.POSITIVE_INFINITY;
        const bRank = featuredOrder.get(b.id) ?? Number.POSITIVE_INFINITY;
        if (aRank !== bRank) return aRank - bRank;
        return Number(a.id) - Number(b.id);
      });
      break;
    case "newest":
      sorted.sort((a, b) => Number(b.id) - Number(a.id));
      break;
    case "price-asc":
      sorted.sort((a, b) => comparePrice(a.price, b.price, true));
      break;
    case "price-desc":
      sorted.sort((a, b) => comparePrice(a.price, b.price, false));
      break;
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
      break;
    case "name-desc":
      sorted.sort((a, b) => b.name.localeCompare(a.name, "es"));
      break;
  }

  return sorted;
}
