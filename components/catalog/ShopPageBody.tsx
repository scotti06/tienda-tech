"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SearchBar } from "@/components/ui/SearchBar";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ShopTiendaProductCard } from "@/components/catalog/ShopTiendaProductCard";
import { ShopCircularGallery } from "@/components/catalog/ShopCircularGallery";
import { ShopCatalogFilters } from "@/components/catalog/ShopCatalogFilters";
import type { Product } from "@/lib/data";
import {
  filterInStockProducts,
  filterShopProducts,
  getShopBestsellersWithFallback,
  getShopFilterCounts,
  shopGroups,
  shopSortOptions,
  sortShopProducts,
  type ShopFilterGroup,
  type ShopFilterSubcategory,
  type ShopSortOption,
} from "@/lib/shop";
import { ShopBenefits } from "@/components/catalog/ShopBenefits";
import { ShopSortSelect } from "@/components/catalog/ShopSortSelect";

const SEARCH_DEBOUNCE_MS = 250;

const VALID_GROUPS = new Set<ShopFilterGroup>([
  "all",
  ...shopGroups.map((group) => group.id),
]);

const VALID_SORTS = new Set<ShopSortOption>(
  shopSortOptions.map((option) => option.value),
);

function getResultsLabel(count: number): string {
  if (count === 0) return "Sin resultados";
  if (count === 1) return "1 producto";
  return `${count} productos`;
}

function getCatalogPageSize(width: number): number {
  if (width >= 1024) return 12;
  if (width >= 768) return 8;
  return 6;
}

function getVisibleCountLabel(visible: number, total: number): string | null {
  if (total === 0 || visible >= total) return null;
  return `Mostrando ${visible} de ${total}`;
}

function parseGroup(value: string | null): ShopFilterGroup {
  if (value && VALID_GROUPS.has(value as ShopFilterGroup)) {
    return value as ShopFilterGroup;
  }
  return "all";
}

function parseSort(value: string | null): ShopSortOption {
  if (value && VALID_SORTS.has(value as ShopSortOption)) {
    return value as ShopSortOption;
  }
  return "featured";
}

type ShopPageBodyProps = {
  products: Product[];
};

