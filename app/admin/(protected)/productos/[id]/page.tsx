import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { getStoreProductById } from "@/lib/store/repository";
import { getProductVariants } from "@/lib/store/product-variants";
import {
  getProductModels,
  getProductModelsWithVariants,
} from "@/lib/store/product-models";
import { isFundasProduct } from "@/lib/store/fundas-product";
import { isSiliconeCaseProduct } from "@/lib/store/silicone-case-product";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getStoreProductById(id);

  if (!product) notFound();

  const siliconeCase = isSiliconeCaseProduct(product);
  const fundasProduct = isFundasProduct(product);

  const initialColorVariants =
    siliconeCase
      ? []
      : (await getProductVariants(id).catch(() => [])).map((variant) => ({
          id: variant.id,
          colorName: variant.colorName,
          colorHex: variant.colorHex,
          stock: variant.stock,
          active: variant.active,
          image: variant.image,
        }));

  const initialProductModels = fundasProduct
    ? siliconeCase
      ? (await getProductModelsWithVariants(id).catch(() => [])).map(
          (model) => ({
            id: model.id,
            modelName: model.modelName,
            stock: model.stock,
            active: model.active,
            variants: (model.variants ?? []).map((variant) => ({
              id: variant.id,
              colorName: variant.colorName,
              colorHex: variant.colorHex,
              stock: variant.stock,
              active: variant.active,
              image: variant.image,
            })),
          }),
        )
      : (await getProductModels(id).catch(() => [])).map((model) => ({
          id: model.id,
          modelName: model.modelName,
          stock: model.stock,
          active: model.active,
        }))
    : [];

  return (
    <AdminShell
      title="Editar producto"
      description={`Actualizá ${product.name}. Los cambios impactan el catálogo público al guardar.`}
    >
      <AdminProductForm
        mode="edit"
        product={product}
        initialColorVariants={initialColorVariants}
        initialProductModels={initialProductModels}
      />
    </AdminShell>
  );
}
