import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/data";
import {
  filterHomeProducts,
  type HomeCategoryFilter,
} from "@/lib/home";

type ProductSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  products: Product[];
  activeCategory: HomeCategoryFilter;
  className?: string;
};

function ProductSection({
  id,
  eyebrow,
  title,
  description,
  products,
  activeCategory,
  className = "",
}: ProductSectionProps) {
  const filtered = filterHomeProducts(products, activeCategory);

  if (filtered.length === 0) return null;

  return (
    <section id={id} className={`home-section ${className}`.trim()}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="left"
          compact
          className="max-md:mb-5 max-md:[&_p:last-child]:hidden"
        />

        <div
          key={`${id}-${activeCategory}`}
          className="home-filter-grid mt-2 grid grid-cols-2 gap-3 md:mt-0 lg:grid-cols-4 lg:gap-5"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} layout="home" />
          ))}
        </div>
      </div>
    </section>
  );
}

type HomeProductSectionsProps = {
  activeCategory: HomeCategoryFilter;
  featured: Product[];
  newest: Product[];
  bestsellers: Product[];
};

export function HomeProductSections({
  activeCategory,
  featured,
  newest,
  bestsellers,
}: HomeProductSectionsProps) {
  return (
    <>
      <ProductSection
        id="productos-destacados"
        eyebrow="Destacados"
        title="Lo más elegido"
        description="Consultá precios y modelos por WhatsApp o en el local."
        products={featured}
        activeCategory={activeCategory}
        className="home-section-tight max-md:pt-4 max-md:pb-6 md:pt-14"
      />

      <ProductSection
        id="productos-novedades"
        eyebrow="Novedades"
        title="Recién llegados"
        products={newest}
        activeCategory={activeCategory}
      />

      <ProductSection
        id="productos-mas-vendidos"
        eyebrow="Más vendidos"
        title="Favoritos del local"
        products={bestsellers}
        activeCategory={activeCategory}
      />

      <section className="home-section pt-8 pb-12 md:pt-0 md:pb-24">
        <div className="mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
          <Button href="/tienda" variant="outline" size="md">
            Ver catálogo completo
          </Button>
        </div>
      </section>
    </>
  );
}
