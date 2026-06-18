"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/data";

type CategoryCarouselProps = {
  categories: Category[];
};

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  return (
    <div className="md:hidden">
      <div
        className="scroll-snap-x hide-scrollbar -mx-4 flex items-start gap-2.5 overflow-x-auto px-4 pb-1"
        aria-label="Categorías"
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className={`card-tap card-hover scroll-snap-start relative flex h-[104px] w-[calc((100vw-2rem-0.625rem)/1.65)] max-w-[240px] shrink-0 flex-col overflow-hidden rounded-2xl glass-card border border-white/[0.08] p-2 ${category.accent}`}
          >
            <div className="pointer-events-none absolute -right-3 -top-3 h-12 w-12 rounded-full bg-[var(--brand-purple)]/10 blur-lg" />

            <div className="relative flex min-h-0 flex-1 flex-col items-center">
              <div
                className="relative mt-0.5 shrink-0"
                style={{
                  width: `min(72%, ${Math.round(category.imageFrame.width * 0.3)}px)`,
                  aspectRatio: `${category.imageFrame.width} / ${category.imageFrame.height}`,
                  maxHeight: "44px",
                }}
              >
                <Image
                  src={category.image}
                  alt=""
                  fill
                  className="card-hover-image object-contain object-center drop-shadow-[0_8px_14px_rgba(0,0,0,0.2)]"
                  sizes="72px"
                />
              </div>

              <div className="relative mt-1 w-full min-w-0 text-center">
                <p className="text-[11px] font-semibold leading-tight tracking-tight text-white line-clamp-1">
                  {category.name}
                </p>
                <p className="mt-0.5 text-[10px] leading-tight text-[var(--muted)] line-clamp-1">
                  {category.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
