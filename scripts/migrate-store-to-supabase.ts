import fs from "node:fs";
import path from "node:path";
// Same service-role singleton as lib/supabase/server.ts (server.ts re-exports this module).
import { getServerClient } from "../lib/supabase/service-role";
import type {
  Order,
  StoreData,
  StoreNotification,
  StoreProduct,
} from "../lib/store/types";

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

function log(step: string, message: string) {
  console.log(`[migrate] ${step}: ${message}`);
}

function readStoreFile(): StoreData {
  const raw = fs.readFileSync(STORE_PATH, "utf-8");
  return JSON.parse(raw) as StoreData;
}

function mapProduct(product: StoreProduct) {
  const images =
    product.images?.filter(Boolean) ??
    (product.image ? [product.image] : []);

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
    badge: product.badge?.trim() ? product.badge.trim() : null,
    accent: product.accent,
    image: product.image,
    images,
    image_frame: product.imageFrame,
    image_frame_fill: product.imageFrameFill ?? null,
    rating: product.rating ?? 0,
    free_shipping: Boolean(product.freeShipping),
    installments: product.installments?.trim()
      ? product.installments.trim()
      : null,
    tags: product.tags ?? [],
    active: product.active !== false,
    created_at: product.updatedAt ?? new Date().toISOString(),
    updated_at: product.updatedAt ?? new Date().toISOString(),
  };
}

function mapOrder(order: Order) {
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

function mapOrderItems(order: Order) {
  return order.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    model: null,
  }));
}

function mapNotification(notification: StoreNotification) {
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

async function migrate() {
  log("start", `Reading ${STORE_PATH}`);
  const store = readStoreFile();

  log(
    "source",
    `${store.products.length} products, ${store.orders.length} orders, ${store.notifications.length} notifications`,
  );

  const supabase = getServerClient();

  log("products", `Inserting ${store.products.length} rows...`);
  const productRows = store.products.map(mapProduct);
  const { error: productsError } = await supabase.from("products").insert(productRows);
  if (productsError) {
    throw new Error(`products insert failed: ${productsError.message}`);
  }
  log("products", `Inserted ${productRows.length} rows`);

  log("orders", `Inserting ${store.orders.length} rows...`);
  const orderRows = store.orders.map(mapOrder);
  const { error: ordersError } = await supabase.from("orders").insert(orderRows);
  if (ordersError) {
    throw new Error(`orders insert failed: ${ordersError.message}`);
  }
  log("orders", `Inserted ${orderRows.length} rows`);

  const orderItemRows = store.orders.flatMap(mapOrderItems);
  log("order_items", `Inserting ${orderItemRows.length} rows...`);
  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItemRows);
  if (orderItemsError) {
    throw new Error(`order_items insert failed: ${orderItemsError.message}`);
  }
  log("order_items", `Inserted ${orderItemRows.length} rows`);

  log("notifications", `Inserting ${store.notifications.length} rows...`);
  const notificationRows = store.notifications.map(mapNotification);
  const { error: notificationsError } = await supabase
    .from("notifications")
    .insert(notificationRows);
  if (notificationsError) {
    throw new Error(`notifications insert failed: ${notificationsError.message}`);
  }
  log("notifications", `Inserted ${notificationRows.length} rows`);

  log("done", "Migration completed successfully.");
}

migrate().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[migrate] error: ${message}`);
  process.exit(1);
});
