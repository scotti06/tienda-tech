"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { Category } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/ui/Icons";

const AUTOPLAY_MS = 5000;
const SWIPE_HINT_OFFSET_PX = 7;
const SCROLL_SYNC_DEBOUNCE_MS = 64;

type HeroMobileCarouselProps = {
  categories: Category[];
  active: number;
  onActiveChange: (index: number) => void;
};

export function HeroMobileCarousel({
  categories,
  active,
  onActiveChange,
}: HeroMobileCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoplayPausedRef = useRef(false);
  const programmaticScrollRef = useRef(false);
  const scrollSyncTimerRef = useRef<number | null>(null);
  const hintPlayedRef = useRef(false);

  const pauseAutoplay = useCallback(() => {
    autoplayPausedRef.current = true;
  }, []);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const el = scrollRef.current;
      if (!el) return;

      programmaticScrollRef.current = true;
      const width = el.clientWidth;
      el.scrollTo({ left: index * width, behavior });

      window.setTimeout(() => {
        programmaticScrollRef.current = false;
      }, behavior === "smooth" ? 420 : 48);
    },
    [],
  );

  const syncActiveFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;

    const index = Math.round(el.scrollLeft / el.clientWidth);
    const clamped = Math.max(0, Math.min(index, categories.length - 1));

    if (clamped !== active) {
      onActiveChange(clamped);
    }
  }, [active, categories.length, onActiveChange]);

  const handleScroll = useCallback(() => {
    if (!programmaticScrollRef.current) {
      pauseAutoplay();
    }

    if (scrollSyncTimerRef.current !== null) {
      window.clearTimeout(scrollSyncTimerRef.current);
    }

    scrollSyncTimerRef.current = window.setTimeout(() => {
      syncActiveFromScroll();
    }, SCROLL_SYNC_DEBOUNCE_MS);
  }, [pauseAutoplay, syncActiveFromScroll]);

  const goToDot = useCallback(
    (index: number) => {
      pauseAutoplay();
      onActiveChange(index);
      scrollToIndex(index);
    },
    [onActiveChange, pauseAutoplay, scrollToIndex],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onResize = () => {
      scrollToIndex(active, "auto");
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [active, scrollToIndex]);

  useEffect(() => {
    if (autoplayPausedRef.current) return;

    const id = window.setInterval(() => {
      if (autoplayPausedRef.current) return;

      const next = (active + 1) % categories.length;
      onActiveChange(next);
      scrollToIndex(next);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [active, categories.length, onActiveChange, scrollToIndex]);

  useEffect(() => {
    if (hintPlayedRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = scrollRef.current;
    if (!el) return;

    hintPlayedRef.current = true;
    programmaticScrollRef.current = true;

    const startTimer = window.setTimeout(() => {
      el.scrollTo({ left: SWIPE_HINT_OFFSET_PX, behavior: "smooth" });

      window.setTimeout(() => {
        el.scrollTo({ left: 0, behavior: "smooth" });
        window.setTimeout(() => {
          programmaticScrollRef.current = false;
        }, 420);
      }, 480);
    }, 720);

    return () => window.clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollSyncTimerRef.current !== null) {
        window.clearTimeout(scrollSyncTimerRef.current);
      }
    };
  }, []);

  return (
    <article className="flex h-[197px] w-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] glass-card shadow-[0_0_0_1px_rgba(157,78,221,0.06),0_16px_40px_-14px_rgba(0,0,0,0.42)]">
      <div
        ref={scrollRef}
        className="hero-mobile-carousel hide-scrollbar flex min-h-0 flex-1 touch-pan-x overflow-x-auto overscroll-x-contain"
        onScroll={handleScroll}
        onTouchStart={pauseAutoplay}
        onPointerDown={pauseAutoplay}
        aria-roledescription="carrusel"
        aria-label="Categorías destacadas"
      >
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="hero-mobile-carousel-slide flex w-full shrink-0 flex-row items-center gap-2 px-2.5 pt-2 pb-0.5"
            aria-hidden={index !== active}
          >
            <div className="relative flex h-[118px] w-[42%] max-w-[168px] shrink-0 items-center justify-center">
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                aria-hidden
              >
                <div className="absolute h-[88%] w-[88%] rounded-full bg-[var(--brand-purple)]/[0.11] blur-[40px]" />
                <div className="absolute h-[60%] w-[60%] rounded-full bg-[var(--brand-cyan)]/[0.07] blur-[32px]" />
              </div>

              <div
                className="relative z-10 h-full w-full"
                style={{
                  aspectRatio: `${category.imageFrame.width} / ${category.imageFrame.height}`,
                  maxHeight: "118px",
                }}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-contain object-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.22)]"
                  sizes="168px"
                  priority={index === 0}
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-0.5 text-left">
              <h3 className="text-lg font-semibold leading-tight tracking-tight text-white line-clamp-2">
                {category.name}
              </h3>
              <p className="line-clamp-1 text-xs leading-snug text-[var(--muted)]">
                {category.description}
              </p>
              <Button
                href={category.href}
                variant="inline-link"
                className="mt-0.5 gap-1.5 text-sm font-medium"
              >
                Explorar
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div
        className="flex shrink-0 items-center justify-center gap-2 px-2.5 pb-2 pt-0"
        role="tablist"
        aria-label="Categorías"
      >
        {categories.map((category, index) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`Ir a ${category.name}`}
            onClick={() => goToDot(index)}
            className={`rounded-full transition-all duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              index === active
                ? "h-1.5 w-6 bg-[var(--brand-cyan)]/75"
                : "h-1.5 w-1.5 bg-white/25"
            }`}
          />
        ))}
      </div>
    </article>
  );
}
