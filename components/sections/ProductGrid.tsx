import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/data";

export function ProductGrid() {
  return (
    <section id="productos" className="relative py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Destacados"
          title="Productos más populares"
          description="Selección curada de nuestros accesorios con mejor valoración y mayor demanda."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="#productos" variant="secondary" size="lg">
            Ver todos los productos
          </Button>
        </div>
      </div>
    </section>
  );
}
