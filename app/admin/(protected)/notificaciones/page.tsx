import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNotificationsList } from "@/components/admin/AdminNotificationsList";
import { readStore } from "@/lib/store/repository";

export default function AdminNotificationsPage() {
  const notifications = readStore().notifications;

  return (
    <AdminShell
      title="Notificaciones"
      description="Todas las alertas de compras y actividad reciente del panel."
    >
      <AdminNotificationsList notifications={notifications} />
    </AdminShell>
  );
}
