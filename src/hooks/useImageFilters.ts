import { useState, useEffect } from "react";

interface FilterOptions {
  src: string; // Source image URL
  filter?: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    grayscale?: number;
    hueRotate?: number;
    invert?: number;
    opacity?: number;
    saturate?: number;
    sepia?: number;
  };
}

export const useImageFilters = ({ src, filter }: FilterOptions) => {
  const [filteredImage, setFilteredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const applyFilter = async () => {
      setLoading(true);
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const img = new Image();
        img.src = URL.createObjectURL(blob);

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Apply the specified filter
            if (filter) {
              ctx.filter = `
                ${filter.blur ? `blur(${filter.blur}px)` : ""}
                ${filter.brightness ? `brightness(${filter.brightness}%)` : ""}
                ${filter.contrast ? `contrast(${filter.contrast}%)` : ""}
                ${filter.grayscale ? `grayscale(${filter.grayscale}%)` : ""}
                ${filter.hueRotate ? `hue-rotate(${filter.hueRotate}deg)` : ""}
                ${filter.invert ? `invert(${filter.invert}%)` : ""}
                ${filter.opacity ? `opacity(${filter.opacity}%)` : ""}
                ${filter.saturate ? `saturate(${filter.saturate}%)` : ""}
                ${filter.sepia ? `sepia(${filter.sepia}%)` : ""}
              `.trim();
            }
            ctx.drawImage(img, 0, 0);

            // Create a Blob from the canvas
            canvas.toBlob((blob) => {
              if (blob) {
                const filteredUrl = URL.createObjectURL(blob);
                setFilteredImage(filteredUrl);
              }
            });
          } else {
            console.error("Failed to get canvas context");
          }
        };
      } catch (error) {
        console.error("Failed to apply filter:", error);
        setFilteredImage(null);
      } finally {
        setLoading(false);
      }
    };

    applyFilter();
  }, [
    src,
    filter?.blur,
    filter?.brightness,
    filter?.contrast,
    filter?.grayscale,
    filter?.hueRotate,
    filter?.invert,
    filter?.opacity,
    filter?.saturate,
    filter?.sepia,
  ]);

  return { filteredImage, loading };
};
