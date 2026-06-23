"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/data";
import { ORDER_STATUSES, type Order } from "@/lib/store/types";

type AdminOrdersTableProps = {
  orders: Order[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const router = useRouter();

  async function updateStatus(orderId: string, status: Order["status"]) {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.12] px-6 py-16 text-center text-sm text-[var(--muted)]">
        Todavía no hay pedidos registrados.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                {order.orderNumber}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {order.customerName} · {formatDate(order.createdAt)}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.productId}`}>
                    {item.quantity}x {item.name} — {formatPrice(item.price)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <p className="text-lg font-semibold text-white">
                {formatPrice(order.total)}
              </p>
              <select
                value={order.status}
                onChange={(event) =>
                  updateStatus(order.id, event.target.value as Order["status"])
                }
                className="admin-input min-w-48"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
