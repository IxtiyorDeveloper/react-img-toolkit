import { useState, useEffect } from 'react';

interface UseImageLoadProps {
  url: string;
  crossOrigin?: HTMLImageElement['crossOrigin'];
  referrerPolicy?: HTMLImageElement['referrerPolicy'];
}

interface UseImageLoadResult {
  image: HTMLImageElement | null;
  isLoading: boolean;
  error: Error | null;
}

export const useImageLoad = ({
  url,
  crossOrigin,
  referrerPolicy
}: UseImageLoadProps): UseImageLoadResult => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const img = new Image();

    const handleLoad = () => {
      setImage(img);
      setIsLoading(false);
      setError(null);
    };

    const handleError = () => {
      setImage(null);
      setIsLoading(false);
      setError(new Error(`Failed to load image from ${url}`));
    };

    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }
    
    if (referrerPolicy) {
      img.referrerPolicy = referrerPolicy;
    }

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = url;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [url, crossOrigin, referrerPolicy]);

  return { image, isLoading, error };
};
