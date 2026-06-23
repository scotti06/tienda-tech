"use client";

import { useCallback, useRef } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/Icons";
import type { Product } from "@/lib/data";

type SimilarProductsCarouselProps = {
  product: Product;
  similarProducts: Product[];
};

export function SimilarProductsCarousel({
  product,
  similarProducts,
}: SimilarProductsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByCard = useCallback((direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector<HTMLElement>("[data-carousel-item]");
    if (!card) return;

    const gap = 12;
    const distance = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  }, []);

  if (similarProducts.length === 0) return null;

  return (
    <section
      className="mt-16 border-t border-white/[0.06] pt-12 md:mt-20 md:pt-16"
      aria-label="Productos similares"
    >
      <SectionHeader
        eyebrow="También te puede interesar"
        title="Productos similares"
        align="left"
        compact
        className="max-md:mb-5"
      />

      <div className="group/carousel relative">
        <Button
          type="button"
          variant="icon"
          aria-label="Productos anteriores"
          onClick={() => scrollByCard("prev")}
          className="absolute top-[calc(50%-2rem)] -left-1 z-10 hidden -translate-y-1/2 md:flex lg:-left-5"
        >
          <IconChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          type="button"
          variant="icon"
          aria-label="Productos siguientes"
          onClick={() => scrollByCard("next")}
          className="absolute top-[calc(50%-2rem)] -right-1 z-10 hidden -translate-y-1/2 md:flex lg:-right-5"
        >
          <IconChevronRight className="h-5 w-5" />
        </Button>

        <div
          ref={scrollRef}
          className="scroll-snap-x hide-scrollbar -mx-4 flex touch-pan-x gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 md:mx-0 md:px-0"
        >
          {similarProducts.map((item) => (
            <div
              key={item.id}
              data-carousel-item
              className="scroll-snap-start w-[calc((100vw-2rem-0.75rem)/2.15)] max-w-[180px] shrink-0 sm:max-w-[200px] md:w-[calc((100%-1.5rem)/3)] md:max-w-none lg:w-[calc((100%-2.25rem)/4)]"
            >
              <ProductCard product={item} layout="home" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
