"use client";

import { useEffect, useState } from "react";
import {
  getImageFrame,
  getProductImageBoxStyle,
} from "@/lib/data";
import { useVariantImageOverride } from "@/components/catalog/product-page/VariantImageContext";
import { ProductImage } from "@/components/ui/ProductImage";

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
  const variantImage = useVariantImageOverride();
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedImage, setDisplayedImage] = useState(images[0] ?? "");
  const [isFading, setIsFading] = useState(false);
  const frame = getImageFrame(imageFrame);
  const baseImage = images[activeIndex] ?? images[0];
  const targetImage = variantImage?.overrideImage ?? baseImage;
  const detailImageSizing = { imageFrameFill };

  useEffect(() => {
    if (!targetImage || targetImage === displayedImage) return;

    setIsFading(true);
    const timer = window.setTimeout(() => {
      setDisplayedImage(targetImage);
      setIsFading(false);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [displayedImage, targetImage]);

  useEffect(() => {
    if (!variantImage?.overrideImage) {
      setDisplayedImage(baseImage);
    }
  }, [baseImage, variantImage?.overrideImage]);

  if (!displayedImage) return null;

  const showThumbnails = images.length > 1 && !variantImage?.overrideImage;
  const fallbackImage = baseImage && baseImage !== displayedImage ? baseImage : "";

  return (
    <div className="w-full">
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-[2rem] border border-white/[0.08] ${accent}`}
      >
        {/* Plate clara: las fundas negras no se pierden sobre el fondo oscuro */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.06)_45%,rgba(10,12,16,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,255,255,0.1),transparent_65%)]" />
        <div className="absolute inset-0 flex items-center justify-center p-[7.5%]">
          <div
            className="relative h-full w-full"
            style={getProductImageBoxStyle(detailImageSizing, frame, "detail")}
          >
            <ProductImage
              key={displayedImage}
              src={displayedImage}
              alt={`${name} — imagen principal`}
              fill
              priority={activeIndex === 0 && !variantImage?.overrideImage}
              onError={() => {
                if (!fallbackImage) return;
                setDisplayedImage(fallbackImage);
              }}
              className={`object-contain object-center drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)] transition-opacity duration-300 ${
                isFading ? "opacity-0" : "opacity-100"
              }`}
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
        </div>
      </div>

      {showThumbnails && (
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
                <ProductImage
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
