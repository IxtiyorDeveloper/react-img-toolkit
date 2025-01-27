import { useState, useEffect } from "react";
import { isImageCached } from "../utils";

export const useImageCache = ({ src }: { src: string }) => {
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    const checkAndCacheImage = async () => {
      setLoading(true);

      // Check if the image is already cached in the browser
      const browserCached = await isImageCached(src);
      if (browserCached) {
        setIsCached(true);
        setLoading(false);
        return;
      }

      // Load the image and add it to the browser cache
      const img = new Image();

      img.onload = async () => {
        setIsCached(true);
        setLoading(false);

        // Add the loaded image to the browser cache
        try {
          const cache = await caches.open("image-preloader-cache");
          await cache.add(src);
        } catch (error) {
          console.warn("Failed to add image to browser cache:", src, error);
        }
      };

      img.onerror = () => {
        setLoading(false);
      };

      img.src = src;

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    };

    checkAndCacheImage();
  }, [src]);

  return {
    cachedSrc: src,
    loading,
    isCached,
  };
};
