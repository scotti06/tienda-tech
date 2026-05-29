import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/data";

export function ProductGrid() {
  return (
    <section id="productos" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Destacados"
          title="Lo más elegido por nuestros clientes"
          description="Consultá precios y modelos disponibles por WhatsApp o en el local."
        />

        <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button href="/tienda" variant="outline" size="lg">
            Ver catálogo completo
          </Button>
        </div>
      </div>
    </section>
  );
}
