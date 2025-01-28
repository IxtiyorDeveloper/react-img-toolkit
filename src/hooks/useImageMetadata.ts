import { useState, useEffect } from "react";
import EXIF from "exif-js";

export const useImageMetadata = (src: string) => {
  const [metadata, setMetadata] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const img = new Image();
        img.src = URL.createObjectURL(blob);

        img.onload = async () => {
          const { width, height } = img;
          const exifData = await extractExifData(blob);
          setMetadata({ width, height, exifData });
        };
      } catch (error) {
        console.error("Failed to fetch image metadata:", error);
        setMetadata(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [src]);

  return { metadata, loading };
};

// Helper function to extract EXIF data
const extractExifData = async (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const target = event.target;
      if (target && typeof target.result === 'string') { 
        EXIF.getData(target.result, function(this: any) {
          const allMetaData = EXIF.getAllTags(this);
          resolve(allMetaData);
        });
      } else {
        reject(new Error('Failed to read image data as string'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob); 
  });
};
