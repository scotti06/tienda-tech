import { ProductCard } from "@/components/ui/ProductCard";
import { ScrollReveal, SCROLL_REVEAL_STAGGER_MS } from "@/components/ui/ScrollReveal";
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
          <ScrollReveal>
            <SectionHeader
              eyebrow={eyebrow}
              title={title}
              description={description}
              align="left"
            />
          </ScrollReveal>
        )}

        {products.length === 0 ? (
          <ScrollReveal>
            <p className="rounded-2xl border border-white/[0.08] glass-card px-6 py-12 text-center text-[var(--muted)]">
              {emptyMessage}
            </p>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {products.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * SCROLL_REVEAL_STAGGER_MS}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
