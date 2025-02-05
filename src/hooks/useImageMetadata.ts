import { useState, useEffect } from "react";

interface ImageMetadata {
  width: number;
  height: number;
  type: string;
  size: number;
  name: string;
}

const useImageMeta = (file: File | null) => {
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        setMetadata({
          width: img.width,
          height: img.height,
          type: file.type,
          size: file.size,
          name: file.name,
        });
        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => {
        setError("Failed to load image");
      };
    };

    reader.onerror = () => {
      setError("Error reading file");
    };

    reader.readAsArrayBuffer(file);
  }, [file]);

  return { metadata, error };
};

export default useImageMeta;
