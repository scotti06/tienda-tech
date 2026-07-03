"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import { getProductHref } from "@/lib/catalog";
import { getButtonClassName } from "@/components/ui/Button";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/Icons";

type GalleryMetrics = {
  radius: number;
  cardWidth: number;
  cardHeight: number;
  stageHeight: number;
};

function useGalleryMetrics(): GalleryMetrics {
  const [metrics, setMetrics] = useState<GalleryMetrics>({
    radius: 240,
    cardWidth: 180,
    cardHeight: 260,
    stageHeight: 340,
  });

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;

      if (width >= 1280) {
        setMetrics({
          radius: 560,
          cardWidth: 252,
          cardHeight: 320,
          stageHeight: 440,
        });
      } else if (width >= 1024) {
        setMetrics({
          radius: 480,
          cardWidth: 228,
          cardHeight: 300,
          stageHeight: 400,
        });
      } else if (width >= 768) {
        setMetrics({
          radius: 360,
          cardWidth: 204,
          cardHeight: 272,
          stageHeight: 360,
        });
      } else if (width >= 640) {
        setMetrics({
          radius: 290,
          cardWidth: 188,
          cardHeight: 268,
          stageHeight: 350,
        });
      } else {
        setMetrics({
          radius: 240,
          cardWidth: 180,
          cardHeight: 260,
          stageHeight: 340,
        });
      }
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return metrics;
}

function getCarouselCardLayout(cardWidth: number) {
  if (cardWidth <= 180) {
    return {
      imageHeight: 100,
      imagePadding: "px-2.5 pt-2",
      footerPadding: "px-2.5 pb-2.5 pt-1",
      category: "text-[8px] tracking-[0.12em] leading-none",
      name: "text-[10px] leading-[1.3] font-semibold",
      price: "text-[11px] mt-1 font-semibold leading-none",
    };
  }

  if (cardWidth <= 220) {
    return {
      imageHeight: 118,
      imagePadding: "px-3 pt-2.5",
      footerPadding: "px-3 pb-3 pt-1",
      category: "text-[9px] tracking-[0.13em] leading-none",
      name: "text-[11px] leading-[1.35] font-semibold",
      price: "text-xs mt-1 font-semibold leading-none",
    };
  }

  return {
    imageHeight: 148,
    imagePadding: "px-4 pt-4 sm:px-5 sm:pt-5",
    footerPadding: "px-3 pb-3 pt-1 sm:px-4 sm:pb-4",
    category: "text-[10px] tracking-[0.15em] leading-none",
    name: "text-sm leading-snug font-semibold sm:text-base",
    price: "text-sm mt-1.5 font-semibold leading-none",
  };
}

const AUTOPLAY_INTERVAL_MS = 4000;
const AUTOPLAY_RESUME_MS = 5000;
const TAP_THRESHOLD_PX = 10;
const DRAG_THRESHOLD_PX = 40;

type ShopCircularGalleryProps = {
  products: Product[];
  /** Intervalo entre slides automáticos (ms). `0` desactiva autoplay. */
  autoplayInterval?: number;
};

