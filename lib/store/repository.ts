import "server-only";

import type { Product } from "@/lib/data";
import { getServerClient } from "@/lib/supabase/server";
import type {
  DashboardStats,
  Order,
  OrderItem,
  StoreData,
  StoreNotification,
  StoreProduct,
} from "@/lib/store/types";
import { toCatalogProduct } from "@/lib/store/types";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  category: string;
  subcategory: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  cash_price: number | null;
  stock: number;
  sku: string | null;
  brand: string | null;
  badge: string | null;
  accent: string;
  image: string;
  images: string[];
  image_frame: { width: number; height: number };
  image_frame_fill: number | null;
  rating: number;
  free_shipping: boolean;
  installments: string | null;
  tags: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
};

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_street: string | null;
  shipping_city: string | null;
  shipping_province: string | null;
  shipping_postal_code: string | null;
  shipping_notes: string | null;
  shipping_method: Order["shippingMethod"] | null;
  shipping_cost: number | null;
  subtotal: number | null;
  payment_method: Order["paymentMethod"] | null;
  total: number;
  status: Order["status"];
  created_at: string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  image: string;
  price: number;
  quantity: number;
  model: string | null;
  color_name: string | null;
  color_hex: string | null;
};

type NotificationRow = {
  id: string;
  type: StoreNotification["type"];
  title: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  total: number;
  read: boolean;
  created_at: string;
};

function mapProductRow(row: ProductRow): StoreProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categoryId: row.category_id,
    category: row.category,
    subcategory: row.subcategory ?? undefined,
    description: row.description ?? undefined,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    cashPrice: row.cash_price ?? undefined,
    stock: row.stock,
    sku: row.sku ?? undefined,
    brand: row.brand ?? undefined,
    badge: row.badge ?? undefined,
    accent: row.accent,
    image: row.image,
    images: row.images ?? [],
    imageFrame: row.image_frame,
    imageFrameFill: row.image_frame_fill ?? undefined,
    rating: Number(row.rating),
    freeShipping: row.free_shipping,
    installments: row.installments ?? undefined,
    tags: row.tags?.length ? row.tags : undefined,
    active: row.active,
    updatedAt: row.updated_at,
  };
}

function mapProductToRow(product: StoreProduct): ProductRow {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category_id: product.categoryId,
    category: product.category,
    subcategory: product.subcategory ?? null,
    description: product.description ?? null,
    price: product.price,
    original_price: product.originalPrice ?? null,
    cash_price: product.cashPrice ?? null,
    stock: product.stock ?? 0,
    sku: product.sku ?? null,
    brand: product.brand ?? null,
    badge: product.badge ?? null,
    accent: product.accent,
    image: product.image,
    images: product.images ?? (product.image ? [product.image] : []),
    image_frame: product.imageFrame,
    image_frame_fill: product.imageFrameFill ?? null,
    rating: product.rating ?? 0,
    free_shipping: Boolean(product.freeShipping),
    installments: product.installments ?? null,
    tags: product.tags ?? [],
    active: product.active !== false,
    created_at: product.updatedAt ?? new Date().toISOString(),
    updated_at: product.updatedAt ?? new Date().toISOString(),
  };
}

function mapOrderItemRow(row: OrderItemRow): OrderItem {
  return {
    productId: row.product_id ?? "",
    name: row.name,
    image: row.image,
    price: row.price,
    quantity: row.quantity,
    model: row.model?.trim() || undefined,
    colorName: row.color_name?.trim() || undefined,
    colorHex: row.color_hex?.trim() || undefined,
  };
}

