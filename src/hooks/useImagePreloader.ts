import { useEffect, useCallback, useMemo, useRef } from "react";
import {
  cacheImages,
  extractImageUrlsFromData,
  isImageCached,
  preloadImages,
} from "../utils";

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
  const preloadedImagesCount = useRef(0);
  const hasPreloaded = useRef(false); // Ensure preload happens only once

  // Extract and deduplicate URLs from `data`
  const uniqueUrls = useMemo(() => {
    const urlsFromData = extractImageUrlsFromData(data);
    return Array.from(new Set(urlsFromData)); // Use Set to ensure uniqueness
  }, [data]);

  // Separate function to determine uncached URLs
  const getUncachedUrls = useCallback(async (): Promise<string[]> => {
    const uncachedUrls: string[] = [];
    for (const url of uniqueUrls) {
      if (!(await isImageCached(url))) {
        uncachedUrls.push(url);
      }
    }
    return uncachedUrls;
  }, [uniqueUrls]);

  // Function to preload images
  const preloadImg = useCallback(async () => {
    if (hasPreloaded.current) return; // Prevent multiple preloads
    try {
      const uncachedUrls = await getUncachedUrls();

      if (uncachedUrls.length) {
        await cacheImages(uncachedUrls);
        await preloadImages(uncachedUrls);
        preloadedImagesCount.current += uncachedUrls.length;

        if (preloadedImagesCount.current === uniqueUrls.length) {
          hasPreloaded.current = true; // Mark preload as complete
          onSuccess?.();
        }
      }
    } catch (error: any) {
      onError?.(error);
    }
  }, [uniqueUrls, getUncachedUrls, onSuccess, onError, hasPreloaded]);

  // Trigger preload once when component mounts or data changes
  useEffect(() => {
    preloadImg();
  }, [preloadImg]);

  return { imageUrls: uniqueUrls };
};
