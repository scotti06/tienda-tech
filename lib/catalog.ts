import {
  getImageFrame,
  products,
  type Category,
  type Product,
} from "@/lib/data";

export type CategoryMeta = Category & {
  slug: string;
  path: string;
  productCategory: string;
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
  };
};

export const categoryCatalog: CategoryMeta[] = [
  {
    id: "fundas",
    slug: "fundas",
    path: "/fundas",
    name: "Fundas",
    description: "Para iPhone · consultar modelos",
    href: "/fundas",
    accent: "group-hover:shadow-[#9D4EDD]/15",
    image: "/categories/fundas.webp",
    imageFrame: { width: 300, height: 320 },
    productCategory: "Fundas",
    hero: {
      eyebrow: "Fundas",
      title: "Protección para",
      highlight: "tu iPhone",
      description:
        "Fundas compatibles con distintos modelos de iPhone. Consultá stock y precios en tienda.",
    },
  },
  {
    id: "vidrios",
    slug: "templados",
    path: "/templados",
    name: "Vidrios templados",
    description: "Protección de pantalla iPhone",
    href: "/templados",
    accent: "group-hover:shadow-[#00B4D8]/15",
    image: "/categories/vidrios.webp",
    imageFrame: { width: 340, height: 240 },
    productCategory: "Vidrios templados",
    hero: {
      eyebrow: "Vidrios templados",
      title: "Pantalla",
      highlight: "protegida",
      description:
        "Vidrios templados para iPhone. Consultá medidas y modelos disponibles.",
    },
  },
  {
    id: "carga",
    slug: "cargadores",
    path: "/cargadores",
    name: "Cargadores",
    description: "Originales Apple para iPhone",
    href: "/cargadores",
    accent: "group-hover:shadow-[#9D4EDD]/15",
    image: "/categories/carga.webp",
    imageFrame: { width: 280, height: 280 },
    productCategory: "Cargadores",
    hero: {
      eyebrow: "Cargadores",
      title: "Carga original",
      highlight: "para iPhone",
      description:
        "Cargadores originales Apple. Consultá modelos disponibles en el local.",
    },
  },
  {
    id: "airpods",
    slug: "airpods",
    path: "/airpods",
    name: "AirPods",
    description: "Consultar modelos disponibles",
    href: "/airpods",
    accent: "group-hover:shadow-[#9D4EDD]/15",
    image: "/categories/airpods.webp",
    imageFrame: { width: 300, height: 300 },
    productCategory: "AirPods",
    hero: {
      eyebrow: "AirPods",
      title: "Audio",
      highlight: "Apple",
      description:
        "AirPods y variantes. Consultá modelos y disponibilidad por WhatsApp.",
    },
  },
];

export const mainNavLinks = [
  { label: "Inicio", href: "/" },
  { label: "Tienda", href: "/tienda" },
  { label: "Categorías", href: "/tienda#categorias" },
  { label: "Contacto", href: "/contacto" },
  { label: "Carrito", href: "/carrito" },
];

export function getCategoryByPath(path: string): CategoryMeta | undefined {
  return categoryCatalog.find((c) => c.path === path);
}

export function getCategoryById(id: string): CategoryMeta | undefined {
  return categoryCatalog.find((c) => c.id === id);
}

export function getProductsByCategoryId(categoryId: string): Product[] {
  const meta = getCategoryById(categoryId);
  if (!meta) return [];
  return products.filter((p) => p.category === meta.productCategory);
}

export function normalizeProductSlug(slug: string): string {
  try {
    return decodeURIComponent(slug).trim().toLowerCase();
  } catch {
    return slug.trim().toLowerCase();
  }
}

export function getProductHref(product: Pick<Product, "id" | "slug" | "name">): string {
  const slug = product.slug?.trim();
  if (!slug) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getProductHref] slug vacío", {
        id: product.id,
        name: product.name,
      });
    }
    return "/tienda";
  }
  return `/producto/${slug}`;
}

export function getProductBySlug(rawSlug: string): Product | undefined {
  const slug = normalizeProductSlug(rawSlug);
  if (!slug) return undefined;
  return products.find((p) => normalizeProductSlug(p.slug) === slug);
}

function validateProductCatalog(): void {
  if (process.env.NODE_ENV !== "development") return;

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

validateProductCatalog();

export function getAllCategoryPaths(): string[] {
  return categoryCatalog.map((c) => c.path);
}

if (process.env.NODE_ENV === "development") {
  for (const category of categoryCatalog) {
    if (!category.imageFrame?.width || !category.imageFrame?.height) {
      console.error("[category-catalog] imageFrame inválido", {
        id: category.id,
        name: category.name,
      });
    }
  }
}

/** Categorías con href actualizado para cards y footer */
export const navigableCategories: Category[] = categoryCatalog.map((meta) => ({
  id: meta.id,
  name: meta.name,
  description: meta.description,
  href: meta.href,
  accent: meta.accent,
  image: meta.image,
  imageFrame: getImageFrame(meta.imageFrame),
}));
