import { CategoryCard } from "@/components/ui/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { navigableCategories } from "@/lib/catalog";

export function Categories() {
  return (
    <section id="categorias" className="home-section home-section-tight pt-4 pb-5 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Categorías"
          title="Explorá por tipo de accesorio"
          description="Cuatro líneas de producto para iPhone. Consultá modelos y stock en tienda."
          align="left"
          compact
          className="max-md:mb-5 max-md:[&_p:last-child]:hidden"
        />

        <div className="mt-2 md:mt-0">
          <CategoryCarousel categories={navigableCategories} />
        </div>

        <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
          {navigableCategories.map((category, index) => (
            <div
              key={category.id}
              className={index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
