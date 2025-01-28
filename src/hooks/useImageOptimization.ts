import { useState, useEffect, useMemo } from "react";
import imageCompression from "browser-image-compression";

export const useImageOptimization = (
  src: string,
  options?: { quality?: number },
) => {
  const [optimizedImage, setOptimizedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Memoize the `src` to prevent changes unless it genuinely updates
  const memoizedSrc = useMemo(() => src, [src]);

  useEffect(() => {
    const optimizeImage = async () => {
      if (!memoizedSrc || !isValidURL(memoizedSrc)) return;

      setLoading(true);
      try {
        const response = await fetch(memoizedSrc); // Fetch the image
        const blob = await response.blob(); // Convert to Blob
        const file = new File([blob], "image", { type: blob.type }); // Convert to File

        // Compress the image
        const compressed = await imageCompression(file, {
          maxSizeMB: options?.quality ?? 0.8,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        // Create a URL for the compressed image
        const optimizedUrl = URL.createObjectURL(compressed);
        setOptimizedImage(optimizedUrl);
      } catch (error) {
        console.error("Image optimization failed:", error);
        setOptimizedImage(null);
      } finally {
        setLoading(false);
      }
    };

    const isValidURL = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    optimizeImage();
  }, [memoizedSrc, options?.quality]); // Only re-run when `memoizedSrc` or `options.quality` change

  return { optimizedImage, loading };
};
