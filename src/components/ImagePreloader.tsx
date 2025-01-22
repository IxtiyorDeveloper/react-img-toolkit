import React, { useEffect, useMemo } from "react";
import { extractImageUrlsFromData, preloadImages } from "../utils";

interface ImagePreloaderProps {
  urls?: string[]; // Optional array of URLs to preload
  data?: Record<string, any>; // Generic object to extract URLs from
  onSuccess?: () => void; // Callback on successful preload
  onError?: (error: Error) => void; // Callback on preload error
  children: React.ReactNode; // Child components to render
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({
  urls = [],
  data = {},
  onSuccess,
  onError,
  children,
}) => {
  // Memoize the combined list of URLs to avoid unnecessary recomputations
  const allUrls = useMemo(() => {
    const urlsFromData = data ? extractImageUrlsFromData(data) : [];
    return Array.from(new Set([...urls, ...urlsFromData])); // Convert Set to Array
  }, [urls, data]);

  useEffect(() => {
    if (!allUrls.length) return;

    const preloadAllImages = async () => {
      try {
        await preloadImages(allUrls);
        onSuccess?.();
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    };

    preloadAllImages();
  }, [allUrls, onSuccess, onError]);

  return <>{children}</>;
};
