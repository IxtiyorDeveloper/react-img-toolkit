import { useState, useEffect } from 'react';

interface UseImagePreloaderOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useImagePreloader = (urls: string[], options: UseImagePreloaderOptions = {}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!urls.length) return;

    const images = urls.map(url => {
      const img = new Image();
      return new Promise<string>((resolve, reject) => {
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    });

    Promise.all(images)
      .then(loadedUrls => {
        setImageUrls(loadedUrls);
        setCount(loadedUrls.length);
        options.onSuccess?.();
      })
      .catch(error => {
        options.onError?.(error);
      });

    return () => {
      setImageUrls([]);
      setCount(0);
    };
  }, [urls, options.onSuccess, options.onError]);

  return { imageUrls, count };
};
