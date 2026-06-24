import { AdminShell } from "@/components/admin/AdminShell";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { readStore } from "@/lib/store/repository";

export default function AdminOrdersPage() {
  const orders = readStore().orders;

  return (
    <AdminShell
      title="Pedidos"
      description="Seguí el estado de cada compra y actualizalo con un solo clic."
    >
      <AdminOrdersTable orders={orders} />
    </AdminShell>
  );
}
