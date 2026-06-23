"use client";

import { useState } from "react";
import Image from "next/image";
import {
  getImageFrame,
  getProductImageBoxStyle,
} from "@/lib/data";

type ProductGalleryProps = {
  name: string;
  images: string[];
  accent: string;
  imageFrame: { width: number; height: number };
  imageFrameFill?: number;
};

export function ProductGallery({
  name,
  images,
  accent,
  imageFrame,
  imageFrameFill = 0.85,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const frame = getImageFrame(imageFrame);
  const activeImage = images[activeIndex] ?? images[0];
  const detailImageSizing = { imageFrameFill };

  if (!activeImage) return null;

  return (
    <div className="w-full">
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[var(--surface)] ${accent}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(157,78,221,0.1),transparent_70%)]" />
        <div className="absolute inset-0 flex items-center justify-center p-[7.5%]">
          <div
            className="relative h-full w-full"
            style={getProductImageBoxStyle(detailImageSizing, frame, "detail")}
          >
            <Image
              key={activeImage}
              src={activeImage}
              alt={`${name} — imagen ${activeIndex + 1}`}
              fill
              priority={activeIndex === 0}
              className="object-contain object-center drop-shadow-[0_18px_28px_rgba(0,0,0,0.24)]"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver imagen ${index + 1} de ${images.length}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-[var(--surface)] transition-colors ${
                  isActive
                    ? "border-[var(--brand-cyan)] ring-2 ring-[var(--brand-cyan)]/30"
                    : "border-white/[0.08] hover:border-white/20"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-contain p-1.5"
                  sizes="64px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
