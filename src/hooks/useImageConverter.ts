import { useState, useCallback } from "react";

interface ConvertOptions {
  format: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  quality?: number; // 0 to 1 (only for JPEG/WebP)
  keepTransparency?: boolean; // Keeps transparency for PNG/WebP
}

export function useImageConverter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertImage = useCallback(
    async (file: File, options: ConvertOptions): Promise<Blob | null> => {
      setLoading(true);
      setError(null);

      try {
        const { format, quality = 0.8, keepTransparency = true } = options;

        // Load image
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = event.target?.result as string;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get canvas context");

        canvas.width = img.width;
        canvas.height = img.height;

        // Handle transparency removal for JPEG/WebP
        if (
          !keepTransparency &&
          (format === "image/jpeg" || format === "image/webp")
        ) {
          ctx.fillStyle = "white"; // Background color
          ctx.fillRect(0, 0, img.width, img.height);
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);

        return await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, format, quality);
        });
      } catch (err) {
        setError((err as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { convertImage, loading, error };
}
