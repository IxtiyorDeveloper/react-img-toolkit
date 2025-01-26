import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { extractImageUrlsFromData } from "../utils";

// Utility to check if an image is cached
async function isImageCached(url: string): Promise<boolean> {
  const cache = await caches.open("image-preloader-cache");
  const cachedResponse = await cache.match(url);
  return !!cachedResponse;
}

// Utility to cache images
async function cacheImages(urls: string[]) {
  const cache = await caches.open("image-preloader-cache");
  await Promise.all(
    urls.map(async (url) => {
      if (!(await isImageCached(url))) {
        try {
          await cache.add(url);
        } catch (error) {
          console.error(`Failed to cache image: ${url}`, error);
        }
      }
    }),
  );
}

interface UseImagePreloaderProps {
  data?: any; // Array of image URLs
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useImagePreloader = ({
  data = [],
  onSuccess,
  onError,
}: UseImagePreloaderProps = {}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const preloadedImagesCount = useRef(0);
  // Extract and deduplicate URLs from `data`
  const uniqueUrls = useMemo(() => {
    const urlsFromData = Array.isArray(data)
      ? data
      : extractImageUrlsFromData(data);
    return Array.from(new Set(urlsFromData)); // Use Set to ensure uniqueness
  }, [data]);

  const preloadImages = useCallback(async () => {
    try {
      const uncachedUrls: string[] = [];
      for (const url of uniqueUrls) {
        if (!(await isImageCached(url))) {
          uncachedUrls.push(url);
        }
      }

      if (uncachedUrls.length) {
        await cacheImages(uncachedUrls);
        setImageUrls((prev) => [...prev, ...uncachedUrls]);
        preloadedImagesCount.current += uncachedUrls.length;
        if (preloadedImagesCount.current === uniqueUrls.length) {
          onSuccess?.();
        }
      }
    } catch (error: any) {
      onError?.(error);
    }
  }, [uniqueUrls, onSuccess, onError]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  return { imageUrls };
};
