import type { Product } from "@/lib/data";
import { formatPrice, siteConfig } from "@/lib/data";

export const CART_STORAGE_KEY = "techstylebv-cart";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  model: string;
  price: number;
  image: string;
  imageFrame: { width: number; height: number };
  accent: string;
  quantity: number;
};

export function productToCartItem(product: Product): Omit<CartItem, "quantity"> {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    model: product.category,
    price: product.price,
    image: product.image,
    imageFrame: product.imageFrame,
    accent: product.accent,
  };
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function formatCartSubtotal(items: CartItem[]): string {
  const subtotal = getCartSubtotal(items);
  if (!subtotal || subtotal <= 0) {
    return "Consultar precio";
  }
  return formatPrice(subtotal);
}

export function buildCartWhatsAppMessage(items: CartItem[]): string {
  const lines = items.map(
    (item) =>
      `• ${item.name} (${item.model}) x${item.quantity} — ${formatPrice(item.price * item.quantity || item.price)}`,
  );

  return [
    "Hola! Quiero continuar con mi pedido:",
    "",
    ...lines,
    "",
    `Subtotal: ${formatCartSubtotal(items)}`,
  ].join("\n");
}

export function buildCartWhatsAppUrl(items: CartItem[]): string {
  const text = encodeURIComponent(buildCartWhatsAppMessage(items));
  return `https://wa.me/${siteConfig.whatsapp}?text=${text}`;
}

export function scrollToCatalog(pathname: string): void {
  const targetId = pathname === "/" ? "productos" : "categorias";
  const element = document.getElementById(targetId);

  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  window.location.assign(pathname === "/" ? "/#productos" : "/tienda#categorias");
}

export function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeStoredCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
