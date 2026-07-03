function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface)]">
      <div className="aspect-[3/4] animate-pulse bg-white/[0.06] md:aspect-[4/5]" />
      <div className="space-y-2 p-3 md:p-5">
        <div className="h-2 w-16 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-4 w-full animate-pulse rounded bg-white/[0.06]" />
        <div className="h-5 w-20 animate-pulse rounded bg-white/[0.06]" />
        <div className="mt-2 h-9 animate-pulse rounded-full bg-white/[0.06]" />
      </div>
    </div>
  );
}

export function ShopTiendaPageSkeleton() {
  return (
    <main aria-busy="true" aria-label="Cargando tienda">
      <section className="border-b border-white/[0.06] py-6 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-3 w-16 animate-pulse rounded bg-white/[0.06]" />
          <div className="mt-3 h-8 w-64 max-w-full animate-pulse rounded bg-white/[0.06] md:h-12" />
          <div className="mt-4 h-10 max-w-xl animate-pulse rounded-full bg-white/[0.06]" />
        </div>
      </section>

      <section className="border-b border-white/[0.06] py-3">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-hidden px-4 sm:px-6 lg:px-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-11 w-24 shrink-0 animate-pulse rounded-full bg-white/[0.06] md:h-8"
            />
          ))}
        </div>
      </section>

      <section className="py-8 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 h-8 w-48 animate-pulse rounded bg-white/[0.06] md:mb-14" />
          <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
