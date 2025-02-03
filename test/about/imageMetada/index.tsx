import React, { useState } from "react";
import useImageMeta from "../../../src/hooks/useImageMetadata";

const ImageUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { metadata, error } = useImageMeta(file);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {metadata && (
        <div>
          <h3>Image Metadata</h3>
          <p>
            <strong>Name:</strong> {metadata.name}
          </p>
          <p>
            <strong>Type:</strong> {metadata.type}
          </p>
          <p>
            <strong>Size:</strong> {metadata.size} bytes
          </p>
          <p>
            <strong>Width:</strong> {metadata.width}px
          </p>
          <p>
            <strong>Height:</strong> {metadata.height}px
          </p>
          {metadata.exif && (
            <>
              <h4>EXIF Data</h4>
              <p>
                <strong>Date Time:</strong> {metadata.exif.dateTime}
              </p>
              <p>
                <strong>GPS Latitude:</strong> {metadata.exif.gpsLatitude}
              </p>
              <p>
                <strong>GPS Longitude:</strong> {metadata.exif.gpsLongitude}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
