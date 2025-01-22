import { useState, useEffect, useRef } from "react";

interface UseLazyImageOptions {
  threshold?: number;
  rootMargin?: string;
}

export interface ILazyImageProps {
  src: string;
  options: UseLazyImageOptions;
}

export const useLazyImage = ({ src, options = {} }: ILazyImageProps) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || "0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin]);

  useEffect(() => {
    if (!isIntersecting || isLoaded) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setIsLoaded(true);
    };

    return () => {
      img.onload = null;
    };
  }, [isIntersecting, isLoaded, src]);

  return { isIntersecting, isLoaded, ref };
};
