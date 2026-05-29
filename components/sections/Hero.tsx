"use client";

import { useCallback, useEffect, useState } from "react";
import { heroSlides } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/Icons";
import { HeroBackgroundBrand } from "@/components/sections/HeroBackgroundBrand";

const SLIDE_DURATION = 6000;

export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = heroSlides[active];

  return (
    <section
      id="inicio"
      className="relative min-h-[92dvh] overflow-hidden pt-[8.75rem] sm:pt-[9.5rem] md:min-h-[88dvh] md:pt-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <HeroBackgroundBrand />

      <div className="pointer-events-none absolute inset-0 z-[1] grid-fade">
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

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 pb-16 text-center sm:px-6 lg:px-8 lg:pb-24">
        <div
          key={slide.id}
          className="flex w-full max-w-4xl flex-col items-center animate-slide-up"
        >
          <p className="text-[11px] font-semibold tracking-[0.25em] text-[var(--muted)] uppercase">
            {slide.eyebrow}
          </p>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {slide.title}{" "}
            <span className="text-gradient-mint">{slide.highlight}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
            {slide.description}
          </p>

          <div className="mt-10">
            <Button href={slide.ctaHref} variant="primary" size="lg">
              {slide.cta}
            </Button>
          </div>
        </div>

        <div className="relative mt-12 w-full max-w-3xl lg:mt-16">
          <div className="relative mx-auto aspect-[16/9] max-h-[340px] w-full overflow-hidden rounded-3xl border border-white/[0.08] glass-card md:max-h-[400px]">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${slide.accent} transition-all duration-1000`}
            />
            <div className="absolute inset-0 flex items-center justify-center gap-8 md:gap-16">
              <div className="h-28 w-16 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent opacity-40 blur-[1px] md:h-40 md:w-20" />
              <div className="relative">
                <div className="h-40 w-40 rounded-[2.5rem] border border-white/15 bg-gradient-to-b from-white/[0.15] to-white/[0.02] shadow-2xl backdrop-blur-md md:h-52 md:w-52 animate-float" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full glass px-4 py-1.5 text-xs font-medium text-white">
                  {slide.productLabel}
                </div>
              </div>
              <div className="h-28 w-16 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent opacity-40 blur-[1px] md:h-40 md:w-20" />
            </div>
          </div>

          <div className="absolute top-1/2 -left-2 hidden -translate-y-1/2 md:block lg:-left-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Slide anterior"
              className="flex h-11 w-11 items-center justify-center rounded-full glass-card text-white transition-all hover:bg-white/10"
            >
              <IconChevronLeft />
            </button>
          </div>
          <div className="absolute top-1/2 -right-2 hidden -translate-y-1/2 md:block lg:-right-6">
            <button
              type="button"
              onClick={next}
              aria-label="Slide siguiente"
              className="flex h-11 w-11 items-center justify-center rounded-full glass-card text-white transition-all hover:bg-white/10"
            >
              <IconChevronRight />
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {["Cargadores originales iPhone", "Fundas · Vidrios · AirPods"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium tracking-wide text-zinc-300 backdrop-blur-sm"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Ir al slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ${
                i === active ? "w-10 bg-white/20" : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            >
              {i === active && (
                <span
                  className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-brand"
                  style={{
                    animation: paused
                      ? "none"
                      : `hero-progress ${SLIDE_DURATION}ms linear forwards`,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-24 bg-gradient-to-t from-[var(--void)] to-transparent" />
    </section>
  );
}
