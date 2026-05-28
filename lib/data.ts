export type Category = {
  id: string;
  name: string;
  description: string;
  href: string;
  gradient: string;
  icon: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  gradient: string;
  rating: number;
};

export type Benefit = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
};

export const siteConfig = {
  name: "PulseTech",
  tagline: "Accesorios premium para tu móvil",
  description:
    "Fundas, audio, carga y cables diseñados con materiales de primera calidad.",
};

export const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Categorías", href: "#categorias" },
  { label: "Productos", href: "#productos" },
  { label: "Beneficios", href: "#beneficios" },
  { label: "Opiniones", href: "#opiniones" },
];

export const categories: Category[] = [
  {
    id: "fundas",
    name: "Fundas",
    description: "iPhone y Samsung con protección MagSafe",
    href: "#productos",
    gradient: "from-violet-600/40 via-fuchsia-500/20 to-transparent",
    icon: "📱",
  },
  {
    id: "audio",
    name: "Audio",
    description: "Auriculares inalámbricos con cancelación activa",
    href: "#productos",
    gradient: "from-blue-600/40 via-cyan-500/20 to-transparent",
    icon: "🎧",
  },
  {
    id: "carga",
    name: "Carga rápida",
    description: "Cargadores GaN de 65W y 100W",
    href: "#productos",
    gradient: "from-amber-500/40 via-orange-500/20 to-transparent",
    icon: "⚡",
  },
  {
    id: "adaptadores",
    name: "Adaptadores",
    description: "USB-C multipuerto para viaje y escritorio",
    href: "#productos",
    gradient: "from-emerald-600/40 via-teal-500/20 to-transparent",
    icon: "🔌",
  },
  {
    id: "cables",
    name: "Cables premium",
    description: "Nylon trenzado y conectores reforzados",
    href: "#productos",
    gradient: "from-rose-600/40 via-pink-500/20 to-transparent",
    icon: "🔗",
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Funda MagSafe Pro — iPhone 16",
    category: "Fundas",
    price: 34990,
    originalPrice: 42990,
    badge: "Nuevo",
    gradient: "from-violet-950 via-purple-900 to-zinc-950",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Funda Armor — Galaxy S25",
    category: "Fundas",
    price: 31990,
    badge: "Best seller",
    gradient: "from-indigo-950 via-blue-900 to-zinc-950",
    rating: 4.8,
  },
  {
    id: "3",
    name: "AirPods Pro Style — ANC",
    category: "Audio",
    price: 89990,
    originalPrice: 109990,
    badge: "-18%",
    gradient: "from-slate-900 via-zinc-800 to-black",
    rating: 4.9,
  },
  {
    id: "4",
    name: "Cargador GaN 65W Dual",
    category: "Carga rápida",
    price: 45990,
    gradient: "from-amber-950 via-orange-900/80 to-zinc-950",
    rating: 4.7,
  },
  {
    id: "5",
    name: "Hub USB-C 7 en 1",
    category: "Adaptadores",
    price: 54990,
    badge: "Popular",
    gradient: "from-emerald-950 via-teal-900 to-zinc-950",
    rating: 4.8,
  },
  {
    id: "6",
    name: "Cable USB-C 2m — 240W",
    category: "Cables premium",
    price: 24990,
    gradient: "from-rose-950 via-red-900/60 to-zinc-950",
    rating: 4.9,
  },
  {
    id: "7",
    name: "Earbuds Sport — IPX7",
    category: "Audio",
    price: 42990,
    gradient: "from-cyan-950 via-sky-900 to-zinc-950",
    rating: 4.6,
  },
  {
    id: "8",
    name: "Cargador MagSafe 15W",
    category: "Carga rápida",
    price: 38990,
    badge: "MagSafe",
    gradient: "from-zinc-800 via-zinc-900 to-black",
    rating: 4.8,
  },
];

export const benefits: Benefit[] = [
  {
    id: "1",
    title: "Envío express",
    description: "Entrega en 24–48 h en CABA y GBA. Resto del país en 3–5 días hábiles.",
    icon: "🚀",
  },
  {
    id: "2",
    title: "Garantía extendida",
    description: "12 meses de cobertura en todos los productos. Cambio sin preguntas.",
    icon: "🛡️",
  },
  {
    id: "3",
    title: "Pagos seguros",
    description: "Mercado Pago, tarjetas y cuotas sin interés en productos seleccionados.",
    icon: "💳",
  },
  {
    id: "4",
    title: "Soporte experto",
    description: "Asesoramiento por WhatsApp para elegir el accesorio ideal para tu dispositivo.",
    icon: "💬",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "María González",
    role: "Cliente verificada",
    content:
      "La funda MagSafe encaja perfecto y el acabado se siente premium. Llegó al día siguiente. Super recomendable.",
    rating: 5,
  },
  {
    id: "2",
    name: "Lucas Fernández",
    role: "Comprador recurrente",
    content:
      "Compré el cargador GaN y el cable 240W. Carga mi MacBook y el iPhone a la vez sin calentarse. Calidad top.",
    rating: 5,
  },
  {
    id: "3",
    name: "Valentina Ruiz",
    role: "Cliente verificada",
    content:
      "Los auriculares tienen un sonido increíble por el precio. El empaque y la presentación son nivel Apple Store.",
    rating: 5,
  },
];

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}
