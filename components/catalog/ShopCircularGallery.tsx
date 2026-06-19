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
import { formatPrice, getImageFrame } from "@/lib/data";
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
    cardWidth: 168,
    cardHeight: 220,
    stageHeight: 300,
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
          radius: 280,
          cardWidth: 184,
          cardHeight: 248,
          stageHeight: 320,
        });
      } else {
        setMetrics({
          radius: 210,
          cardWidth: 156,
          cardHeight: 212,
          stageHeight: 280,
        });
      }
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return metrics;
}

type ShopCircularGalleryProps = {
  products: Product[];
};

export function ShopCircularGallery({ products }: ShopCircularGalleryProps) {
  const metrics = useGalleryMetrics();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const dragStartX = useRef(0);
  const regionRef = useRef<HTMLDivElement>(null);

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

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

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
    if (prefersReducedMotion || count <= 1 || isDragging) return;

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 5000);

    return () => window.clearInterval(id);
  }, [count, isDragging, prefersReducedMotion]);

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
    setIsDragging(true);
    dragStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      if (!isDragging) return;

      const delta = event.clientX - dragStartX.current;
      const threshold = 40;

      if (delta > threshold) goPrev();
      else if (delta < -threshold) goNext();

      setIsDragging(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [goNext, goPrev, isDragging],
  );

  const handlePointerCancel = useCallback(() => {
    setIsDragging(false);
  }, []);

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
    ? "transition-none"
    : "transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]";

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
                const imageFrame = getImageFrame(product.imageFrame);
                const opacity = itemOpacity(index);
                const isActive = index === activeIndex;

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
                    <Link
                      href={productHref}
                      tabIndex={isActive ? 0 : -1}
                      className={`card-hover group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-[var(--surface)] ${
                        isActive
                          ? "border-[var(--brand-purple)]/30 shadow-[0_0_24px_rgba(157,78,221,0.15)]"
                          : "border-white/[0.08]"
                      } ${product.accent}`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(157,78,221,0.12),transparent_60%)]" />

                      <div className="relative flex flex-1 items-center justify-center p-4 sm:p-5">
                        <div
                          className="relative card-hover-image"
                          style={{
                            width: `min(100%, ${Math.round(imageFrame.width * 0.72)}px)`,
                            aspectRatio: `${imageFrame.width} / ${imageFrame.height}`,
                            maxHeight: "72%",
                          }}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain object-center drop-shadow-[0_12px_20px_rgba(0,0,0,0.22)]"
                            sizes={`(max-width: 640px) 156px, ${metrics.cardWidth}px`}
                            priority={index === 0}
                          />
                        </div>
                      </div>

                      <div className="relative bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 sm:p-4">
                        <p className="text-[10px] font-medium tracking-[0.15em] text-[var(--brand-cyan)] uppercase">
                          {product.category}
                        </p>
                        <h3 className="mt-1 text-sm font-semibold leading-snug text-white line-clamp-2 sm:text-base">
                          {product.name}
                        </h3>
                        <p className="mt-1.5 text-sm font-semibold text-white">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
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
              onClick={() => goTo(index)}
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
