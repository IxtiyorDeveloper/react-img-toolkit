# React Image Toolkit

A lightweight React library for optimizing image loading through preloading, lazy loading, and caching capabilities.

## Features

- 🚀 **Image Preloading**: Load images in advance for instant display
- 🎯 **Lazy Loading**: Load images only when they enter the viewport
- 💾 **Image Caching**: Cache images for faster subsequent loads
- 📊 **Status Tracking**: Monitor image loading states
- 🎨 **TypeScript Support**: Full TypeScript support with type definitions
- 🪶 **Lightweight**: No external dependencies except React

## Installation

```bash
npm install react-img-toolkit
```

## Usage

### Image Preloader Component

```tsx
import { ImagePreloader } from 'react-img-toolkit';

function Gallery() {
  const images = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg'
  ];

  return (
    <ImagePreloader
      urls={images}
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
  const { imageUrls, count } = useImagePreloader([
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg'
  ]);

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
  const { ref, isIntersecting, isLoaded } = useLazyImage(
    'https://example.com/large-image.jpg',
    {
      threshold: 0.1,
      rootMargin: '50px'
    }
  );

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
  const { cachedSrc, loading, isCached } = useImageCache(
    'https://example.com/image.jpg'
  );

  if (loading) return <div>Loading...</div>;

  return <img src={cachedSrc} alt="Cached image" />;
}
```

#### useImageStatus

Track the loading status of an image:

```tsx
import { useImageStatus } from 'react-img-toolkit';

function ImageWithStatus() {
  const status = useImageStatus('https://example.com/image.jpg');

  return (
    <div>
      <p>Status: {status}</p>
      {status === 'loaded' && (
        <img src="https://example.com/image.jpg" alt="Status tracked" />
      )}
    </div>
  );
}
```

## API Reference

### ImagePreloader Component

| Prop | Type | Description |
|------|------|-------------|
| urls | string[] | Array of image URLs to preload |
| onSuccess | () => void | Callback when all images are loaded |
| onError | (error: Error) => void | Callback when an error occurs |
| children | ReactNode | Content to render |

### useImagePreloader Hook

```typescript
function useImagePreloader(
  urls: string[],
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
): {
  imageUrls: string[];
  count: number;
};
```

### useLazyImage Hook

```typescript
function useLazyImage(
  src: string,
  options?: {
    threshold?: number;
    rootMargin?: string;
  }
): {
  ref: RefObject<HTMLElement>;
  isIntersecting: boolean;
  isLoaded: boolean;
};
```

### useImageCache Hook

```typescript
function useImageCache(
  src: string
): {
  cachedSrc: string | null;
  loading: boolean;
  isCached: boolean;
};
```

### useImageStatus Hook

```typescript
function useImageStatus(
  src: string
): 'idle' | 'loading' | 'loaded' | 'error';
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
