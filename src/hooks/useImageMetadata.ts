import { useState, useEffect } from "react";

interface ExifData {
  raw?: string;
  dateTime?: string;
  gpsLatitude?: string;
  gpsLongitude?: string;
}

interface ImageMetadata {
  width: number;
  height: number;
  type: string;
  size: number;
  name: string;
  exif: ExifData;
}

const parseExif = (arrayBuffer: ArrayBuffer, fileType: string): ExifData => {
  const dataView = new DataView(arrayBuffer);
  const exifData: ExifData = {};

  if (fileType === "image/jpeg" || fileType === "image/tiff") {
    let offset = 2;
    while (offset < dataView.byteLength) {
      if (dataView.getUint16(offset, false) === 0xffe1) {
        const exifLength = dataView.getUint16(offset + 2, false);
        const exifBuffer = new Uint8Array(
          arrayBuffer,
          offset + 4,
          exifLength - 2,
        );
        const exifString = new TextDecoder().decode(exifBuffer);
        exifData.raw = exifString;
        exifData.dateTime =
          exifString.match(/DateTimeOriginal\s*:\s*(\S+)/)?.[1] || "Unknown";
        exifData.gpsLatitude =
          exifString.match(/GPSLatitude\s*:\s*(\S+)/)?.[1] || "Unknown";
        exifData.gpsLongitude =
          exifString.match(/GPSLongitude\s*:\s*(\S+)/)?.[1] || "Unknown";
        break;
      }
      offset += 2;
    }
  }
  return exifData;
};

const useImageMeta = (file: File | null) => {
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const exifData = parseExif(arrayBuffer, file.type);

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        setMetadata({
          width: img.width,
          height: img.height,
          type: file.type,
          size: file.size,
          name: file.name,
          exif: exifData,
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
