import React from "react";
import { Link } from "react-router-dom";
import { useImageOptimization } from "../../src/hooks/useImageOptimization";
import { useImageMetadata } from "../../src/hooks/useImageMetadata";
import { useImageFilters } from "../../src/hooks/useImageFilters";

const About = () => {
  const imageUrl = "https://picsum.photos/seed/1/800/600"; // Replace with a valid image URL
  const { optimizedImage, loading: loadingOptimization } = useImageOptimization(
    imageUrl,
    { quality: 1 },
  );
  const { optimizedImage: om, loading: zxc } = useImageOptimization(imageUrl, {
    quality: 1,
  });
  const { metadata, loading: loadingMetadata } = useImageMetadata(imageUrl);

  const { filteredImage, loading: loadingFilters } = useImageFilters({
    src: imageUrl,
    filter: {
      blur: 10,
      brightness: 150,
      contrast: 120,
      grayscale: 50,
      hueRotate: 90,
      invert: 20,
      opacity: 80,
      saturate: 200,
      sepia: 30,
    },
  });

  return (
    <div>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </div>
      <h1>About</h1>
      <img src={optimizedImage || imageUrl} alt="Optimized" />
      <img src={filteredImage || imageUrl} alt="filteredImage" />
      <p>Image Metadata: {JSON.stringify(metadata)}</p>
    </div>
  );
};

export default About;
