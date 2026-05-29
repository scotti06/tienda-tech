import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { ProductGridSection } from "@/components/catalog/ProductGridSection";
import { ShopFilters } from "@/components/catalog/ShopFilters";
import { navigableCategories } from "@/lib/catalog";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/Button";

export function ShopPageView() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/[0.06] py-14 md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--brand-purple)]/[0.1] blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Tienda" },
            ]}
          />
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[var(--brand-cyan)] uppercase">
            Tienda
          </p>
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
            Todos los{" "}
            <span className="text-gradient-mint">accesorios</span>
          </h1>
          <p className="mt-5 max-w-xl text-[var(--muted)] md:text-lg">
            Fundas, vidrios templados, cargadores originales y AirPods para
            iPhone. Consultá stock en el local.
          </p>
        </div>
      </section>

      <section id="categorias" className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
            Categorías
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Elegí una línea de producto para ver el catálogo completo.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {navigableCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                Productos
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Filtrá por categoría o explorá todo el catálogo.
              </p>
            </div>
            <ShopFilters activeCategoryId="all" />
          </div>
        </div>
      </section>

      <ProductGridSection
        products={products}
        title="Catálogo completo"
        description="Consultá precios y modelos disponibles por WhatsApp."
        eyebrow="Destacados"
      />

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/[0.08] glass-card p-8 text-center md:p-12">
            <p className="text-sm text-[var(--muted)]">
              ¿No encontrás lo que buscás?
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Escribinos y te asesoramos
            </h3>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/contacto" variant="primary" size="md">
                Contacto
              </Button>
              <Button href="/carrito" variant="secondary" size="md">
                Ver carrito
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
