# React Image Toolkit

A lightweight React library for optimizing image loading through preloading, lazy loading, and caching capabilities.

## Features

- 🚀 **Image Preloading**: Load images in advance for instant display
- 🎯 **Lazy Loading**: Load images only when they enter the viewport
- 💾 **Image Caching**: Cache images for faster subsequent loads
- 📊 **Status Tracking**: Monitor image loading states
- 🎨 **TypeScript Support**: Full TypeScript support with type definitions
- 🪶 **Lightweight**: No external dependencies except React
- 🖼️ **Custom Configurations**: Supports cross-origin, referrer policies, and direct access to the HTMLImageElement for advanced use cases.

## Installation

```bash
npm install react-img-toolkit
```

## Usage

### Image Preloader Component
### data can be any structured, ImagePreloader will extract image URLs from it.

```tsx
import { ImagePreloader } from 'react-img-toolkit';

function Gallery() {
   const data = {
      images: [
         'https://example.com/image1.jpg',
         'https://example.com/image2.jpg',
      ],
      otherData: 'Hello World!',
   };

   return (
    <ImagePreloader
      data={data}
      onSuccess={() => console.log('All images loaded!')}
      onError={(error) => console.error('Failed to load:', error)}
    >
      {/* Your gallery content */}
    </ImagePreloader>
  );
}
```

### Hooks

#### useImagePreloader

Preload multiple images and track their loading status:

```tsx
import { useImagePreloader } from 'react-img-toolkit';

function Gallery() {
  const { imageUrls, count } = useImagePreloader({
    data: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg'
  ],
    onSuccess: () => console.log("All images preloaded successfully"),
    onError: (error) => console.error("Failed to preload images:", error),
  });

  return (
    <div>
      <p>Loaded {count} images</p>
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={`Image ${index + 1}`} />
      ))}
    </div>
  );
}
```

#### useLazyImage

Load images only when they enter the viewport:

```tsx
import { useLazyImage } from 'react-img-toolkit';

function LazyImage() {
  const { ref, isIntersecting, isLoaded } = useLazyImage({
    src: 'https://example.com/large-image.jpg',
    options: {
      threshold: 0.5,
      rootMargin: '200px',
    }
  });

  return (
    <div ref={ref}>
      {isLoaded && (
        <img src="https://example.com/large-image.jpg" alt="Lazy loaded" />
      )}
    </div>
  );
}
```

#### useImageCache

Cache images for faster subsequent loads:

```tsx
import { useImageCache } from 'react-img-toolkit';

function CachedImage() {
  const { cachedSrc, loading, isCached } = useImageCache({
    src: 'https://example.com/image.jpg',
  });

  if (loading) return <div>Loading...</div>;

  return <img src={cachedSrc} alt="Cached image" />;
}
```

#### useImageLoad

The `useImageLoad` hook is particularly useful when you need direct access to the DOM image element, such as when working with canvas or WebGL. It provides:

- Full control over image loading configuration
- Cross-origin resource sharing (CORS) settings
- Referrer policy configuration
- Direct access to the HTMLImageElement
- Loading state and error handling

Load images with custom configurations, particularly useful for canvas applications:

```tsx
import { useImageLoad } from 'react-img-toolkit';

function CanvasImage() {
  const { image, isLoading, error } = useImageLoad({
    url: 'https://example.com/image.jpg',
    crossOrigin: 'anonymous',
    referrerPolicy: 'no-referrer'
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <canvas 
        ref={canvasRef => {
          if (canvasRef && image) {
            const ctx = canvasRef.getContext('2d');
            if (ctx) {
              canvasRef.width = image.width;
              canvasRef.height = image.height;
              ctx.drawImage(image, 0, 0);
            }
          }
        }}
      />
    </div>
  );
}
```

#### useImageStatus

Track the loading status of an image:

```tsx
import { useImageStatus } from 'react-img-toolkit';

function ImageWithStatus() {
  const status = useImageStatus({ src: 'https://example.com/image.jpg' });
  return (
    <div>
      <p>Status: {status}</p>
      {status === 'loaded' && <img src="https://example.com/image.jpg" alt="Loaded" />}
    </div>
  );
}
```

## API Reference

### ImagePreloader Component

| Prop      | Type                   | Description                         |
|-----------|------------------------|-------------------------------------|
| data      | any                    | Any structured data.                |
| onSuccess | () => void             | Callback when all images are loaded |
| onError   | (error: Error) => void | Callback when an error occurs       |
| children  | ReactNode              | Content to render                   |

### useImagePreloader Hook

```typescript

interface ImagePreloaderProps {
   data?: Record<string, any>; // Generic object to extract URLs from
   onSuccess?: () => void; // Callback on successful preload
   onError?: (error: Error) => void; // Callback on preload error
   children: React.ReactNode; // Child components to render
}

interface ImagePreloaderState {
  imageUrls: string[];
  count: number;
}

function useImagePreloader({
    data = {},
    onSuccess,
    onError,
    }: UseImagePreloaderProps = {}): ImagePreloaderState;
```

### useLazyImage Hook

```typescript
interface UseLazyImageProps {
  src: string;
  options?: {
    threshold?: number;
    rootMargin?: string;
  };
}

interface UseLazyImageResult {
  ref: RefObject<HTMLElement>;
  isIntersecting: boolean;
  isLoaded: boolean;
}

function useLazyImage({
  src,
  options,
}: UseLazyImageProps): UseLazyImageResult;
```

### useImageCache Hook

```typescript
interface UseImageCacheProps {
  src: string;
}

interface UseImageCacheResult {
  cachedSrc: string | null;
  loading: boolean;
  isCached: boolean;
}
function useImageCache({ src }: UseImageCacheProps): UseImageCacheResult;
```
### useImageLoad Hook

```typescript
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

function useImageLoad(
{
  url,
  crossOrigin,
  referrerPolicy
}: UseImageLoadProps
): UseImageLoadResult;
```

### useImageStatus Hook

```typescript
interface UseImageStatusProps {
  src: string;
}

interface UseImageStatusResult {
  status: 'idle' | 'loading' | 'loaded' | 'error';
}

function useImageStatus(
  { src }: UseImageStatusProps
): UseImageStatusResult;
```

## Development

1. Clone the repository:
   ```bash
   git clone https://github.com/IxtiyorDeveloper/react-img-toolkit.git
   cd react-img-toolkit
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 
