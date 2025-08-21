import React, { useEffect, useState } from "react";

type MediaType = 'image' | 'video';

export interface MediaPreloaderProps {
  /** Data containing media URLs */
  data: any;
  /** Callback when all media is preloaded */
  onSuccess?: () => void;
  /** Callback when preloading fails */
  onError?: (error: Error) => void;
  /** Media type or a function to determine media type from URL */
  mediaType?: MediaType | ((url: string) => MediaType);
  /** Render prop for loading/error states */
  children?: React.ReactNode | ((state: { loading: boolean; error: Error | null; count: number }) => React.ReactNode);
  /** Custom URL extractor function */
  extractUrls?: (data: any) => string[];
}

const defaultExtractUrls = (data: any): string[] => {
  if (!data) return [];
  
  // Handle string input
  if (typeof data === 'string') return [data];
  
  // Handle array of strings or objects with url property
  if (Array.isArray(data)) {
    return data.map(item => 
      typeof item === 'string' ? item : item?.url || ''
    ).filter(Boolean);
  }
  
  // Handle object with url property
  return data.url ? [data.url] : [];
};

const preloadMedia = (url: string, mediaType: MediaType): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (mediaType === 'video') {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.onloadeddata = () => resolve(url);
      video.onerror = () => reject(new Error(`Failed to load video: ${url}`));
      video.src = url;
    } else {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    }
  });
};

export const ImagePreloader: React.FC<MediaPreloaderProps> = ({
  data,
  onSuccess,
  onError,
  children,
  mediaType = 'image',
  extractUrls = defaultExtractUrls
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const urls = extractUrls(data);
    if (!urls.length) {
      setLoading(false);
      onSuccess?.();
      return;
    }

    setLoading(true);
    setError(null);
    setCount(0);

    const getMediaType = (url: string): MediaType => {
      if (typeof mediaType === 'function') {
        return mediaType(url);
      }
      return mediaType;
    };

    const preloadAll = async () => {
      try {
        await Promise.all(
          urls.map(url => 
            preloadMedia(url, getMediaType(url))
              .then(() => setCount(prev => prev + 1))
          )
        );
        onSuccess?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to preload media');
        setError(error);
        onError?.(error);
      } finally {
        setLoading(false);
      }
    };

    preloadAll();

    return () => {
      // Cleanup if needed
    };
  }, [data, mediaType, onSuccess, onError, extractUrls]);

  // If children is a function, pass the loading state and error
  if (typeof children === 'function') {
    return <>{children({ loading, error, count })}</>;
  }

  // Otherwise, just render children when not loading and no error
  if (loading || error) return null;
  
  return <>{children}</>;
};
