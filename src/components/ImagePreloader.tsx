import React from 'react';
import { useImagePreloader } from '../hooks/useImagePreloader';

interface ImagePreloaderProps {
  data: string[];
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({
  data,
  onSuccess,
  onError,
  children
}) => {
  useImagePreloader(data, { onSuccess, onError });
  return <>{children}</>;
};
