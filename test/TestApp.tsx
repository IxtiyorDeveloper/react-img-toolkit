import React from 'react';
import { useImagePreloader, useImageStatus, useLazyImage, useImageCache } from '../src';

const testImages = [
  'https://picsum.photos/seed/1/800/600',
  'https://picsum.photos/seed/2/800/600',
  'https://picsum.photos/seed/3/800/600',
  'https://picsum.photos/seed/4/800/600',
  'https://picsum.photos/seed/5/800/600',
];

export const TestApp: React.FC = () => {
  // Test useImagePreloader
  const { imageUrls, count } = useImagePreloader(testImages);

  // Test useImageStatus for a single image
  const imageStatus = useImageStatus(testImages[0]);

  // Test useLazyImage
  const { isIntersecting, isLoaded, ref } = useLazyImage(testImages[1], {
    threshold: 0.1,
    rootMargin: '100px',
  });

  // Test useImageCache
  const { cachedSrc, loading: cacheLoading, isCached } = useImageCache(testImages[2]);

  return (
    <div className="container">
      <h1>React Image Preloader Test Suite</h1>

      {/* useImagePreloader Test */}
      <section className="section">
        <h2>useImagePreloader Test</h2>
        <div className="debug-info">
          <p>Images found: {count}</p>
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
          <p>Status: <span className={`status ${imageStatus}`}>{imageStatus}</span></p>
        </div>
        <div className="image-container">
          {imageStatus === 'loaded' && (
            <img src={testImages[0]} alt="Status test" />
          )}
        </div>
      </section>

      {/* useLazyImage Test */}
      <section className="section">
        <h2>useLazyImage Test</h2>
        <div className="debug-info">
          <p>
            <span className={`status ${isIntersecting ? 'success' : 'pending'}`}>
              {isIntersecting ? 'In viewport ✓' : 'Not in viewport'}
            </span>
            <span className={`status ${isLoaded ? 'success' : 'pending'}`}>
              {isLoaded ? 'Loaded ✓' : 'Not loaded'}
            </span>
          </p>
        </div>
        <div ref={ref} className="image-container">
          {!isIntersecting && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              Scroll down to load this image
            </div>
          )}
          <p>
            Lazy image
          </p>
          {isLoaded && (
            <img src={testImages[1]} alt="Lazy loaded" />
          )}
        </div>
      </section>

      {/* useImageCache Test */}
      <section className="section">
        <h2>useImageCache Test</h2>
        <div className="debug-info">
          <p>
            <span className={`status ${cacheLoading ? 'pending' : 'success'}`}>
              {cacheLoading ? 'Loading...' : 'Ready'}
            </span>
            <span className={`status ${isCached ? 'success' : 'pending'}`}>
              {isCached ? 'Cached ✓' : 'Not cached'}
            </span>
          </p>
          <pre style={{ fontSize: '0.8em' }}>
            {JSON.stringify({ cacheLoading, isCached, hasCachedSrc: !!cachedSrc }, null, 2)}
          </pre>
        </div>
        <div className="image-container">
          {cacheLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
          ) : (
            <img 
              src={cachedSrc} 
              alt="Cached"
            />
          )}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload page to test cache
        </button>
      </section>
    </div>
  );
};
