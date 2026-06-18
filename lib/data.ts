export type Category = {
  id: string;
  name: string;
  description: string;
  href: string;
  accent: string;
  image: string;
  /** Max frame (px) for carousel presentation; object-contain preserves aspect ratio. */
  imageFrame: { width: number; height: number };
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  cashPrice?: number;
  badge?: string;
  accent: string;
  image: string;
  /** Max frame (px) for card presentation; object-contain preserves aspect ratio. */
  imageFrame: { width: number; height: number };
  rating: number;
  freeShipping?: boolean;
  installments?: string;
};

export type Benefit = {
  id: string;
  title: string;
  description: string;
};

export type TrustPill = {
  id: string;
  title: string;
  subtitle: string;
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  cta: string;
  ctaHref: string;
  accent: string;
  productLabel: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
};

export const siteConfig = {
  name: "Techstylebv",
  tagline: "Accesorios para celulares",
  description:
    "Cargadores originales Apple, fundas, vidrios templados y AirPods para iPhone. Consultá modelos y disponibilidad.",
  whatsapp: "5491112345678",
  logo: "/brand/logo.png",
};

/** Enlaces de sección en la landing (anclas) */
export const homeSectionLinks = [
  { label: "Categorías", href: "#categorias" },
  { label: "Productos", href: "#productos" },
  { label: "Beneficios", href: "#beneficios" },
  { label: "Opiniones", href: "#opiniones" },
];

export const heroSlides: HeroSlide[] = [
  {
    id: "fundas",
    eyebrow: "Fundas",
    title: "Protección para",
    highlight: "tu iPhone",
    description:
      "Fundas compatibles con distintos modelos de iPhone. Consultá disponibilidad en tienda.",
    cta: "Ver fundas",
    ctaHref: "/fundas",
    accent: "from-[#9D4EDD]/25 via-[#00B4D8]/10 to-transparent",
    productLabel: "Funda iPhone",
  },
  {
    id: "vidrios",
    eyebrow: "Vidrios templados",
    title: "Pantalla",
    highlight: "protegida",
    description:
      "Vidrios templados para iPhone. Consultá medidas y modelos disponibles.",
    cta: "Ver vidrios",
    ctaHref: "/templados",
    accent: "from-[#00B4D8]/20 via-[#9D4EDD]/10 to-transparent",
    productLabel: "Vidrio templado",
  },
  {
    id: "carga",
    eyebrow: "Cargadores",
    title: "Carga original",
    highlight: "para iPhone",
    description:
      "Cargadores originales Apple para iPhone. Consultá modelos en stock.",
    cta: "Ver cargadores",
    ctaHref: "/cargadores",
    accent: "from-[#9D4EDD]/20 via-[#00B4D8]/10 to-transparent",
    productLabel: "Cargador original Apple",
  },
  {
    id: "airpods",
    eyebrow: "AirPods",
    title: "Audio",
    highlight: "Apple",
    description:
      "AirPods y variantes disponibles. Consultá modelos y precios en tienda.",
    cta: "Ver AirPods",
    ctaHref: "/airpods",
    accent: "from-[#9D4EDD]/15 via-[#00B4D8]/15 to-transparent",
    productLabel: "AirPods",
  },
];

