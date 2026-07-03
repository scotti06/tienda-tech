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
  productCategoryIds: string[];
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
  {
    id: "auriculares",
    groupId: "accesorios",
    name: "Auriculares",
    productCategory: "AirPods",
    productCategoryIds: ["airpods"],
  },
  {
    id: "cargadores",
    groupId: "accesorios",
    name: "Cargadores",
    productCategory: "Cargadores",
    productCategoryIds: ["carga"],
  },
  {
    id: "fundas",
    groupId: "accesorios",
    name: "Fundas",
    productCategory: "Fundas",
    productCategoryIds: ["fundas"],
  },
  {
    id: "vidrios",
    groupId: "accesorios",
    name: "Vidrios templados",
    productCategory: "Vidrios templados",
    productCategoryIds: ["vidrios"],
  },
  {
    id: "playstation",
    groupId: "tecnologia",
    name: "PlayStation",
    productCategory: "Consolas y Gaming",
    productCategoryIds: ["consolas"],
  },
  {
    id: "parlantes",
    groupId: "tecnologia",
    name: "Parlantes",
    productCategory: "Parlantes",
    productCategoryIds: ["parlantes"],
  },
  {
    id: "relojes-apple-watch",
    groupId: "tecnologia",
    name: "Relojes Apple Watch",
    productCategory: "Apple Watch",
    productCategoryIds: ["apple-watch"],
  },
  {
    id: "tv-stick-box",
    groupId: "hogar",
    name: "TV Stick / TV Box",
    productCategory: "TV Stick",
    productCategoryIds: ["tv-stick", "tv-box"],
  },
  {
    id: "termos-vasos",
    groupId: "hogar",
    name: "Termos y Vasos",
    productCategory: "Termos",
    productCategoryIds: ["termos", "vasos"],
  },
];

const subcategoryById = new Map(shopSubcategories.map((s) => [s.id, s]));

function subcategoryMatchesProduct(
  subcategory: ShopSubcategory,
  productCategoryId: string,
): boolean {
  return subcategory.productCategoryIds.includes(productCategoryId);
}

function findSubcategoryForProduct(
  product: Product,
): ShopSubcategory | undefined {
  return shopSubcategories.find((subcategory) =>
    subcategoryMatchesProduct(subcategory, product.categoryId),
  );
}

export function getSubcategoryById(id: string): ShopSubcategory | undefined {
  return subcategoryById.get(id);
}

export function getSubcategoriesForGroup(groupId: ShopFilterGroup): ShopSubcategory[] {
  if (groupId === "all") return shopSubcategories;
  return shopSubcategories.filter((s) => s.groupId === groupId);
}

export function getGroupForProduct(product: Product): ShopGroupId | undefined {
  return findSubcategoryForProduct(product)?.groupId;
}

export function countProductsByGroup(groupId: ShopGroupId): number {
  return products.filter((p) => getGroupForProduct(p) === groupId).length;
}

export function countProductsBySubcategory(subcategoryId: string): number {
  const subcategory = getSubcategoryById(subcategoryId);
  if (!subcategory) {
    return products.filter((p) => p.categoryId === subcategoryId).length;
  }

  return products.filter((p) =>
    subcategoryMatchesProduct(subcategory, p.categoryId),
  ).length;
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

export function filterInStockProducts(list: Product[]): Product[] {
  return list.filter((product) => (product.stock ?? 0) > 0);
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

    if (subcategoryId !== "all") {
      const subcategory = getSubcategoryById(subcategoryId);
      if (subcategory) {
        if (!subcategoryMatchesProduct(subcategory, product.categoryId)) {
          return false;
        }
      } else if (product.categoryId !== subcategoryId) {
        return false;
      }
    }

    if (normalizedQuery && !productSearchText(product).includes(normalizedQuery)) {
      return false;
    }

    return true;
  });
}

const SHOP_BESTSELLER_IDS = ["1", "3", "5", "7", "9", "12"];

const byIds = (catalog: Product[], ids: string[]) =>
  ids
    .map((id) => catalog.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

export function getShopBestsellers(catalog: Product[]): Product[] {
  return byIds(catalog, SHOP_BESTSELLER_IDS);
}

export function getShopBestsellersWithFallback(
  catalog: Product[],
  limit = 6,
): Product[] {
  const bestsellers = getShopBestsellers(catalog);
  if (bestsellers.length > 0) return bestsellers;

  const withBadge = catalog.filter((product) => product.badge);
  if (withBadge.length > 0) return withBadge.slice(0, limit);

  return catalog.slice(0, limit);
}

export type ShopFilterCounts = {
  groups: Partial<Record<ShopFilterGroup, number>>;
  subcategories: Record<string, number>;
};

export function getShopFilterCounts(
  catalog: Product[],
  query: string,
  activeGroup: ShopFilterGroup,
): ShopFilterCounts {
  const inStock = filterInStockProducts(catalog);
  const groups: Partial<Record<ShopFilterGroup, number>> = {
    all: inStock.length,
  };

  for (const group of shopGroups) {
    groups[group.id] = filterShopProducts(inStock, {
      query,
      groupId: group.id,
      subcategoryId: "all",
    }).length;
  }

  const subcategories: Record<string, number> = {
    all:
      activeGroup === "all"
        ? inStock.length
        : filterShopProducts(inStock, {
            query,
            groupId: activeGroup,
            subcategoryId: "all",
          }).length,
  };

  const subs =
    activeGroup === "all"
      ? shopSubcategories
      : shopSubcategories.filter((sub) => sub.groupId === activeGroup);

  for (const sub of subs) {
    subcategories[sub.id] = filterShopProducts(inStock, {
      query,
      groupId: activeGroup === "all" ? sub.groupId : activeGroup,
      subcategoryId: sub.id,
    }).length;
  }

  return { groups, subcategories };
}

export const shopBestsellers = byIds(products, SHOP_BESTSELLER_IDS);

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
