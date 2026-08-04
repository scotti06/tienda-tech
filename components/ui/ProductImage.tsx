"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

const FALLBACK_IMAGE = "/products/funda-iphone.webp";

type ProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
  fallbackSrc?: string;
};

/**
 * next/image wrapper that swaps to a local fallback when the primary src 404s
 * (common when admin uploads were saved under /uploads but not deployed).
 */
export function ProductImage({
  src,
  alt,
  fallbackSrc = FALLBACK_IMAGE,
  onError,
  ...props
}: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  return (
    <Image
      {...props}
      src={currentSrc || fallbackSrc}
      alt={alt}
      onError={(event) => {
        onError?.(event);
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
