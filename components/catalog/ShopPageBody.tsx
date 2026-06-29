"use client";

import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SearchBar } from "@/components/ui/SearchBar";
import { ScrollReveal, SCROLL_REVEAL_STAGGER_MS } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ShopProductCard } from "@/components/catalog/ShopProductCard";
import { ShopCircularGallery } from "@/components/catalog/ShopCircularGallery";
import {
  ShopCatalogFilters,
} from "@/components/catalog/ShopCatalogFilters";
import { products } from "@/lib/data";
import {
  filterShopProducts,
  shopBestsellers,
  sortShopProducts,
  type ShopFilterGroup,
  type ShopFilterSubcategory,
  type ShopSortOption,
} from "@/lib/shop";
import { ShopBenefits } from "@/components/catalog/ShopBenefits";
import { ShopSortSelect } from "@/components/catalog/ShopSortSelect";

function getResultsLabel(count: number): string {
  if (count === 0) return "Sin resultados";
  if (count === 1) return "1 producto";
  return `${count} productos`;
}

export function ShopPageBody() {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<ShopFilterGroup>("all");
  const [activeSubcategory, setActiveSubcategory] =
    useState<ShopFilterSubcategory>("all");
  const [sortBy, setSortBy] = useState<ShopSortOption>("featured");

  const handleGroupChange = (groupId: ShopFilterGroup) => {
    setActiveGroup(groupId);
    setActiveSubcategory("all");
  };

  const sortedCatalogProducts = useMemo(() => {
    const filtered = filterShopProducts(products, {
      query,
      groupId: activeGroup,
      subcategoryId: activeSubcategory,
    });
    return sortShopProducts(filtered, sortBy);
  }, [query, activeGroup, activeSubcategory, sortBy]);

  const filteredBestsellers = useMemo(
    () =>
      filterShopProducts(shopBestsellers, {
        query: "",
        groupId: activeGroup,
        subcategoryId: activeSubcategory,
      }),
    [activeGroup, activeSubcategory],
  );

  const resultsLabel = getResultsLabel(sortedCatalogProducts.length);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/[0.06] py-8 md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--brand-purple)]/[0.1] blur-[120px]" />
        </div>
        <ScrollReveal className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Tienda" },
            ]}
          />
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[var(--brand-cyan)] uppercase">
            Tienda
          </p>
          <h1 className="mt-2 max-w-2xl text-2xl font-semibold tracking-[-0.03em] text-white md:mt-4 md:text-5xl">
            Explorá todos nuestros{" "}
            <span className="text-gradient-mint">productos</span>
          </h1>
          <p className="mt-3 hidden max-w-xl text-[var(--muted)] sm:block md:mt-5 md:text-lg">
            Accesorios, tecnología y productos para el hogar seleccionados para
            vos.
          </p>
          <div className="mt-4 max-w-xl md:mt-8">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="iPhone 15, AirPods, Parlante, TV Box…"
              className="w-full"
            />
          </div>
        </ScrollReveal>
      </section>

      <ShopCatalogFilters
        layout="sticky-mobile"
        activeGroup={activeGroup}
        activeSubcategory={activeSubcategory}
        onGroupChange={handleGroupChange}
        onSubcategoryChange={setActiveSubcategory}
      />

      <section id="catalogo-productos" className="border-t border-white/[0.06] py-10 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-5 flex flex-col gap-3 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-6">
              <div className="max-w-2xl text-left">
                <p className="mb-1 hidden text-[11px] font-semibold tracking-[0.2em] text-[var(--brand-cyan)] uppercase sm:block md:mb-4">
                  Catálogo
                </p>
                <h2 className="text-lg font-semibold tracking-[-0.03em] text-white sm:text-2xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                  Catálogo completo
                </h2>
                <p
                  aria-live="polite"
                  aria-atomic="true"
                  className="mt-1.5 text-sm font-medium text-[var(--brand-cyan)] md:mt-2"
                >
                  {resultsLabel}
                </p>
                <p className="mt-2 hidden text-sm leading-relaxed text-[var(--muted)] md:mt-5 md:block md:text-lg">
                  Consultá precios y modelos disponibles por WhatsApp.
                </p>
              </div>
              <ShopSortSelect
                value={sortBy}
                onChange={setSortBy}
                className="w-full md:shrink-0"
              />
            </div>
          </ScrollReveal>

          {sortedCatalogProducts.length === 0 ? (
            <ScrollReveal>
              <p className="mt-4 rounded-2xl border border-white/[0.08] glass-card px-6 py-10 text-center text-[var(--muted)] md:mt-8 md:py-12">
                No encontramos productos con esos filtros. Probá otra búsqueda o
                categoría.
              </p>
            </ScrollReveal>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 md:mt-8 md:gap-5 lg:grid-cols-4">
              {sortedCatalogProducts.map((product, index) => (
                <ScrollReveal key={product.id} delay={index * SCROLL_REVEAL_STAGGER_MS}>
                  <ShopProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {filteredBestsellers.length > 0 && (
        <section id="mas-vendidos" className="border-t border-white/[0.06] py-10 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <SectionHeader
                eyebrow="Más vendidos"
                title="Favoritos del local"
                description="Consultá precios y modelos por WhatsApp o en el local."
                align="left"
                compact
              />
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="mt-5 md:mt-8">
                <ShopCircularGallery products={filteredBestsellers} />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <ShopBenefits className="max-md:py-10" />

      <section className="pb-12 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="rounded-2xl border border-white/[0.08] glass-card p-6 text-center md:p-12">
              <p className="text-sm text-[var(--muted)]">
                ¿No encontrás lo que buscás?
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Escribinos y te asesoramos
              </h3>
              <div className="mt-5 flex flex-wrap justify-center gap-3 md:mt-6">
                <Button href="/contacto" variant="primary" size="md">
                  Contacto
                </Button>
                <Button href="/carrito" variant="secondary" size="md">
                  Ver carrito
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
