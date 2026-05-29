import { products, type Category, type Product } from "@/lib/data";

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

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllCategoryPaths(): string[] {
  return categoryCatalog.map((c) => c.path);
}

/** Categorías con href actualizado para cards y footer */
export const navigableCategories: Category[] = categoryCatalog.map(
  ({ id, name, description, href, accent }) => ({
    id,
    name,
    description,
    href,
    accent,
  }),
);
