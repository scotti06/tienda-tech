"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { heroSlides } from "@/lib/data";
import { navigableCategories } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "@/components/ui/Icons";
import { HeroBackgroundBrand } from "@/components/sections/HeroBackgroundBrand";
import { HeroMobileCarousel } from "@/components/home/HeroMobileCarousel";

const SWIPE_THRESHOLD = 48;

function getSlideClass(index: number, active: number, count: number) {
  let diff = index - active;
  if (diff > count / 2) diff -= count;
  if (diff < -count / 2) diff += count;

  if (diff === 0) {
    return "z-10 translate-x-0 opacity-100 pointer-events-auto";
  }
  if (diff < 0) {
    return "z-0 -translate-x-8 opacity-0 pointer-events-none";
  }
  return "z-0 translate-x-8 opacity-0 pointer-events-none";
}

export function Hero() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = navigableCategories.length;

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => {
    goTo(active + 1);
  }, [active, goTo]);

  const prev = useCallback(() => {
    goTo(active - 1);
  }, [active, goTo]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const slide = heroSlides[active];

  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-[4rem] pb-5 sm:pt-[5.25rem] md:min-h-[88dvh] md:pt-32 md:pb-16"
    >
      <HeroBackgroundBrand />

      <div className="pointer-events-none absolute inset-0 z-[1] grid-fade bg-[var(--void)]/[0.07] md:bg-[var(--void)]/[0.03]">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${slide.accent} transition-all duration-1000`}
        />
        <div className="absolute top-1/3 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-purple)]/[0.08] blur-[140px]" />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[var(--brand-cyan)]/[0.06] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8 lg:pb-24">
        <div
          key={slide.id}
          className="flex w-full max-w-4xl flex-col items-center animate-slide-up"
        >
          <p className="text-[11px] font-semibold tracking-[0.25em] text-[var(--muted)] uppercase max-md:leading-none">
            {slide.eyebrow}
          </p>

          <h1 className="mt-1.5 text-[2rem] font-semibold leading-[1.06] tracking-[-0.04em] text-white sm:mt-6 sm:leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl">
            {slide.title}{" "}
            <span className="text-gradient-mint">{slide.highlight}</span>
          </h1>

          <p className="mt-1.5 max-w-xl line-clamp-1 text-xs leading-snug text-[var(--muted)] sm:mt-6 sm:line-clamp-none sm:text-base sm:leading-relaxed md:text-lg">
            {slide.description}
          </p>

          <div className="mt-3 sm:mt-10">
            <Button href={slide.ctaHref} variant="primary" size="lg" className="min-w-[200px]">
              {slide.cta}
            </Button>
          </div>
        </div>

        {/* Mobile: scroll-snap + swipe (< md) */}
        <div className="relative mt-4 w-full md:hidden">
          <HeroMobileCarousel
            categories={navigableCategories}
            active={active}
            onActiveChange={goTo}
          />
        </div>

        {/* Desktop: diseño actual sin cambios (≥ md) */}
        <div
          className="group/card relative mt-8 hidden w-full max-w-3xl sm:mt-12 md:block lg:mt-16"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <article className="relative overflow-hidden rounded-3xl glass-card border border-white/[0.08] transition-[transform,box-shadow,border-color] duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-[rgba(157,78,221,0.22)] hover:shadow-[0_0_0_1px_rgba(157,78,221,0.12),0_28px_56px_-16px_rgba(0,0,0,0.5)]">
            <Button
              type="button"
              variant="icon"
              onClick={prev}
              aria-label="Categoría anterior"
              className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 md:flex md:opacity-0 md:group-hover/card:opacity-100"
            >
              <IconChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              type="button"
              variant="icon"
              onClick={next}
              aria-label="Categoría siguiente"
              className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 md:flex md:opacity-0 md:group-hover/card:opacity-100"
            >
              <IconChevronRight className="h-5 w-5" />
            </Button>

            <div className="relative min-h-[440px] sm:min-h-[480px] md:min-h-[520px]">
              {navigableCategories.map((category, index) => (
                <div
                  key={category.id}
                  className={`category-carousel-slide absolute inset-0 flex flex-col ${getSlideClass(index, active, count)}`}
                  aria-hidden={index !== active}
                >
                  <div className="relative min-h-0 w-full flex-[0.68]">
                    <div className="absolute inset-0 flex items-center justify-center px-10 pt-10 pb-3 sm:px-12">
                      <div
                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                        aria-hidden
                      >
                        <div className="absolute h-[52%] w-[52%] rounded-full bg-[var(--brand-purple)]/[0.11] blur-[80px] transition-all duration-350 ease-out group-hover/card:bg-[var(--brand-purple)]/[0.16] group-hover/card:scale-105" />
                        <div className="absolute h-[38%] w-[38%] rounded-full bg-[var(--brand-cyan)]/[0.07] blur-[64px] transition-all duration-350 ease-out group-hover/card:bg-[var(--brand-cyan)]/[0.11]" />
                      </div>

                      <div
                        className="relative z-10 transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/card:scale-[1.04]"
                        style={{
                          width: `min(90%, ${category.imageFrame.width}px)`,
                          aspectRatio: `${category.imageFrame.width} / ${category.imageFrame.height}`,
                          maxHeight: "100%",
                        }}
                      >
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-contain object-center drop-shadow-[0_18px_36px_rgba(0,0,0,0.24)]"
                          sizes="(max-width: 768px) 90vw, 400px"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-[0.32] flex-col items-center justify-start px-8 pb-8 pt-1 text-center sm:px-12 sm:pb-10">
                    <h3 className="text-2xl font-semibold tracking-tight text-white md:text-[1.75rem]">
                      {category.name}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--muted)] md:text-base">
                      {category.description}
                    </p>
                    <Button
                      href={category.href}
                      variant="inline-link"
                      className="mt-5 gap-1.5 text-sm font-medium duration-350 ease-out group-hover/card:[&_svg]:translate-x-0.5"
                    >
                      Explorar
                      <IconArrowRight className="h-4 w-4 transition-transform duration-350 ease-out" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex items-center justify-center gap-2 pb-7 pt-1"
              role="tablist"
              aria-label="Categorías"
            >
              {navigableCategories.map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Ir a ${category.name}`}
                  onClick={() => goTo(index)}
                  className={`rounded-full transition-all duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    index === active
                      ? "h-1.5 w-6 bg-[var(--brand-cyan)]/75"
                      : "h-1.5 w-1.5 bg-white/25 hover:bg-white/45"
                  }`}
                />
              ))}
            </div>
          </article>
        </div>

        <div className="mt-6 hidden flex-wrap items-center justify-center gap-3 sm:flex md:mt-10">
          {["Cargadores originales iPhone", "Fundas · Vidrios · AirPods"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium tracking-wide text-zinc-300 backdrop-blur-sm"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-24 bg-gradient-to-t from-[var(--void)] to-transparent" />
    </section>
  );
}
