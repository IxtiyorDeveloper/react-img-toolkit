import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { extractImageUrlsFromData } from "../utils";

interface UseImagePreloaderProps {
  urls?: string[];
  data?: any;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useImagePreloader = ({
  urls = [],
  data = {},
  onSuccess,
  onError,
}: UseImagePreloaderProps = {}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  // Ref to persist stateUpdated across renders
  const stateUpdatedRef = useRef(false);

  const uniqueUrls = useMemo(() => {
    const urlsFromData = data ? extractImageUrlsFromData(data) : [];
    const allUrls = [...(urls || []), ...urlsFromData];
    return Array.from(new Set(allUrls)); // Use Set to ensure uniqueness
  }, [urls, data]);

  const updateImageUrls = useCallback((loadedUrls: string[]) => {
    setImageUrls((prevUrls) => {
      const uniquePrevUrls = new Set(prevUrls);
      const uniqueNewUrls = new Set([...prevUrls, ...loadedUrls]);

      // Only update state if the sets are different
      if (uniquePrevUrls.size === uniqueNewUrls.size) return prevUrls;

      return Array.from(uniqueNewUrls); // Convert Set back to array
    });

    setCount((prevCount) => {
      const uniqueNewUrls = new Set([...loadedUrls]);
      return uniqueNewUrls.size !== prevCount ? uniqueNewUrls.size : prevCount;
    });
  }, []);

  useEffect(() => {
    // Filter out URLs that are already in imageUrls to prevent reloading cached ones
    const urlsToLoad = uniqueUrls.filter((url) => !imageUrls.includes(url));

    if (!urlsToLoad.length) return; // If no new URLs to load, exit early

    const images = urlsToLoad.map((url) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url; // Set the source after defining onload and onerror
      });
    });

    Promise.all(images)
      .then((loadedUrls) => {
        if (!stateUpdatedRef.current) {
          updateImageUrls(loadedUrls);
          onSuccess?.();
          stateUpdatedRef.current = true; // Set the ref to true to prevent further updates
        }
      })
      .catch((error) => {
        onError?.(error);
      });
  }, [uniqueUrls, imageUrls, updateImageUrls, onSuccess, onError]);

  return { imageUrls, count };
};
