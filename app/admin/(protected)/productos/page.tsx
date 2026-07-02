import { AdminShell } from "@/components/admin/AdminShell";
import { AdminProductsSection } from "@/components/admin/AdminProductsSection";
import { Button } from "@/components/ui/Button";
import { getStoreProducts } from "@/lib/store/repository";

export default async function AdminProductsPage() {
  const products = await getStoreProducts();

  return (
    <AdminShell
      title="Productos"
      description="Gestioná el catálogo completo: precios, stock, imágenes y disponibilidad."
      actions={
        <Button href="/admin/productos/nuevo" variant="primary" size="md">
          Crear producto
        </Button>
      }
    >
      <AdminProductsSection products={products} />
    </AdminShell>
  );
}
