// src/components/ImagePreloader.tsx
import React, { useEffect } from "react";
import { extractImageUrlsFromData, preloadImages } from "../utils";

interface ImagePreloaderProps {
  data: any;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({
  data,
  onSuccess,
  onError,
  children,
}) => {
  useEffect(() => {
    const extractUrls = async () => {
      const urls = extractImageUrlsFromData(data);
      try {
        await preloadImages(urls);
        onSuccess?.();
      } catch (error: any) {
        onError?.(error);
      } finally {
      }
    };
    extractUrls();
  }, [data, onSuccess, onError]);

  return <>{children}</>;
};
