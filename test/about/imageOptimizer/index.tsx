import React, { useState } from "react";
import { useImageOptimizer } from "../../../src/hooks/useImageOptimizer";

const ImageOptimizer = () => {
  const [optimizedUrl, setOptimizedUrl] = useState<string>("");

  const { optimizeImage, loading, error } = useImageOptimizer();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) return;
    const file = event.target.files[0];

    const optimizedBlob = await optimizeImage(file, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 1,
      format: "image/jpeg",
      rotate: 0,
      flipHorizontal: true,
      keepTransparency: false,
    });

    if (optimizedBlob) {
      const url = URL.createObjectURL(optimizedBlob);
      setOptimizedUrl(url);
      console.log("Optimized Image URL:", url);
    }
  };
  return (
    <div>
      <section>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {loading && <p>Optimizing...</p>}
        {error && <p>Error: {error}</p>}
        {optimizedUrl && <img src={optimizedUrl} alt="optimizedImage" />}
      </section>
    </div>
  );
};

export default ImageOptimizer;
