import React from "react";
import { useImagePreloader } from "../hooks/useImagePreloader";

interface ImagePreloaderProps {
  data?: any; // Generic object to extract URLs from
  onSuccess?: () => void; // Callback on successful preload
  onError?: (error: Error) => void; // Callback on preload error
  children: React.ReactNode; // Child components to render
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({
  data = {},
  onSuccess,
  onError,
  children,
}) => {
  const { imageUrls } = useImagePreloader({ onError, onSuccess, data });
  return <>{children}</>;
};
