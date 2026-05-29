import { CategoryCard } from "@/components/ui/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { navigableCategories } from "@/lib/catalog";

export function Categories() {
  return (
    <section id="categorias" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Categorías"
          title="Explorá por tipo de accesorio"
          description="Cuatro líneas de producto para iPhone. Consultá modelos y stock en tienda."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {navigableCategories.map((category, index) => (
            <div
              key={category.id}
              className={`animate-slide-up ${index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
