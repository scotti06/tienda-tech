import { CategoryCard } from "@/components/ui/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories } from "@/lib/data";

export function Categories() {
  return (
    <section id="categorias" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Categorías"
          title="Todo lo que tu dispositivo necesita"
          description="Seleccioná por tipo de producto y encontrá el accesorio perfecto para tu iPhone o Samsung."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`animate-slide-up ${index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