export function ShopPageBody({ products }: ShopPageBodyProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastWrittenQueryRef = useRef<string | null>(null);

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [activeGroup, setActiveGroup] = useState<ShopFilterGroup>(() =>
    parseGroup(searchParams.get("grupo")),
  );
  const [activeSubcategory, setActiveSubcategory] = useState<ShopFilterSubcategory>(
    () => searchParams.get("sub") ?? "all",
  );
  const [sortBy, setSortBy] = useState<ShopSortOption>(() =>
    parseSort(searchParams.get("sort")),
  );
  const [pageSize, setPageSize] = useState(6);
  const [visibleCount, setVisibleCount] = useState(6);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");
  const pageSizeRef = useRef(pageSize);
  const filterKeyRef = useRef<string | null>(null);
  const firstNewProductRef = useRef<HTMLDivElement | null>(null);
  const firstNewIndexRef = useRef<number | null>(null);
  const pendingFocusRef = useRef(false);

  useEffect(() => {
    pageSizeRef.current = pageSize;
  }, [pageSize]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const updatePageSize = () => {
      setPageSize(getCatalogPageSize(window.innerWidth));
    };

    updatePageSize();
    window.addEventListener("resize", updatePageSize, { passive: true });
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  useEffect(() => {
    setVisibleCount(pageSizeRef.current);
  }, [debouncedQuery, activeGroup, activeSubcategory, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    if (activeGroup !== "all") params.set("grupo", activeGroup);
    if (activeSubcategory !== "all") params.set("sub", activeSubcategory);
    if (sortBy !== "featured") params.set("sort", sortBy);

    const nextQuery = params.toString();

    if (lastWrittenQueryRef.current === nextQuery) {
      return;
    }

    lastWrittenQueryRef.current = nextQuery;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [debouncedQuery, activeGroup, activeSubcategory, sortBy, pathname, router]);

  const handleGroupChange = useCallback((groupId: ShopFilterGroup) => {
    setActiveGroup(groupId);
    setActiveSubcategory("all");
  }, []);

  const clearFilters = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setActiveGroup("all");
    setActiveSubcategory("all");
    setSortBy("featured");
  }, []);

  const inStockProducts = useMemo(
    () => filterInStockProducts(products),
    [products],
  );

  const sortedCatalogProducts = useMemo(() => {
    const filtered = filterShopProducts(inStockProducts, {
      query: debouncedQuery,
      groupId: activeGroup,
      subcategoryId: activeSubcategory,
    });
    return sortShopProducts(filtered, sortBy);
  }, [inStockProducts, debouncedQuery, activeGroup, activeSubcategory, sortBy]);

  const filterCounts = useMemo(
    () => getShopFilterCounts(inStockProducts, debouncedQuery, activeGroup),
    [inStockProducts, debouncedQuery, activeGroup],
  );

  const filteredBestsellers = useMemo(() => {
    const bestsellers = getShopBestsellersWithFallback(inStockProducts);
    return filterShopProducts(bestsellers, {
      query: "",
      groupId: activeGroup,
      subcategoryId: activeSubcategory,
    });
  }, [inStockProducts, activeGroup, activeSubcategory]);

  const resultsLabel = getResultsLabel(sortedCatalogProducts.length);
  const visibleProducts = sortedCatalogProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < sortedCatalogProducts.length;
  const visibleCountLabel = getVisibleCountLabel(
    visibleProducts.length,
    sortedCatalogProducts.length,
  );
  const hasActiveFilters =
    debouncedQuery.trim().length > 0 ||
    activeGroup !== "all" ||
    activeSubcategory !== "all" ||
    sortBy !== "featured";

  useEffect(() => {
    const filterKey = `${debouncedQuery}|${activeGroup}|${activeSubcategory}|${sortBy}`;

    if (filterKeyRef.current !== null && filterKeyRef.current !== filterKey) {
      if (sortedCatalogProducts.length === 0) {
        setLiveAnnouncement("No se encontraron productos con esos filtros.");
      } else {
        setLiveAnnouncement(`${resultsLabel} encontrados.`);
      }
    }

    filterKeyRef.current = filterKey;
  }, [
    debouncedQuery,
    activeGroup,
    activeSubcategory,
    sortBy,
    sortedCatalogProducts.length,
    resultsLabel,
  ]);

  useEffect(() => {
    if (!pendingFocusRef.current || !firstNewProductRef.current) return;

    firstNewProductRef.current.focus();
    pendingFocusRef.current = false;
    firstNewIndexRef.current = null;
  }, [visibleCount]);

  function handleLoadMore() {
    const previousVisible = visibleCount;
    const nextVisible = Math.min(
      previousVisible + pageSize,
      sortedCatalogProducts.length,
    );
    const addedCount = nextVisible - previousVisible;

    if (addedCount > 0) {
      firstNewIndexRef.current = previousVisible;
      pendingFocusRef.current = true;
      setLiveAnnouncement(
        `Se cargaron ${addedCount} producto${addedCount === 1 ? "" : "s"} más.`,
      );
    }

    setVisibleCount(nextVisible);
  }

  return (
    <main>
      <a
        href="#catalogo-productos"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:border-white/20 focus:bg-[var(--void)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Ir al catálogo
      </a>
      <section className="relative overflow-hidden border-b border-white/[0.06] py-6 md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--brand-purple)]/[0.1] blur-[120px]" />
        </div>
        <ScrollReveal className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="hidden md:block">
            <Breadcrumbs
              items={[
                { label: "Inicio", href: "/" },
                { label: "Tienda" },
              ]}
            />
          </div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[var(--brand-cyan)] uppercase md:mt-0">
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
              ariaLabel="Buscar productos en la tienda"
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
        filterCounts={filterCounts}
      />

      <div className="flex flex-col">
        {filteredBestsellers.length > 0 && (
          <section
            id="mas-vendidos"
            className="order-1 border-t border-white/[0.06] py-6 md:order-2 md:py-20"
          >
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
                <div className="mt-4 md:mt-8">
                  <ShopCircularGallery products={filteredBestsellers} />
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        <section
          id="catalogo-productos"
          className="order-2 scroll-mt-[8.5rem] border-t border-white/[0.06] py-8 md:order-1 md:scroll-mt-[5.5rem] md:py-24"
        >
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
                  {visibleCountLabel && (
                    <p className="mt-1 text-xs text-[var(--muted)] md:text-sm">
                      {visibleCountLabel}
                    </p>
                  )}
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
                <div className="mt-4 rounded-2xl border border-white/[0.08] glass-card px-6 py-10 text-center md:mt-8 md:py-12">
                  <p className="text-[var(--muted)]">
                    No encontramos productos con esos filtros. Probá otra búsqueda o
                    categoría.
                  </p>
                  {hasActiveFilters && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      className="mt-5"
                      onClick={clearFilters}
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </ScrollReveal>
            ) : (
              <>
                <p className="sr-only" aria-live="polite" aria-atomic="true">
                  {liveAnnouncement}
                </p>

                <div
                  role="region"
                  aria-label="Resultados del catálogo"
                  className="mt-4 md:mt-8"
                >
                  <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
                    {visibleProducts.map((product, index) => (
                        <div
                          key={product.id}
                          ref={
                            index === firstNewIndexRef.current
                              ? firstNewProductRef
                              : undefined
                          }
                          tabIndex={-1}
                          className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
                        >
                          <ShopTiendaProductCard product={product} />
                        </div>
                      ))}
                  </div>
                </div>

                {hasMoreProducts && (
                  <div className="mt-8 flex flex-col items-center gap-3 md:mt-10">
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      className="w-full max-w-sm"
                      onClick={handleLoadMore}
                    >
                      Cargar más productos
                    </Button>
                    <p className="text-center text-xs text-[var(--muted)]">
                      {sortedCatalogProducts.length - visibleProducts.length}{" "}
                      {sortedCatalogProducts.length - visibleProducts.length === 1
                        ? "producto restante"
                        : "productos restantes"}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

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
