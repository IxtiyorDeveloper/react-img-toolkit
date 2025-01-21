import React from 'react';
import { 
  useImagePreloader,
  useImageStatus,
  useLazyImage,
  useImageCache
} from '../src';

const testImages = [
  'https://picsum.photos/200/300',
  'https://picsum.photos/300/400',
  'https://picsum.photos/400/500'
];

export const TestComponent: React.FC = () => {
  // Test useImagePreloader
  const { imageUrls, count } = useImagePreloader(testImages, {
    onSuccess: () => console.log('All images preloaded!'),
    onError: (error) => console.error('Preload error:', error)
  });

  // Test useImageStatus
  const status = useImageStatus(testImages[0]);

  // Test useLazyImage
  const { isIntersecting, isLoaded } = useLazyImage(testImages[1], {
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Test useImageCache
  const { cachedSrc, loading, isCached } = useImageCache(testImages[2]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Image Preloader Test</h1>
      
      <div className="mb-6">
        <h2 className="text-xl mb-2">useImagePreloader Test</h2>
        <p>Found {count} images</p>
        <div className="flex gap-2">
          {imageUrls.map((url, index) => (
            <img 
              key={index} 
              src={url} 
              alt={`Test ${index}`} 
              className="w-20 h-20 object-cover"
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl mb-2">useImageStatus Test</h2>
        <p>Status: {status}</p>
        {status === 'loaded' && (
          <img 
            src={testImages[0]} 
            alt="Status test" 
            className="w-32 h-32 object-cover"
          />
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl mb-2">useLazyImage Test</h2>
        <p>Is intersecting: {isIntersecting ? 'Yes' : 'No'}</p>
        <p>Is loaded: {isLoaded ? 'Yes' : 'No'}</p>
        {isLoaded && (
          <img 
            src={testImages[1]} 
            alt="Lazy test" 
            className="w-32 h-32 object-cover"
          />
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl mb-2">useImageCache Test</h2>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Cached: {isCached ? 'Yes' : 'No'}</p>
        {!loading && (
          <img 
            src={cachedSrc || testImages[2]} 
            alt="Cache test" 
            className="w-32 h-32 object-cover"
          />
        )}
      </div>
    </div>
  );
};
