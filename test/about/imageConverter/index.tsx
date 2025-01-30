import React, { useState } from "react";
import { useImageConverter } from "../../../src/hooks/useImageConverter";

function ImageConverter() {
  const { convertImage, loading, error } = useImageConverter();
  const [outputFormat, setOutputFormat] = useState<
    "image/jpeg" | "image/png" | "image/webp" | "image/gif"
  >("image/webp");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) return;
    const file = event.target.files[0];

    const convertedBlob = await convertImage(file, {
      format: outputFormat,
      quality: 0.8, // Adjust quality for lossy formats
      keepTransparency: outputFormat !== "image/jpeg", // Keep transparency for non-JPEG formats
    });

    if (convertedBlob) {
      const url = URL.createObjectURL(convertedBlob);
      setDownloadUrl(url);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      <select
        value={outputFormat}
        onChange={(e) => setOutputFormat(e.target.value as any)}
      >
        <option value="image/jpeg">JPEG</option>
        <option value="image/png">PNG</option>
        <option value="image/webp">WebP</option>
        <option value="image/gif">GIF</option>
      </select>

      {loading && <p>Converting...</p>}
      {error && <p>Error: {error}</p>}

      {downloadUrl && (
        <a
          href={downloadUrl}
          download={`converted-image.${outputFormat.split("/")[1]}`}
          style={{
            display: "inline-block",
            marginTop: "10px",
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Download Image
        </a>
      )}
    </div>
  );
}

export default ImageConverter;