export function ShopCircularGallery({
  products,
  autoplayInterval = AUTOPLAY_INTERVAL_MS,
}: ShopCircularGalleryProps) {
  const metrics = useGalleryMetrics();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const didDragRef = useRef(false);
  const pointerActiveRef = useRef(false);
  const regionRef = useRef<HTMLDivElement>(null);
  const resumeAutoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoplayPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isInViewRef = useRef(true);

  const count = products.length;
  const anglePerItem = count > 0 ? 360 / count : 0;
  const rotation = count > 0 ? -activeIndex * anglePerItem : 0;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      const normalized = ((index % count) + count) % count;
      setActiveIndex(normalized);
    },
    [count],
  );

  const pauseAutoplay = useCallback((resumeAfterMs = AUTOPLAY_RESUME_MS) => {
    autoplayPausedRef.current = true;
    setAutoplayPaused(true);
    if (resumeAutoplayRef.current) {
      clearTimeout(resumeAutoplayRef.current);
    }
    if (resumeAfterMs > 0) {
      resumeAutoplayRef.current = setTimeout(() => {
        autoplayPausedRef.current = false;
        setAutoplayPaused(false);
      }, resumeAfterMs);
    }
  }, []);

  const goPrev = useCallback(() => {
    pauseAutoplay();
    goTo(activeIndex - 1);
  }, [activeIndex, goTo, pauseAutoplay]);

  const goNext = useCallback(() => {
    pauseAutoplay();
    goTo(activeIndex + 1);
  }, [activeIndex, goTo, pauseAutoplay]);

  const goToInteractive = useCallback(
    (index: number) => {
      pauseAutoplay();
      goTo(index);
    },
    [goTo, pauseAutoplay],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [products]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeAutoplayRef.current) {
        window.clearTimeout(resumeAutoplayRef.current);
      }
    };
  }, []);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    autoplayPausedRef.current = autoplayPaused;
  }, [autoplayPaused]);

  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.25 },
    );

    observer.observe(region);
    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    if (autoplayInterval <= 0 || count <= 1) return;

    const id = window.setInterval(() => {
      if (
        autoplayPausedRef.current ||
        isDraggingRef.current ||
        !isInViewRef.current ||
        document.hidden
      ) {
        return;
      }

      setActiveIndex((prev) => (prev + 1) % count);
    }, autoplayInterval);

    return () => window.clearInterval(id);
  }, [autoplayInterval, count, products]);

  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    region.addEventListener("keydown", onKeyDown);
    return () => region.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    pointerActiveRef.current = true;
    didDragRef.current = false;
    dragStartX.current = event.clientX;
    dragStartY.current = event.clientY;
    setIsDragging(false);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (!pointerActiveRef.current) return;

    const deltaX = event.clientX - dragStartX.current;
    const deltaY = event.clientY - dragStartY.current;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > TAP_THRESHOLD_PX) {
      didDragRef.current = true;
      setIsDragging(true);
    }
  }, []);

  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      if (!pointerActiveRef.current) return;

      const deltaX = event.clientX - dragStartX.current;
      const deltaY = event.clientY - dragStartY.current;
      const distance = Math.hypot(deltaX, deltaY);

      pointerActiveRef.current = false;
      setIsDragging(false);

      if (Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
        if (deltaX > 0) goPrev();
        else goNext();
        return;
      }

      if (distance < TAP_THRESHOLD_PX) {
        pauseAutoplay();
        return;
      }

      pauseAutoplay();
    },
    [goNext, goPrev, pauseAutoplay],
  );

  const handlePointerCancel = useCallback(() => {
    pointerActiveRef.current = false;
    didDragRef.current = false;
    setIsDragging(false);
    pauseAutoplay();
  }, [pauseAutoplay]);

  const handleProductLinkClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (didDragRef.current) {
        event.preventDefault();
      }
      didDragRef.current = false;
    },
    [],
  );

  const itemOpacity = useCallback(
    (index: number) => {
      if (count <= 1) return 1;

      const itemAngle = (index * anglePerItem + rotation + 360) % 360;
      const relativeAngle =
        itemAngle > 180 ? 360 - itemAngle : itemAngle;
      return Math.max(0.28, 1 - relativeAngle / 180);
    },
    [anglePerItem, count, rotation],
  );

  const activeProduct = products[activeIndex];

  const liveLabel = useMemo(() => {
    if (!activeProduct) return "";
    return `${activeProduct.name}, ${activeProduct.category}. Producto ${activeIndex + 1} de ${count}`;
  }, [activeProduct, activeIndex, count]);

  if (count === 0) return null;

  const transitionClass = prefersReducedMotion
    ? "transition-[transform,opacity] duration-500 ease-out"
    : "transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]";

  return (
    <div className="relative">
      <div
        ref={regionRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Favoritos del local"
        aria-live="polite"
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] glass-card shadow-[0_0_0_1px_rgba(157,78,221,0.06),0_16px_40px_-14px_rgba(0,0,0,0.42)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-purple)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(157,78,221,0.12),transparent_65%)]"
          aria-hidden
        />

        <p className="sr-only">{liveLabel}</p>

        <div
          className="relative touch-pan-y select-none"
          style={{ height: metrics.stageHeight }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: "1600px" }}
          >
            <div
              className={`relative h-full w-full ${transitionClass}`}
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${rotation}deg)`,
              }}
            >
              {products.map((product, index) => {
                const productHref = getProductHref(product);
                const opacity = itemOpacity(index);
                const isActive = index === activeIndex;
                const layout = getCarouselCardLayout(metrics.cardWidth);
                const billboardRotation = -((index - activeIndex) * anglePerItem);

                return (
                  <div
                    key={product.id}
                    role="group"
                    aria-label={product.name}
                    aria-hidden={!isActive}
                    className={`absolute ${transitionClass}`}
                    style={{
                      width: metrics.cardWidth,
                      height: metrics.cardHeight,
                      left: "50%",
                      top: "50%",
                      marginLeft: -metrics.cardWidth / 2,
                      marginTop: -metrics.cardHeight / 2,
                      transform: `rotateY(${index * anglePerItem}deg) translateZ(${metrics.radius}px)`,
                      opacity,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <div
                      className={`h-full w-full ${transitionClass}`}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: `rotateY(${billboardRotation}deg)`,
                      }}
                    >
                      <Link
                        href={productHref}
                        tabIndex={isActive ? 0 : -1}
                        onClick={handleProductLinkClick}
                        className={`card-hover card-tap group relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border bg-[var(--surface)] ${
                          isActive
                            ? "border-[var(--brand-purple)]/30 shadow-[0_0_24px_rgba(157,78,221,0.15)]"
                            : "border-white/[0.08]"
                        } ${product.accent}`}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(157,78,221,0.12),transparent_60%)]" />

                        <div
                          className={`relative flex shrink-0 items-center justify-center ${layout.imagePadding}`}
                          style={{ height: layout.imageHeight }}
                        >
                          <div className="relative mx-auto h-full w-full max-w-[88%]">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain object-center drop-shadow-[0_12px_20px_rgba(0,0,0,0.22)]"
                              sizes={`(max-width: 640px) 180px, ${metrics.cardWidth}px`}
                              priority={index === 0}
                            />
                          </div>
                        </div>

<<<<<<< HEAD
                      <div className="relative bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 sm:p-4">
                        <p className="text-[10px] font-medium tracking-[0.15em] text-[var(--brand-cyan)] uppercase">
                          {product.category}
                        </p>
                        <h3 className="mt-1 text-sm font-semibold leading-snug text-white line-clamp-2 sm:text-base">
                          {product.name}
                        </h3>
                        <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                          <p className="text-sm font-semibold text-white">
                            {formatPrice(product.price)}
                          </p>
                          {product.originalPrice &&
                            product.originalPrice > product.price && (
                              <p className="text-xs text-[var(--muted)] line-through">
                                {formatPrice(product.originalPrice)}
                              </p>
                            )}
                        </div>
                      </div>
                    </Link>
=======
                        <div
                          className={`relative flex min-h-0 flex-1 flex-col justify-end bg-gradient-to-t from-black/90 via-black/70 to-transparent ${layout.footerPadding}`}
                        >
                          <p
                            className={`shrink-0 font-medium text-[var(--brand-cyan)] uppercase ${layout.category}`}
                          >
                            {product.category}
                          </p>
                          <h3 className={`mt-1 text-white ${layout.name}`}>
                            {product.name}
                          </h3>
                          <p className={`shrink-0 text-white ${layout.price}`}>
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    </div>
>>>>>>> origin/main
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Producto anterior"
              onClick={goPrev}
              className={getButtonClassName({
                variant: "icon",
                size: "icon",
                className:
                  "absolute left-2 top-1/2 z-10 -translate-y-1/2 border-white/[0.12] bg-[var(--void)]/85 opacity-90 hover:opacity-100 sm:left-3",
              })}
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Producto siguiente"
              onClick={goNext}
              className={getButtonClassName({
                variant: "icon",
                size: "icon",
                className:
                  "absolute right-2 top-1/2 z-10 -translate-y-1/2 border-white/[0.12] bg-[var(--void)]/85 opacity-90 hover:opacity-100 sm:right-3",
              })}
            >
              <IconChevronRight />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div
          className="mt-5 flex flex-wrap items-center justify-center gap-2 px-2"
          role="tablist"
          aria-label="Productos destacados"
        >
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Ver ${product.name}`}
              onClick={() => goToInteractive(index)}
              className={`min-h-11 min-w-11 rounded-full p-2 transition-all duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                index === activeIndex
                  ? "bg-[var(--brand-cyan)]/20 ring-1 ring-[var(--brand-cyan)]/40"
                  : "bg-white/[0.04] hover:bg-white/[0.08]"
              }`}
            >
              <span
                className={`mx-auto block rounded-full ${
                  index === activeIndex
                    ? "h-1.5 w-6 bg-[var(--brand-cyan)]/75"
                    : "h-1.5 w-1.5 bg-white/30"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
