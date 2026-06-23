"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/data";
import type { StoreNotification } from "@/lib/store/types";
import { Button } from "@/components/ui/Button";

type AdminNotificationsListProps = {
  notifications: StoreNotification[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminNotificationsList({
  notifications,
}: AdminNotificationsListProps) {
  const router = useRouter();

  async function markAsRead(id: string) {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  async function markAllRead() {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    router.refresh();
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.12] px-6 py-16 text-center text-sm text-[var(--muted)]">
        No hay notificaciones por ahora.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" variant="secondary" size="compact" onClick={markAllRead}>
          Marcar todas como leídas
        </Button>
      </div>

      {notifications.map((notification) => (
        <article
          key={notification.id}
          className={`rounded-2xl border p-5 ${
            notification.read
              ? "border-white/[0.08] bg-white/[0.02]"
              : "border-[var(--brand-cyan)]/20 bg-[var(--brand-cyan)]/5"
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                {notification.title}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Pedido {notification.orderNumber} · {notification.customerName}
              </p>
              <p className="mt-2 text-sm text-white">
                Total: {formatPrice(notification.total)}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {formatDate(notification.createdAt)}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/admin/pedidos"
                className="rounded-lg border border-white/[0.12] px-3 py-1.5 text-xs font-medium text-white hover:bg-white/[0.05]"
              >
                Ver pedidos
              </Link>
              {!notification.read && (
                <Button
                  type="button"
                  variant="ghost"
                  size="compact"
                  onClick={() => markAsRead(notification.id)}
                >
                  Marcar leída
                </Button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
