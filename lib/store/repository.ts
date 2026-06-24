import fs from "node:fs";
import path from "node:path";
import type { Product } from "@/lib/data";
import { createInitialStore } from "@/lib/store/seed";
import type {
  DashboardStats,
  Order,
  StoreData,
  StoreNotification,
  StoreProduct,
} from "@/lib/store/types";
import { toCatalogProduct } from "@/lib/store/types";

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

function ensureStoreFile(): void {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(createInitialStore(), null, 2));
  }
}

export function readStore(): StoreData {
  ensureStoreFile();
  const raw = fs.readFileSync(STORE_PATH, "utf-8");
  return JSON.parse(raw) as StoreData;
}

export function writeStore(data: StoreData): void {
  ensureStoreFile();
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

export function getStoreProducts(): StoreProduct[] {
  return readStore().products;
}

export function getCatalogProducts(): Product[] {
  return getStoreProducts().map(toCatalogProduct);
}

export function getStoreProductById(id: string): StoreProduct | undefined {
  return getStoreProducts().find((product) => product.id === id);
}

export function getStoreProductBySlug(slug: string): StoreProduct | undefined {
  const normalized = slug.trim().toLowerCase();
  return getStoreProducts().find(
    (product) => product.slug.trim().toLowerCase() === normalized,
  );
}

export function getDashboardStats(): DashboardStats {
  const store = readStore();
  const deliveredOrSent = store.orders.filter(
    (order) => order.status === "entregado" || order.status === "enviado",
  );
  const pendingOrders = store.orders.filter(
    (order) => order.status === "pendiente" || order.status === "preparando",
  ).length;
  const lastOrder =
    [...store.orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0] ?? null;

  return {
    totalProducts: store.products.length,
    outOfStock: store.products.filter((product) => product.stock <= 0).length,
    totalSales: deliveredOrSent.reduce((sum, order) => sum + order.total, 0),
    pendingOrders,
    lastOrder,
    unreadNotifications: store.notifications.filter(
      (notification) => !notification.read,
    ).length,
  };
}

export function generateOrderNumber(store: StoreData): string {
  const count = store.orders.length + 1;
  const year = new Date().getFullYear();
  return `TS-${year}-${String(count).padStart(4, "0")}`;
}

export function generateProductId(store: StoreData): string {
  const numericIds = store.products
    .map((product) => Number.parseInt(product.id, 10))
    .filter((value) => Number.isFinite(value));
  const next = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  return String(next);
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function ensureUniqueSlug(
  store: StoreData,
  baseSlug: string,
  excludeId?: string,
): string {
  let slug = baseSlug || "producto";
  let suffix = 1;

  while (
    store.products.some(
      (product) =>
        product.id !== excludeId &&
        product.slug.trim().toLowerCase() === slug.toLowerCase(),
    )
  ) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return slug;
}

export function createNotificationForOrder(
  order: Order,
): StoreNotification {
  return {
    id: `notif-${order.id}`,
    type: "purchase",
    title: "Nueva compra realizada",
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    total: order.total,
    createdAt: order.createdAt,
    read: false,
  };
}
