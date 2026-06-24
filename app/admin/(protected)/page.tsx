import { AdminShell } from "@/components/admin/AdminShell";
import { DashboardCards } from "@/components/admin/DashboardCards";
import { AdminNotificationsList } from "@/components/admin/AdminNotificationsList";
import { getDashboardStats, readStore } from "@/lib/store/repository";

export default function AdminDashboardPage() {
  const stats = getDashboardStats();
  const notifications = readStore()
    .notifications.filter((notification) => !notification.read)
    .slice(0, 5);

  return (
    <AdminShell
      title="Dashboard"
      description="Resumen general de la tienda para gestionar productos, stock y pedidos."
    >
      <DashboardCards stats={stats} />

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Centro de notificaciones
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Compras recientes y alertas del panel.
            </p>
          </div>
        </div>
        <AdminNotificationsList notifications={notifications} />
      </section>
    </AdminShell>
  );
}
