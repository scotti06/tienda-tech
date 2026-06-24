import { AdminShell } from "@/components/admin/AdminShell";
import { AdminProductForm } from "@/components/admin/AdminProductForm";

export default function AdminNewProductPage() {
  return (
    <AdminShell
      title="Crear producto"
      description="Completá la información del producto. Los cambios se publican automáticamente en la tienda."
    >
      <AdminProductForm mode="create" />
    </AdminShell>
  );
}
