import { useState, useEffect, useCallback, useMemo } from "react";
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
    // Extract URLs from data if provided
    const urlsFromData = data ? extractImageUrlsFromData(data) : [];
    const allUrls = [...(urls || []), ...urlsFromData].filter(
      (url, index, self) => self.indexOf(url) === index,
    ); // Remove duplicates
    const uniqueUrls = allUrls.filter(
      (url, index, self) => self.indexOf(url) === index,
    );

    if (!uniqueUrls.length) return;

    const images = uniqueUrls.map((url) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url; // Set the source after defining onload and onerror
      });
    });

    Promise.all(images)
      .then((loadedUrls) => {
        // Update the state only after all images are loaded
        updateImageUrls(loadedUrls);
        onSuccess?.();
      })
      .catch((error) => {
        onError?.(error);
      });
  }, [uniqueUrls, updateImageUrls]);

  return { imageUrls, count };
};
