# React Image Toolkit

A lightweight React library for optimizing image loading through preloading, lazy loading, and caching capabilities.

## Features

- 🚀 **Image Preloading**: Load images in advance for instant display, especially useful when working with Electron.js
  since preloaded images will continue displaying even if the internet connection is lost.
- 🎯 **Lazy Loading**: Load images only when they enter the viewport
- 💾 **Image Caching**: Cache images for faster subsequent loads
- 📊 **Status Tracking**: Monitor image loading states
- 🎨 **TypeScript Support**: Full TypeScript support with type definitions
- 🪶 **Lightweight**: No external dependencies except React
- 🖼️ **Custom Configurations**: Supports cross-origin, referrer policies, and direct access to the HTMLImageElement for
  advanced use cases.

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

Preload multiple images and track their loading status. The `onSuccess` callback is executed only when there are uncached image URLs that need to be loaded. If all images are cached, the `onSuccess` callback does not run. This hook checks for browser caching before executing the `onSuccess` callback, ensuring it only runs when necessary. For example, if all images are cached, the `onSuccess` callback will not be executed, but if there are uncached images, the `onSuccess` callback will run after those images are loaded.

```tsx
import { useImagePreloader } from 'react-img-toolkit';

function Gallery() {
  const { imageUrls } = useImagePreloader({
    data: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg'
  ],
    onSuccess: () => console.log("All uncached images preloaded successfully"),
    onError: (error) => console.error("Failed to preload images:", error),
  });

  return (
    <div>
      <p>Loaded {imageUrls.length} images</p>
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

#### useImageFilters

The `useImageFilters` hook allows you to apply various filters to an image. It accepts an object with the following structure:

### Parameters

```typescript
interface FilterOptions {
  src: string; // Source image URL
  filter?: {
    blur?: number; // Blur effect in pixels (e.g., 5 for '5px'). Recommended range: 0 to 100.
    brightness?: number; // Brightness percentage (e.g., 100 for normal, 150 for brighter). Recommended range: 0 to 200.
    contrast?: number; // Contrast percentage (e.g., 100 for normal, 120 for increased contrast). Recommended range: 0 to 200.
    grayscale?: number; // Grayscale percentage (0 for no effect, 100 for full grayscale). Recommended range: 0 to 100.
    hueRotate?: number; // Hue rotation in degrees (e.g., 90 for 90 degrees). Recommended range: 0 to 360.
    invert?: number; // Inversion percentage (0 for no effect, 100 for full inversion). Recommended range: 0 to 100.
    opacity?: number; // Opacity percentage (0 for fully transparent, 100 for fully opaque). Recommended range: 0 to 100.
    saturate?: number; // Saturation percentage (100 for normal, 200 for double saturation). Recommended range: 0 to 300.
    sepia?: number; // Sepia percentage (0 for no effect, 100 for full sepia). Recommended range: 0 to 100.
  };
}
```

### Example Usage

```typescript
const { filteredImage, loading } = useImageFilters({
  src: "https://example.com/image.jpg",
  filter: {
    blur: 10,
    brightness: 150,
    contrast: 120,
    grayscale: 50,
    hueRotate: 90,
    invert: 20,
    opacity: 80,
    saturate: 200,
    sepia: 30,
  },
});
```

### Returns
- `filteredImage`: A Blob URL of the filtered image.
- `loading`: A boolean indicating if the filtering is in progress.

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
   data?: any; // Any data to extract URLs from
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

### useImageFilters Hook

```typescript
interface UseImageFiltersProps {
  src: string;
  filter?: {
    blur?: number; // Blur effect in pixels (e.g., 5 for '5px'). Recommended range: 0 to 100.
    brightness?: number; // Brightness percentage (e.g., 100 for normal, 150 for brighter). Recommended range: 0 to 200.
    contrast?: number; // Contrast percentage (e.g., 100 for normal, 120 for increased contrast). Recommended range: 0 to 200.
    grayscale?: number; // Grayscale percentage (0 for no effect, 100 for full grayscale). Recommended range: 0 to 100.
    hueRotate?: number; // Hue rotation in degrees (e.g., 90 for 90 degrees). Recommended range: 0 to 360.
    invert?: number; // Inversion percentage (0 for no effect, 100 for full inversion). Recommended range: 0 to 100.
    opacity?: number; // Opacity percentage (0 for fully transparent, 100 for fully opaque). Recommended range: 0 to 100.
    saturate?: number; // Saturation percentage (100 for normal, 200 for double saturation). Recommended range: 0 to 300.
    sepia?: number; // Sepia percentage (0 for no effect, 100 for full sepia). Recommended range: 0 to 100.
  };
}

interface UseImageFiltersResult {
  filteredImage: string | null;
  loading: boolean;
}

function useImageFilters({
  src,
  filter,
}: UseImageFiltersProps): UseImageFiltersResult;
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
