import { useState, useCallback } from "react";

interface ImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1 (for JPEG/WebP)
  format?: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  rotate?: number; // Degrees
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  keepTransparency?: boolean; // Keeps transparency for PNG/WebP
}

export function useImageOptimizer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert to JPEG to ensure it's not JFIF
  const convertToJPEG = (blob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const binaryData = reader.result as ArrayBuffer;
        const arrayBufferView = new Uint8Array(binaryData);
        // Recreate the image as JPEG
        resolve(new Blob([arrayBufferView], { type: "image/jpeg" }));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  };

  const optimizeImage = useCallback(
    async (file: File, options: ImageOptions = {}): Promise<Blob | null> => {
      setLoading(true);
      setError(null);

      try {
        const {
          maxWidth,
          maxHeight,
          quality = 0.8,
          format,
          rotate = 0,
          flipHorizontal = false,
          flipVertical = false,
          keepTransparency = true,
        } = options;

        // Detect MIME type if not specified
        const detectedFormat = format || file.type || "image/png";

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

        let { width, height } = img;

        // Resize logic
        if (maxWidth && width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (maxHeight && height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        // Adjust canvas size
        canvas.width = width;
        canvas.height = height;

        // Set transparent background if needed
        if (
          !keepTransparency &&
          (detectedFormat === "image/jpeg" || detectedFormat === "image/webp")
        ) {
          ctx.fillStyle = "white"; // Background color for non-transparent formats
          ctx.fillRect(0, 0, width, height);
        }

        ctx.save();

        // Handle rotation & flipping
        if (rotate || flipHorizontal || flipVertical) {
          ctx.translate(width / 2, height / 2);
          ctx.rotate((rotate * Math.PI) / 180);
          ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
          ctx.translate(-width / 2, -height / 2);
        }

        ctx.drawImage(img, 0, 0, width, height);
        ctx.restore();

        // Force conversion to JPEG if format is jpeg
        let blob: Blob | null = null;
        if (detectedFormat === "image/jpeg") {
          blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, "image/jpeg", quality);
          });
        } else {
          // For other formats like PNG or WebP
          blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, detectedFormat, quality);
          });
        }

        // If it's JPEG and you still encounter JFIF issues, force re-encoding
        if (blob && detectedFormat === "image/jpeg") {
          const reEncodedBlob = await convertToJPEG(blob);
          return reEncodedBlob;
        }

        return blob;
      } catch (err) {
        setError((err as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { optimizeImage, loading, error };
}
