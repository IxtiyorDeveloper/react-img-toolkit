import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useImageOptimizer } from "../../src/hooks/useImageOptimizer";
import ImageConverter from "./imageConverter";
import ImageUploader from "./imageMetada";

const About = () => {
  const [optimizedUrl, setOptimizedUrl] = useState<string>("");
  const imageUrl = "https://picsum.photos/seed/1/800/600"; // Replace with a valid image URL

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
      format: "image/webp",
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
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </div>
      <h1>About</h1>
      {/*<img src={filteredImage || imageUrl} alt="filteredImage" />*/}
      {/*<p>Image Metadata: {JSON.stringify(metadata)}</p>*/}
      <section>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {loading && <p>Optimizing...</p>}
        {error && <p>Error: {error}</p>}
        {optimizedUrl && <img src={optimizedUrl} alt="optimizedImage" />}
      </section>
      <ImageConverter />
      <ImageUploader />
    </div>
  );
};

export default About;
