import { formatPrice, type Product } from "@/lib/data";

export type CartItem = {
  id: string;
  cartKey: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  model?: string;
  colorName?: string;
  colorHex?: string;
  variantId?: string;
};

export type CartProductInput = Pick<
  CartItem,
  "id" | "name" | "image" | "price" | "model" | "colorName" | "colorHex" | "variantId"
>;

export function getCartItemKey(
  product: Pick<CartProductInput, "id" | "model" | "colorHex">,
): string {
  const model = product.model?.trim() || "";
  const colorHex = product.colorHex?.trim().toLowerCase() || "";
  return `${product.id}::${colorHex}::${model}`;
}

export const CART_STORAGE_KEY = "techstylebv-cart";

export function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidCartItem).map(normalizeCartItem);
  } catch {
    return [];
  }
}

export function writeCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export const readStoredCart = readCartFromStorage;
export const writeStoredCart = writeCartToStorage;

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<CartItem>;

  const cartKey =
    typeof item.cartKey === "string" && item.cartKey.length > 0
      ? item.cartKey
      : typeof item.id === "string"
        ? getCartItemKey({
            id: item.id,
            model: item.model,
            colorHex: item.colorHex,
          })
        : "";

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.image === "string" &&
    typeof item.price === "number" &&
    typeof item.quantity === "number" &&
    item.quantity > 0 &&
    cartKey.length > 0 &&
    (item.model === undefined ||
      item.model === null ||
      typeof item.model === "string") &&
    (item.colorName === undefined ||
      item.colorName === null ||
      typeof item.colorName === "string") &&
    (item.colorHex === undefined ||
      item.colorHex === null ||
      typeof item.colorHex === "string") &&
    (item.variantId === undefined ||
      item.variantId === null ||
      typeof item.variantId === "string")
  );
}

function normalizeCartItem(item: CartItem): CartItem {
  const cartKey = item.cartKey || getCartItemKey(item);
  return { ...item, cartKey };
}

export function addCartItem(
  items: CartItem[],
  product: CartProductInput,
  quantity = 1,
): CartItem[] {
  const cartKey = getCartItemKey(product);
  const existing = items.find((item) => item.cartKey === cartKey);

  if (existing) {
    return items.map((item) =>
      item.cartKey === cartKey
        ? {
            ...item,
            quantity: item.quantity + quantity,
            model: product.model?.trim() || item.model,
            colorName: product.colorName?.trim() || item.colorName,
            colorHex: product.colorHex?.trim() || item.colorHex,
            variantId: product.variantId || item.variantId,
          }
        : item,
    );
  }

  return [
    ...items,
    normalizeCartItem({
      ...product,
      cartKey,
      quantity,
      model: product.model?.trim() || undefined,
      colorName: product.colorName?.trim() || undefined,
      colorHex: product.colorHex?.trim() || undefined,
      variantId: product.variantId || undefined,
    }),
  ];
}

export function removeCartItem(items: CartItem[], cartKey: string): CartItem[] {
  return items.filter((item) => item.cartKey !== cartKey);
}

export function setCartItemQuantity(
  items: CartItem[],
  cartKey: string,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) return removeCartItem(items, cartKey);

  return items.map((item) =>
    item.cartKey === cartKey ? { ...item, quantity } : item,
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

export function getCartItemCount(items: CartItem[]): number {
  return getCartTotals(items).totalItems;
}

export function formatCartSubtotal(items: CartItem[]): string {
  const subtotal = getCartSubtotal(items);
  if (!subtotal || subtotal <= 0) {
    return "Consultar precio";
  }
  return formatPrice(subtotal);
}

export function productToCartItem(product: Product): Omit<CartItem, "quantity"> {
  const base = {
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    model: product.category,
  };

  return {
    ...base,
    cartKey: getCartItemKey(base),
  };
}

export function buildCartWhatsAppMessage(items: CartItem[]): string {
  const lines = items.map((item) => {
    const modelPart = item.model ? ` (${item.model})` : "";
    const colorPart = item.colorName ? ` · Color: ${item.colorName}` : "";
    const lineTotal = item.price * item.quantity;
    const pricePart = lineTotal > 0 ? ` — ${formatPrice(lineTotal)}` : "";
    return `• ${item.name}${modelPart}${colorPart} x${item.quantity}${pricePart}`;
  });

  const subtotal = getCartSubtotal(items);
  const subtotalPart =
    subtotal > 0 ? `\n\nSubtotal estimado: ${formatPrice(subtotal)}` : "";

  return `Hola! Quiero consultar por mi pedido:\n\n${lines.join("\n")}${subtotalPart}`;
}

export function buildCartWhatsAppUrl(
  items: CartItem[],
  whatsappNumber: string,
): string {
  const text = encodeURIComponent(buildCartWhatsAppMessage(items));
  return `https://wa.me/${whatsappNumber}?text=${text}`;
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
