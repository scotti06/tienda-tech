import { ProductCard } from "@/components/ui/ProductCard";
import { ScrollReveal, SCROLL_REVEAL_STAGGER_MS } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/data";

export function ProductGrid() {
  return (
    <section id="productos" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Destacados"
            title="Lo más elegido por nuestros clientes"
            description="Consultá precios y modelos disponibles por WhatsApp o en el local."
          />
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {products.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * SCROLL_REVEAL_STAGGER_MS}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal
          className="mt-16 flex justify-center"
          delay={products.length * SCROLL_REVEAL_STAGGER_MS}
        >
          <Button href="/tienda" variant="outline" size="lg">
            Ver catálogo completo
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
