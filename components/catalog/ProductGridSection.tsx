import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Product } from "@/lib/data";

type ProductGridSectionProps = {
  products: Product[];
  title?: string;
  description?: string;
  eyebrow?: string;
  emptyMessage?: string;
};

export function ProductGridSection({
  products,
  title = "Productos",
  description,
  eyebrow,
  emptyMessage = "No hay productos en esta categoría por el momento.",
}: ProductGridSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            align="left"
          />
        )}

        {products.length === 0 ? (
          <p className="rounded-2xl border border-white/[0.08] glass-card px-6 py-12 text-center text-[var(--muted)]">
            {emptyMessage}
          </p>
        ) : (
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
