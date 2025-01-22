import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { extractImageUrlsFromData } from "../utils";

interface UseImagePreloaderProps {
  data?: any; // Accepts any data that can contain URLs
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useImagePreloader = ({
  data = [],
  onSuccess,
  onError,
}: UseImagePreloaderProps = {}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const stateUpdatedRef = useRef(false);

  // Extract and deduplicate URLs from `data`
  const uniqueUrls = useMemo(() => {
    const urlsFromData = Array.isArray(data)
      ? data
      : extractImageUrlsFromData(data);
    return Array.from(new Set(urlsFromData)); // Use Set to ensure uniqueness
  }, [data]);

  const updateImageUrls = useCallback((loadedUrls: string[]) => {
    setImageUrls((prevUrls) => {
      const uniquePrevUrls = new Set(prevUrls);
      const uniqueNewUrls = new Set([...prevUrls, ...loadedUrls]);

      if (uniquePrevUrls.size === uniqueNewUrls.size) return prevUrls;

      return Array.from(uniqueNewUrls); // Convert Set back to array
    });

    setCount((prevCount) => {
      const uniqueNewUrls = new Set([...loadedUrls]);
      return uniqueNewUrls.size !== prevCount ? uniqueNewUrls.size : prevCount;
    });
  }, []);

  useEffect(() => {
    // Filter out URLs that are already loaded
    const urlsToLoad = uniqueUrls.filter((url) => !imageUrls.includes(url));
    if (!urlsToLoad.length) return;

    const images = urlsToLoad.map((url) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    });

    Promise.all(images)
      .then((loadedUrls) => {
        if (!stateUpdatedRef.current) {
          updateImageUrls(loadedUrls);
          onSuccess?.();
          stateUpdatedRef.current = true;
        }
      })
      .catch((error) => {
        onError?.(error);
      });
  }, [uniqueUrls, imageUrls, updateImageUrls, onSuccess, onError]);

  return { imageUrls, count };
};
