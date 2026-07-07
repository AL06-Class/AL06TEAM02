"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { PLACEHOLDER_IMAGES, type PlaceholderImageKind } from "@/lib/image-placeholders";
import { cn } from "./utils";

type SmartImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallback?: PlaceholderImageKind;
  fallbackClassName?: string;
};

export function SmartImage({ src, fallback = "default", fallbackClassName, className, style, alt, onError, ...props }: SmartImageProps) {
  const fallbackSrc = PLACEHOLDER_IMAGES[fallback];
  const initialSrc = src || fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const showingFallback = currentSrc === fallbackSrc;

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [fallbackSrc, src]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      className={cn(className, showingFallback && fallbackClassName)}
      data-fallback={showingFallback ? "true" : undefined}
      style={showingFallback ? { ...style, objectFit: "contain" } : style}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
        onError?.(event);
      }}
    />
  );
}
