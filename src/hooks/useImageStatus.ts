import { useState, useEffect } from "react";
import { isImageCached } from "../utils";

type ImageStatus = "idle" | "loading" | "loaded" | "error";

export const useImageStatus = ({ src }: { src: string }): ImageStatus => {
  const [status, setStatus] = useState<ImageStatus>("idle");

  useEffect(() => {
    if (!src) {
      setStatus("idle");
      return;
    }

    const checkImageStatus = async () => {
      setStatus("loading");

      // Check if the image is already cached
      const isCached = await isImageCached(src);
      if (isCached) {
        setStatus("loaded");
        return;
      }

      // Load the image if not cached
      const img = new Image();

      img.onload = async () => {
        setStatus("loaded");

        // Add the image to the browser cache
        try {
          const cache = await caches.open("image-preloader-cache");
          await cache.add(src);
        } catch (error) {
          console.warn("Failed to add image to cache:", src, error);
        }
      };

      img.onerror = () => {
        setStatus("error");
      };

      img.src = src;

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    };

    checkImageStatus();
  }, [src]);

  return status;
};
