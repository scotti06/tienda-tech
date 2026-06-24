import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { getStoreProductById } from "@/lib/store/repository";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getStoreProductById(id);

  if (!product) notFound();

  return (
    <AdminShell
      title="Editar producto"
      description={`Actualizá ${product.name}. Los cambios impactan el catálogo público al guardar.`}
    >
      <AdminProductForm mode="edit" product={product} />
    </AdminShell>
  );
}
