"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Product } from "@/lib/data";
import { ShopProductCard } from "@/components/catalog/ShopProductCard";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/Icons";
import { getButtonClassName } from "@/components/ui/Button";

const SCROLL_SYNC_MS = 64;

function useItemsPerView() {
  const [itemsPerView, setItemsPerView] = useState(2);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setItemsPerView(4);
      } else if (window.matchMedia("(min-width: 768px)").matches) {
        setItemsPerView(3);
      } else {
        setItemsPerView(2);
      }
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return itemsPerView;
}

type ShopBestsellersCarouselProps = {
  products: Product[];
};

export function ShopBestsellersCarousel({ products }: ShopBestsellersCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const programmaticScrollRef = useRef(false);
  const scrollSyncTimerRef = useRef<number | null>(null);
  const [activePage, setActivePage] = useState(0);
  const itemsPerView = useItemsPerView();

  const slides = useMemo(() => {
    const chunks: Product[][] = [];
    for (let i = 0; i < products.length; i += itemsPerView) {
      chunks.push(products.slice(i, i + itemsPerView));
    }
    return chunks;
  }, [products, itemsPerView]);

  const pageCount = slides.length;

  const gridClass =
    itemsPerView >= 4
      ? "grid-cols-2 lg:grid-cols-4"
      : itemsPerView === 3
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-2";

  const scrollToPage = useCallback(
    (page: number, behavior: ScrollBehavior = "smooth") => {
      const el = scrollRef.current;
      if (!el || pageCount === 0) return;

      const clamped = Math.max(0, Math.min(page, pageCount - 1));
      programmaticScrollRef.current = true;
      el.scrollTo({ left: clamped * el.clientWidth, behavior });
      setActivePage(clamped);

      window.setTimeout(
        () => {
          programmaticScrollRef.current = false;
        },
        behavior === "smooth" ? 420 : 48,
      );
    },
    [pageCount],
  );

  const syncPageFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;

    const page = Math.round(el.scrollLeft / el.clientWidth);
    const clamped = Math.max(0, Math.min(page, pageCount - 1));
    setActivePage(clamped);
  }, [pageCount]);

  const handleScroll = useCallback(() => {
    if (scrollSyncTimerRef.current !== null) {
      window.clearTimeout(scrollSyncTimerRef.current);
    }

    scrollSyncTimerRef.current = window.setTimeout(() => {
      if (!programmaticScrollRef.current) {
        syncPageFromScroll();
      }
    }, SCROLL_SYNC_MS);
  }, [syncPageFromScroll]);

  useEffect(() => {
    setActivePage(0);
    scrollRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [itemsPerView, products]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onResize = () => scrollToPage(activePage, "auto");
    const observer = new ResizeObserver(onResize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [activePage, scrollToPage]);

  useEffect(() => {
    return () => {
      if (scrollSyncTimerRef.current !== null) {
        window.clearTimeout(scrollSyncTimerRef.current);
      }
    };
  }, []);

  if (products.length === 0) return null;

  const canGoPrev = activePage > 0;
  const canGoNext = activePage < pageCount - 1;

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] glass-card shadow-[0_0_0_1px_rgba(157,78,221,0.06),0_16px_40px_-14px_rgba(0,0,0,0.42)]">
        <div
          ref={scrollRef}
          className="scroll-snap-x hide-scrollbar flex touch-pan-x overflow-x-auto overscroll-x-contain scroll-smooth"
          onScroll={handleScroll}
          aria-roledescription="carrusel"
          aria-label="Productos más vendidos"
        >
          {slides.map((slideProducts, slideIndex) => (
            <div
              key={`slide-${slideIndex}`}
              className="scroll-snap-start w-full shrink-0 snap-always px-3 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6"
              aria-hidden={slideIndex !== activePage}
            >
              <div className={`grid gap-4 sm:gap-5 ${gridClass}`}>
                {slideProducts.map((product) => (
                  <ShopProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {pageCount > 1 && (
          <>
            <button
              type="button"
              aria-label="Productos anteriores"
              disabled={!canGoPrev}
              onClick={() => scrollToPage(activePage - 1)}
              className={`${getButtonClassName({
                variant: "icon",
                size: "icon",
                className:
                  "absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 border-white/[0.12] bg-[var(--void)]/80 sm:inline-flex md:left-3",
              })} ${!canGoPrev ? "pointer-events-none opacity-30" : "opacity-80 hover:opacity-100"}`}
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Productos siguientes"
              disabled={!canGoNext}
              onClick={() => scrollToPage(activePage + 1)}
              className={`${getButtonClassName({
                variant: "icon",
                size: "icon",
                className:
                  "absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 border-white/[0.12] bg-[var(--void)]/80 sm:inline-flex md:right-3",
              })} ${!canGoNext ? "pointer-events-none opacity-30" : "opacity-80 hover:opacity-100"}`}
            >
              <IconChevronRight />
            </button>
          </>
        )}
      </div>

      {pageCount > 1 && (
        <div
          className="mt-5 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Páginas del carrusel"
        >
          {slides.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              role="tab"
              aria-selected={index === activePage}
              aria-label={`Ir a página ${index + 1}`}
              onClick={() => scrollToPage(index)}
              className={`rounded-full transition-all duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                index === activePage
                  ? "h-1.5 w-6 bg-[var(--brand-cyan)]/75"
                  : "h-1.5 w-1.5 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