function mapOrderRow(row: OrderRow, items: OrderItem[]): Order {
  const hasAddress = Boolean(
    row.shipping_street ||
      row.shipping_city ||
      row.shipping_province ||
      row.shipping_postal_code,
  );

  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email ?? undefined,
    customerPhone: row.customer_phone ?? undefined,
    shippingAddress: hasAddress
      ? {
          street: row.shipping_street ?? "",
          city: row.shipping_city ?? "",
          province: row.shipping_province ?? "",
          postalCode: row.shipping_postal_code ?? "",
          notes: row.shipping_notes ?? undefined,
        }
      : undefined,
    shippingMethod: row.shipping_method ?? undefined,
    shippingCost: row.shipping_cost ?? undefined,
    subtotal: row.subtotal ?? undefined,
    paymentMethod: row.payment_method ?? undefined,
    items,
    total: row.total,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapOrderToRow(order: Order): OrderRow {
  return {
    id: order.id,
    order_number: order.orderNumber,
    customer_name: order.customerName,
    customer_email: order.customerEmail ?? null,
    customer_phone: order.customerPhone ?? null,
    shipping_street: order.shippingAddress?.street ?? null,
    shipping_city: order.shippingAddress?.city ?? null,
    shipping_province: order.shippingAddress?.province ?? null,
    shipping_postal_code: order.shippingAddress?.postalCode ?? null,
    shipping_notes: order.shippingAddress?.notes ?? null,
    shipping_method: order.shippingMethod ?? null,
    shipping_cost: order.shippingCost ?? null,
    subtotal: order.subtotal ?? null,
    payment_method: order.paymentMethod ?? null,
    total: order.total,
    status: order.status,
    created_at: order.createdAt,
  };
}

function mapNotificationRow(row: NotificationRow): StoreNotification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    orderId: row.order_id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    total: row.total,
    createdAt: row.created_at,
    read: row.read,
  };
}

function mapNotificationToRow(notification: StoreNotification): NotificationRow {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    order_id: notification.orderId,
    order_number: notification.orderNumber,
    customer_name: notification.customerName,
    total: notification.total,
    read: notification.read,
    created_at: notification.createdAt,
  };
}

function throwOnError(error: { message: string } | null, context: string): void {
  if (error) {
    throw new Error(`${context}: ${error.message}`);
  }
}

async function deleteRowsNotIn(
  table: "products" | "orders" | "notifications",
  idColumn: "id",
  keepIds: string[],
): Promise<void> {
  const supabase = getServerClient();
  const { data: existing, error: readError } = await supabase
    .from(table)
    .select(idColumn);

  throwOnError(readError, `read ${table} for orphan cleanup`);

  const toDelete = (existing ?? [])
    .map((row) => String(row[idColumn]))
    .filter((id) => !keepIds.includes(id));

  if (toDelete.length === 0) return;

  const { error: deleteError } = await supabase
    .from(table)
    .delete()
    .in(idColumn, toDelete);

  throwOnError(deleteError, `delete orphaned ${table}`);
}

async function syncOrderItems(orders: Order[]): Promise<void> {
  const supabase = getServerClient();

  for (const order of orders) {
    const { error: deleteError } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", order.id);

    throwOnError(deleteError, `delete order_items for ${order.id}`);

    if (order.items.length === 0) continue;

    const rows = order.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId || null,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      model: item.model?.trim() || null,
    }));

    const { error: insertError } = await supabase.from("order_items").insert(rows);
    throwOnError(insertError, `insert order_items for ${order.id}`);
  }

  const keepOrderIds = new Set(orders.map((order) => order.id));
  const { data: existingItems, error: readError } = await supabase
    .from("order_items")
    .select("id, order_id");

  throwOnError(readError, "read order_items for orphan cleanup");

  const orphanItemIds = (existingItems ?? [])
    .filter((item) => !keepOrderIds.has(item.order_id))
    .map((item) => item.id);

  if (orphanItemIds.length === 0) return;

  const { error: deleteOrphansError } = await supabase
    .from("order_items")
    .delete()
    .in("id", orphanItemIds);

  throwOnError(deleteOrphansError, "delete orphaned order_items");
}