export const trustPills: TrustPill[] = [
  { id: "1", title: "Cargadores", subtitle: "originales iPhone" },
  { id: "2", title: "Fundas", subtitle: "para iPhone" },
  { id: "3", title: "Vidrios", subtitle: "templados" },
  { id: "4", title: "AirPods", subtitle: "consultar stock" },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "funda-iphone",
    name: "Funda para iPhone",
    category: "Fundas",
    categoryId: "fundas",
    price: 0,
    accent: "bg-[radial-gradient(ellipse_at_50%_0%,#1a2e28_0%,#0a0c10_70%)]",
    image: "/products/funda-iphone.webp",
    imageFrame: { width: 204, height: 224 },
    rating: 0,
  },
  {
    id: "2",
    slug: "funda-magsafe-iphone",
    name: "Funda con MagSafe para iPhone",
    category: "Fundas",
    categoryId: "fundas",
    price: 0,
    accent: "bg-[radial-gradient(ellipse_at_50%_0%,#1a2430_0%,#0a0c10_70%)]",
    image: "/products/funda-magsafe-iphone.webp",
    imageFrame: { width: 210, height: 230 },
    rating: 0,
  },
  {
    id: "3",
    slug: "vidrio-templado-iphone",
    name: "Vidrio templado para iPhone",
    category: "Vidrios templados",
    categoryId: "vidrios",
    price: 0,
    accent: "bg-[radial-gradient(ellipse_at_50%_0%,#152228_0%,#0a0c10_70%)]",
    image: "/products/vidrio-templado-iphone.webp",
    imageFrame: { width: 248, height: 172 },
    rating: 0,
  },
  {
    id: "4",
    slug: "vidrio-templado-pack",
    name: "Vidrio templado — pack x2",
    category: "Vidrios templados",
    categoryId: "vidrios",
    price: 0,
    accent: "bg-[radial-gradient(ellipse_at_50%_0%,#1a2828_0%,#0a0c10_70%)]",
    image: "/products/vidrio-templado-pack.webp",
    imageFrame: { width: 242, height: 192 },
    rating: 0,
  },
  {
    id: "5",
    slug: "cargador-apple-20w",
    name: "Cargador original Apple 20W USB-C",
    category: "Cargadores",
    categoryId: "carga",
    price: 0,
    accent: "bg-[radial-gradient(ellipse_at_50%_0%,#2a1f18_0%,#0a0c10_70%)]",
    image: "/products/cargador-apple-20w.webp",
    imageFrame: { width: 230, height: 230 },
    rating: 0,
  },
  {
    id: "6",
    slug: "cargador-apple-iphone",
    name: "Cargador original Apple para iPhone",
    category: "Cargadores",
    categoryId: "carga",
    price: 0,
    accent: "bg-[radial-gradient(ellipse_at_50%_0%,#1c1c22_0%,#0a0c10_70%)]",
    image: "/products/cargador-apple-iphone.webp",
    imageFrame: { width: 246, height: 212 },
    rating: 0,
  },
  {
    id: "7",
    slug: "airpods",
    name: "AirPods",
    category: "AirPods",
    categoryId: "airpods",
    price: 0,
    accent: "bg-[radial-gradient(ellipse_at_50%_0%,#15252a_0%,#0a0c10_70%)]",
    image: "/products/airpods.webp",
    imageFrame: { width: 216, height: 216 },
    rating: 0,
  },
  {
    id: "8",
    slug: "airpods-pro",
    name: "AirPods Pro",
    category: "AirPods",
    categoryId: "airpods",
    price: 0,
    accent: "bg-[radial-gradient(ellipse_at_50%_0%,#1a2030_0%,#0a0c10_70%)]",
    image: "/products/airpods-pro.webp",
    imageFrame: { width: 220, height: 220 },
    rating: 0,
  },
];

export const benefits: Benefit[] = [
  {
    id: "1",
    title: "Productos originales",
    description:
      "Cargadores Apple certificados para iPhone. Consultá compatibilidad según tu modelo.",
  },
  {
    id: "2",
    title: "Asesoramiento",
    description:
      "Te ayudamos a elegir funda, vidrio o cargador según tu iPhone. Escribinos por WhatsApp.",
  },
  {
    id: "3",
    title: "Consultá disponibilidad",
    description:
      "Stock y modelos varían. Confirmá antes de comprar por WhatsApp o en el local.",
  },
  {
    id: "4",
    title: "Retiro y envíos",
    description:
      "Coordiná retiro en tienda o envío según tu zona. Consultá opciones al contactarnos.",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "—",
    role: "Próximamente",
    content:
      "Acá vas a poder leer opiniones de clientes. Por ahora, consultanos por WhatsApp.",
    rating: 0,
  },
  {
    id: "2",
    name: "—",
    role: "Próximamente",
    content:
      "Espacio reservado para reseñas verificadas de quienes compraron en el local.",
    rating: 0,
  },
  {
    id: "3",
    name: "—",
    role: "Próximamente",
    content:
      "Si ya compraste con nosotros y querés dejar tu experiencia, escribinos.",
    rating: 0,
  },
];

export function formatPrice(amount: number): string {
  if (!amount || amount <= 0) {
    return "Consultar precio";
  }
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}
