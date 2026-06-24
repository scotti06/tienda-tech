import { formatPrice } from "@/lib/data";
import type { DashboardStats } from "@/lib/store/types";

type DashboardCardsProps = {
  stats: DashboardStats;
};

function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warning" | "success";
}) {
  const toneClass =
    tone === "warning"
      ? "border-amber-500/20 bg-amber-500/10"
      : tone === "success"
        ? "border-emerald-500/20 bg-emerald-500/10"
        : "border-white/[0.08] bg-white/[0.03]";

  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-[var(--muted)]">{hint}</p>}
    </div>
  );
}

export function DashboardCards({ stats }: DashboardCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard label="Total de productos" value={String(stats.totalProducts)} />
      <StatCard
        label="Productos sin stock"
        value={String(stats.outOfStock)}
        tone={stats.outOfStock > 0 ? "warning" : "default"}
      />
      <StatCard
        label="Ventas realizadas"
        value={formatPrice(stats.totalSales)}
        hint="Pedidos enviados o entregados"
        tone="success"
      />
      <StatCard
        label="Pedidos pendientes"
        value={String(stats.pendingOrders)}
        tone={stats.pendingOrders > 0 ? "warning" : "default"}
      />
      <StatCard
        label="Notificaciones sin leer"
        value={String(stats.unreadNotifications)}
      />
      <StatCard
        label="Última compra"
        value={
          stats.lastOrder
            ? formatPrice(stats.lastOrder.total)
            : "Sin compras aún"
        }
        hint={
          stats.lastOrder
            ? `${stats.lastOrder.orderNumber} · ${stats.lastOrder.customerName}`
            : "Cuando un cliente consulte su compra, aparecerá acá."
        }
      />
    </div>
  );
}
