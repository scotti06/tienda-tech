"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export const SCROLL_REVEAL_STAGGER_MS = 80;

/** Matches Tailwind `md` — scroll reveal is skipped below this width (iOS Safari IO issues). */
const MOBILE_MAX_WIDTH_MEDIA = "(max-width: 767px)";

function shouldSkipRevealAnimation(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia(MOBILE_MAX_WIDTH_MEDIA).matches
  );
}

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms (typically 60–100 between siblings). */
  delay?: number;
};

function isInRevealViewport(el: HTMLElement, rootMarginBottom = 48): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;

  const viewBottom = window.innerHeight - rootMarginBottom;
  const visibleHeight = Math.min(rect.bottom, viewBottom) - Math.max(rect.top, 0);

  if (visibleHeight <= 0) return false;

  return visibleHeight / rect.height >= 0.01;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (shouldSkipRevealAnimation()) {
      setVisible(true);
      return;
    }

    const reveal = () => setVisible(true);

    if (isInRevealViewport(el)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -48px 0px" },
    );

    observer.observe(el);

    const raf = requestAnimationFrame(() => {
      if (isInRevealViewport(el)) {
        reveal();
        observer.disconnect();
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? "scroll-reveal-visible" : ""} ${className}`.trim()}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
