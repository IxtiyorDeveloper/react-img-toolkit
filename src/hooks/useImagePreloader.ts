import { useState, useEffect } from 'react';

type MediaType = 'image' | 'video';

interface UseMediaPreloaderOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  mediaType?: MediaType | ((url: string) => MediaType);
}

interface UseMediaPreloaderResult {
  urls: string[];
  count: number;
  loaded: boolean;
  error: Error | null;
}

export const useImagePreloader = (
  urls: string[], 
  options: UseMediaPreloaderOptions = {}
): UseMediaPreloaderResult => {
  const [urlsState, setUrlsState] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getMediaType = (url: string): MediaType => {
    if (typeof options.mediaType === 'function') {
      return options.mediaType(url);
    }
    return options.mediaType || 'image';
  };

  const preloadMedia = (url: string): Promise<string> => {
    const mediaType = getMediaType(url);
    
    if (mediaType === 'video') {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.onloadeddata = () => resolve(url);
        video.onerror = () => reject(new Error(`Failed to load video: ${url}`));
        video.src = url;
      });
    }
    
    // Default to image preloading
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  };

  useEffect(() => {
    if (!urls.length) return;

    setLoaded(false);
    setError(null);

    const mediaPromises = urls.map(url => preloadMedia(url));

    Promise.all(mediaPromises)
      .then(loadedUrls => {
        setUrlsState(loadedUrls);
        setCount(loadedUrls.length);
        setLoaded(true);
        options.onSuccess?.();
      })
      .catch(err => {
        setError(err);
        options.onError?.(err);
      });

    return () => {
      setUrlsState([]);
      setCount(0);
      setLoaded(false);
      setError(null);
    };
  }, [urls, options]);

  return { 
    urls: urlsState, 
    count, 
    loaded, 
    error 
  };
};
