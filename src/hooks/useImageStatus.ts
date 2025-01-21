import { useState, useEffect } from 'react';

type ImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

export const useImageStatus = (src: string): ImageStatus => {
  const [status, setStatus] = useState<ImageStatus>('idle');

  useEffect(() => {
    if (!src) {
      setStatus('idle');
      return;
    }

    setStatus('loading');
    const img = new Image();

    img.onload = () => {
      setStatus('loaded');
    };

    img.onerror = () => {
      setStatus('error');
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return status;
};
