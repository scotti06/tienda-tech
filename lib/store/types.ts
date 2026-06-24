import type { Product } from "@/lib/data";

export type OrderStatus =
  | "pendiente"
  | "preparando"
  | "enviado"
  | "entregado";

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type PaymentMethod = "mercadopago" | "card" | "transfer";

export type ShippingMethod = "pickup" | "standard" | "express";

export type OrderShippingAddress = {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: OrderShippingAddress;
  shippingMethod?: ShippingMethod;
  shippingCost?: number;
  subtotal?: number;
  paymentMethod?: PaymentMethod;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export type StoreNotification = {
  id: string;
  type: "purchase";
  title: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  total: number;
  createdAt: string;
  read: boolean;
};

/** Producto en el almacén con campos administrativos. */
export type StoreProduct = Product & {
  description?: string;
  subcategory?: string;
  stock: number;
  sku?: string;
  brand?: string;
  images?: string[];
  updatedAt?: string;
  /** Visible en catálogo público cuando es true o no está definido. */
  active?: boolean;
};

export type StoreData = {
  version: number;
  products: StoreProduct[];
  orders: Order[];
  notifications: StoreNotification[];
};

export type DashboardStats = {
  totalProducts: number;
  outOfStock: number;
  totalSales: number;
  pendingOrders: number;
  lastOrder: Order | null;
  unreadNotifications: number;
};

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "preparando", label: "Preparando pedido" },
  { value: "enviado", label: "Enviado" },
  { value: "entregado", label: "Entregado" },
];

export function getStockLevel(stock: number): "high" | "low" | "out" {
  if (stock <= 0) return "out";
  if (stock <= 10) return "low";
  return "high";
}

export function toCatalogProduct(product: StoreProduct): Product {
  const {
    description,
    subcategory,
    stock,
    sku,
    brand,
    images,
    updatedAt,
    active,
    ...catalog
  } = product;
  void description;
  void subcategory;
  void stock;
  void sku;
  void brand;
  void images;
  void updatedAt;
  void active;
  return catalog;
}
