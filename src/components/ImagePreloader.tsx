import React, { useEffect, useState } from 'react';
import { useImagePreloader } from "../hooks/useImagePreloader";

interface ImagePreloaderProps {
  data?: any; // Generic object to extract URLs from
  onSuccess?: () => void; // Callback on successful preload
  onError?: (error: Error) => void; // Callback on preload error
  children: React.ReactNode; // Child components to render
  crossOrigin?: HTMLImageElement['crossOrigin'];
  referrerPolicy?: HTMLImageElement['referrerPolicy'];
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({
  data = {},
  onSuccess,
  onError,
  children,
  crossOrigin = 'anonymous',
  referrerPolicy = 'no-referrer'
}) => {
  const { imageUrls } = useImagePreloader({ 
    onError, 
    onSuccess, 
    data,
    crossOrigin,
    referrerPolicy
  });

  // Create a hidden container for Safari preloading
  const [preloadContainer, setPreloadContainer] = useState<HTMLDivElement | null>(null);

  // Add Safari-specific preloading
  useEffect(() => {
    if (!preloadContainer) {
      const container = document.createElement('div');
      container.style.display = 'none';
      document.body.appendChild(container);
      setPreloadContainer(container);
    }

    if (onError && navigator.userAgent.includes('Safari')) {
      const checkImages = async () => {
        for (const url of imageUrls) {
          try {
            // First try with fetch
            const response = await fetch(url, {
              mode: 'cors',
              credentials: 'same-origin',
              headers: {
                'Accept': 'image/webp,image/*,*/*;q=0.8'
              }
            });
            
            if (!response.ok) {
              throw new Error(`Failed to fetch image: ${url}`);
            }

            // Create image element
            const img = new Image();
            img.crossOrigin = crossOrigin;
            img.referrerPolicy = referrerPolicy;
            
            // Add to container
            if (preloadContainer) {
              preloadContainer.appendChild(img);
            }
            
            // Wait for image to load
            await new Promise((resolve, reject) => {
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error(`Image failed to load: ${url}`));
              img.src = url;
            });
            
            // Remove from container
            img.remove();
          } catch (error) {
            onError(error as Error);
          }
        }
      };
      checkImages();
    }
  }, [imageUrls, onError, crossOrigin, referrerPolicy, preloadContainer]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (preloadContainer) {
        preloadContainer.remove();
      }
    };
  }, [preloadContainer]);

  return <>{children}</>;
};
