import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { ProductGridSection } from "@/components/catalog/ProductGridSection";
import {
  getProductsByCategoryId,
  type CategoryMeta,
} from "@/lib/catalog";

type CategoryPageViewProps = {
  category: CategoryMeta;
};

export function CategoryPageView({ category }: CategoryPageViewProps) {
  const categoryProducts = getProductsByCategoryId(category.id);

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Tienda", href: "/tienda" },
            { label: category.name },
          ]}
        />
      </div>
      <CategoryHero category={category} />
      <ProductGridSection
        products={categoryProducts}
        eyebrow="Catálogo"
        title={`Todos los productos · ${category.name}`}
        description="Consultá precios y disponibilidad por WhatsApp o en el local."
      />
    </main>
  );
}
