import React, { useEffect, useMemo, useRef } from "react";
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
  // Memoize the combined list of URLs to avoid unnecessary computations
  const allUrls = useMemo(() => {
    const urlsFromData = data ? extractImageUrlsFromData(data) : [];
    return Array.from(new Set([...urls, ...urlsFromData])); // Convert Set to Array
  }, [urls, data]);

  // Ref to track if the images have been preloaded already
  const preloadedRef = useRef(false);
  const successTriggeredRef = useRef(false); // New ref to track success callback invocation

  useEffect(() => {
    if (!allUrls.length || preloadedRef.current) return; // Skip if already preloaded

    const preloadAllImages = async () => {
      try {
        await preloadImages(allUrls); // Preload images
        if (!successTriggeredRef.current) {
          // Check if success has already been triggered
          onSuccess?.(); // Trigger success callback if provided
          successTriggeredRef.current = true; // Set the flag to avoid multiple calls
        }
        preloadedRef.current = true; // Mark as preloaded to avoid redundant preload
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    };

    preloadAllImages();
  }, [allUrls, onSuccess, onError]);

  return <>{children}</>;
};
