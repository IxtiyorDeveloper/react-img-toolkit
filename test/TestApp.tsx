import React from "react";
import {
  useImagePreloader,
  useImageStatus,
  useLazyImage,
  useImageCache,
  useImageLoad,
  ImagePreloader,
} from "../src";

const testImages = [
  "https://picsum.photos/seed/1/800/600",
  "https://picsum.photos/seed/2/800/600",
  "https://picsum.photos/seed/3/800/600",
  "https://picsum.photos/seed/4/800/600",
  "https://picsum.photos/seed/5/800/600",
];

const testData = {
  gallery: {
    featured: "https://picsum.photos/seed/6/800/600",
    thumbnails: [
      "https://picsum.photos/seed/7/800/600",
      "https://picsum.photos/seed/8/800/600",
    ],
  },
  profile: {
    avatar: "https://picsum.photos/seed/9/800/600",
  },
};

export const TestApp: React.FC = () => {
  // Test useImagePreloader with both URLs and data
  const { imageUrls, count } = useImagePreloader({
    urls: testImages.slice(0, 2),
    data: testData,
    onSuccess: () => console.log("All images preloaded successfully"),
    onError: (error) => console.error("Failed to preload images:", error),
  });

  // Test useImageStatus for a single image
  const imageStatus = useImageStatus(testImages[0]);

  // Test useLazyImage
  const { isIntersecting, isLoaded, ref } = useLazyImage(testImages[1], {
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Test useImageCache
  const {
    cachedSrc,
    loading: cacheLoading,
    isCached,
  } = useImageCache(testImages[2]);

  // Test useImageLoad
  const {
    image,
    isLoading: imageLoading,
    error,
  } = useImageLoad({
    url: testImages[3],
    crossOrigin: "anonymous",
    referrerPolicy: "no-referrer",
  });

  return (
    <div className="container">
      <h1>React Image Preloader Test Suite</h1>

      {/* ImagePreloader Test */}
      <section className="section">
        <h2>ImagePreloader Test (URLs + Data)</h2>
        <ImagePreloader
          urls={testImages.slice(0, 2)} // URLs to preload
          data={testData} // Data to extract image URLs from
          onSuccess={() => console.log("All")}
          onError={(error) => console.error("Failed to preload images:", error)}
        >
          <div className="debug-info">
            <p>Total Images Preloaded: 5</p>{" "}
            {/* Assume all images have been preloaded */}
            <pre style={{ fontSize: "0.8em" }}>
              {JSON.stringify({ totalImages: 5 }, null, 2)}
            </pre>
          </div>
          <div className="image-grid">
            {testImages.map((url, index) => (
              <div key={index} className="image-container">
                <img src={url} alt={`Preloaded ${index + 1}`} />
              </div>
            ))}
          </div>
        </ImagePreloader>
      </section>

      {/* useImagePreloader Test */}
      <section className="section">
        <h2>useImagePreloader Test (URLs + Data)</h2>
        <div className="debug-info">
          <p>Total Images Preloaded: {count}</p>
          <pre style={{ fontSize: "0.8em" }}>
            {JSON.stringify(
              {
                totalImages: count,
              },
              null,
              2,
            )}
          </pre>
        </div>
        <div className="image-grid">
          {imageUrls.map((url, index) => (
            <div key={index} className="image-container">
              <img src={url} alt={`Preloaded ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* useImageStatus Test */}
      <section className="section">
        <h2>useImageStatus Test</h2>
        <div className="debug-info">
          <p>
            Status:{" "}
            <span className={`status ${imageStatus}`}>{imageStatus}</span>
          </p>
        </div>
        <div className="image-container">
          {imageStatus === "loaded" && (
            <img src={testImages[0]} alt="Status test" />
          )}
        </div>
      </section>

      {/* useLazyImage Test */}
      <section className="section">
        <h2>useLazyImage Test</h2>
        <div className="debug-info">
          <p>
            <span
              className={`status ${isIntersecting ? "success" : "pending"}`}
            >
              {isIntersecting ? "In viewport ✓" : "Not in viewport"}
            </span>
            <span className={`status ${isLoaded ? "success" : "pending"}`}>
              {isLoaded ? "Loaded ✓" : "Not loaded"}
            </span>
          </p>
        </div>
        <div ref={ref} className="image-container">
          {!isIntersecting && (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Scroll down to load this image
            </div>
          )}
          <p>Lazy image</p>
          {isLoaded && <img src={testImages[1]} alt="Lazy loaded" />}
        </div>
      </section>

      {/* useImageCache Test */}
      <section className="section">
        <h2>useImageCache Test</h2>
        <div className="debug-info">
          <p>
            <span className={`status ${cacheLoading ? "pending" : "success"}`}>
              {cacheLoading ? "Loading..." : "Ready"}
            </span>
            <span className={`status ${isCached ? "success" : "pending"}`}>
              {isCached ? "Cached ✓" : "Not cached"}
            </span>
          </p>
          <pre style={{ fontSize: "0.8em" }}>
            {JSON.stringify(
              { cacheLoading, isCached, hasCachedSrc: !!cachedSrc },
              null,
              2,
            )}
          </pre>
        </div>
        <div className="image-container">
          {!cacheLoading && cachedSrc && <img src={cachedSrc} alt="Cached" />}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reload page to test cache
        </button>
      </section>

      {/* useImageLoad Test */}
      <section className="section">
        <h2>useImageLoad Test (Canvas)</h2>
        <div className="debug-info">
          <p>
            Status:
            <span className={`status ${imageLoading ? "pending" : "success"}`}>
              {imageLoading ? "Loading..." : "Ready"}
            </span>
            {error && (
              <span className="status error">Error: {error.message}</span>
            )}
          </p>
        </div>
        <div className="image-container">
          {image && (
            <div>
              <p>Image loaded and rendered to canvas:</p>
              <canvas
                ref={(canvasRef) => {
                  if (canvasRef && image) {
                    const ctx = canvasRef.getContext("2d");
                    if (ctx) {
                      canvasRef.width = image.width;
                      canvasRef.height = image.height;
                      ctx.drawImage(image, 0, 0);
                    }
                  }
                }}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
