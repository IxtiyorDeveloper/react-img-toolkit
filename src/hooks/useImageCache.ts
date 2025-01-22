import { useState, useEffect } from "react";

// Global cache to store loaded image URLs
const imageCache = new Map<string, boolean>();

export const useImageCache = ({ src }: { src: string }) => {
  const [loading, setLoading] = useState(!imageCache.has(src));
  const [isCached, setIsCached] = useState(imageCache.has(src));

  useEffect(() => {
    if (imageCache.has(src)) {
      setLoading(false);
      setIsCached(true);
      return;
    }

    const img = new Image();

    img.onload = () => {
      imageCache.set(src, true);
      setLoading(false);
      setIsCached(true);
    };

    img.onerror = () => {
      setLoading(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return {
    cachedSrc: src,
    loading,
    isCached,
  };
};
