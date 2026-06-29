import { formatPrice, siteConfig, type Product } from "@/lib/data";

export type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  model?: string;
};

export type CartProductInput = Pick<CartItem, "id" | "name" | "image" | "price" | "model">;

export const CART_STORAGE_KEY = "techstylebv-cart";

export function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidCartItem);
  } catch {
    return [];
  }
}

export function writeCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<CartItem>;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.image === "string" &&
    typeof item.price === "number" &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
}

export function addCartItem(
  items: CartItem[],
  product: CartProductInput,
  quantity = 1,
): CartItem[] {
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    return items.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item,
    );
  }

  return [...items, { ...product, quantity }];
}

export function removeCartItem(items: CartItem[], id: string): CartItem[] {
  return items.filter((item) => item.id !== id);
}

export function setCartItemQuantity(
  items: CartItem[],
  id: string,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) return removeCartItem(items, id);

  return items.map((item) =>
    item.id === id ? { ...item, quantity } : item,
  );
}

export function getCartTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    totalItems,
    subtotal,
    total: subtotal,
  };
}

export function getCartSubtotal(items: CartItem[]): number {
  return getCartTotals(items).subtotal;
}
export function formatCartSubtotal(items: CartItem[]): string {
  const { subtotal } = getCartTotals(items);
  if (!subtotal || subtotal <= 0) {
    return "Consultar precio";
  }

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(subtotal);
}

export function buildCartWhatsAppMessage(items: CartItem[]): string {
  const lines = items.map((item) => {
    const lineTotal = item.price * item.quantity;
    const priceLabel =
      lineTotal > 0
        ? new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
          }).format(lineTotal)
        : "Consultar precio";

    return `• ${item.name} x${item.quantity} — ${priceLabel}`;
  });

  return [
    "Hola! Quiero continuar con mi pedido:",
    "",
    ...lines,
    "",
    `Subtotal: ${formatCartSubtotal(items)}`,
  ].join("\n");
}

export function buildCartWhatsAppUrl(
  items: CartItem[],
  whatsappNumber: string,
): string {
  const text = encodeURIComponent(buildCartWhatsAppMessage(items));
  return `https://wa.me/${whatsappNumber}?text=${text}`;
}

export function scrollToCatalog(pathname: string): void {
  const targetId = pathname === "/" ? "productos" : "categorias";
  const element = document.getElementById(targetId);

  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  window.location.assign(pathname === "/" ? "/#productos" : "/tienda#categorias");
export function getCartItemCount(items: CartItem[]): number {
  return getCartTotals(items).totalItems;
}

export function formatCartSubtotal(items: CartItem[]): string {
  return formatPrice(getCartSubtotal(items));
}

export const readStoredCart = readCartFromStorage;
export const writeStoredCart = writeCartToStorage;

export function productToCartItem(product: Product): Omit<CartItem, "quantity"> {
  return {
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
  };
}

export function buildCartWhatsAppUrl(items: CartItem[]): string {
  const lines = items.map((item) => {
    const modelPart = item.model ? ` (${item.model})` : "";
    const lineTotal = item.price * item.quantity;
    const pricePart =
      lineTotal > 0 ? ` — ${formatPrice(lineTotal)}` : "";
    return `• ${item.name}${modelPart} x${item.quantity}${pricePart}`;
  });

  const subtotal = getCartSubtotal(items);
  const subtotalPart =
    subtotal > 0 ? `\n\nSubtotal estimado: ${formatPrice(subtotal)}` : "";

  const message = `Hola! Quiero consultar por mi pedido:\n\n${lines.join("\n")}${subtotalPart}`;

  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function scrollToCatalog(pathname: string): void {
  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (pathname === "/tienda") {
    scrollToId("catalogo-productos");
    return;
  }

  if (pathname === "/") {
    scrollToId("productos-destacados");
    return;
  }

  window.location.assign("/tienda#catalogo-productos");
}