export async function readStore(): Promise<StoreData> {
  const supabase = getServerClient();

  const [
    { data: productRows, error: productsError },
    { data: orderRows, error: ordersError },
    { data: orderItemRows, error: orderItemsError },
    { data: notificationRows, error: notificationsError },
  ] = await Promise.all([
    supabase.from("products").select("*").order("updated_at", { ascending: false }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("order_items").select("*"),
    supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  throwOnError(productsError, "read products");
  throwOnError(ordersError, "read orders");
  throwOnError(orderItemsError, "read order_items");
  throwOnError(notificationsError, "read notifications");

  const itemsByOrderId = new Map<string, OrderItem[]>();

  for (const row of (orderItemRows ?? []) as OrderItemRow[]) {
    const items = itemsByOrderId.get(row.order_id) ?? [];
    items.push(mapOrderItemRow(row));
    itemsByOrderId.set(row.order_id, items);
  }

  return {
    version: 1,
    products: ((productRows ?? []) as ProductRow[]).map(mapProductRow),
    orders: ((orderRows ?? []) as OrderRow[]).map((row) =>
      mapOrderRow(row, itemsByOrderId.get(row.id) ?? []),
    ),
    notifications: ((notificationRows ?? []) as NotificationRow[]).map(
      mapNotificationRow,
    ),
  };
}

export async function writeStore(data: StoreData): Promise<void> {
  const supabase = getServerClient();

  if (data.products.length > 0) {
    const { error } = await supabase
      .from("products")
      .upsert(data.products.map(mapProductToRow), { onConflict: "id" });
    throwOnError(error, "upsert products");
  }

  await deleteRowsNotIn(
    "products",
    "id",
    data.products.map((product) => product.id),
  );

  if (data.orders.length > 0) {
    const { error } = await supabase
      .from("orders")
      .upsert(data.orders.map(mapOrderToRow), { onConflict: "id" });
    throwOnError(error, "upsert orders");
  }

  await syncOrderItems(data.orders);
  await deleteRowsNotIn(
    "orders",
    "id",
    data.orders.map((order) => order.id),
  );

  if (data.notifications.length > 0) {
    const { error } = await supabase
      .from("notifications")
      .upsert(data.notifications.map(mapNotificationToRow), { onConflict: "id" });
    throwOnError(error, "upsert notifications");
  }

  await deleteRowsNotIn(
    "notifications",
    "id",
    data.notifications.map((notification) => notification.id),
  );
}

export async function getStoreProducts(): Promise<StoreProduct[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false });

  throwOnError(error, "getStoreProducts");
  return ((data ?? []) as ProductRow[]).map(mapProductRow);
}

export async function getCatalogProducts(): Promise<Product[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("updated_at", { ascending: false });

  throwOnError(error, "getCatalogProducts");
  return ((data ?? []) as ProductRow[]).map(mapProductRow).map(toCatalogProduct);
}

export async function getShopCatalogProducts(): Promise<Product[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("updated_at", { ascending: false });

  throwOnError(error, "getShopCatalogProducts");
  return ((data ?? []) as ProductRow[]).map((row) => ({
    ...toCatalogProduct(mapProductRow(row)),
    stock: row.stock,
  }));
}

export async function getCatalogProductBySlug(
  slug: string,
): Promise<StoreProduct | undefined> {
  const normalized = slug.trim().toLowerCase();
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("slug", normalized)
    .maybeSingle();

  throwOnError(error, "getCatalogProductBySlug");
  return data ? mapProductRow(data as ProductRow) : undefined;
}

export async function getStoreProductById(
  id: string,
): Promise<StoreProduct | undefined> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwOnError(error, "getStoreProductById");
  return data ? mapProductRow(data as ProductRow) : undefined;
}

export async function getStoreProductBySlug(
  slug: string,
): Promise<StoreProduct | undefined> {
  const normalized = slug.trim().toLowerCase();
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", normalized)
    .maybeSingle();

  throwOnError(error, "getStoreProductBySlug");
  return data ? mapProductRow(data as ProductRow) : undefined;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const store = await readStore();
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

export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `TS-${year}-`;
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select("order_number")
    .like("order_number", `${prefix}%`)
    .order("order_number", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`generateOrderNumber: ${error.message}`);
  }

  let nextSequence = 1;
  const latestOrderNumber = data?.[0]?.order_number;

  if (latestOrderNumber) {
    const match = latestOrderNumber.match(/^TS-\d{4}-(\d+)$/);
    if (match) {
      nextSequence = Number.parseInt(match[1], 10) + 1;
    }
  }

  return `${prefix}${String(nextSequence).padStart(4, "0")}`;
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

export function createNotificationForOrder(order: Order): StoreNotification {
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
