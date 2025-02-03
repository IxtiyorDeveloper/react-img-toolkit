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

#### useImageOptimizer

The `useImageOptimizer` hook is designed to optimize images by resizing, adjusting quality, and applying transformations such as rotation and flipping. It manages loading states and errors during the optimization process.

### Key Features

1. **Image Resizing**:
   - Allows you to specify maximum width and height, ensuring that images do not exceed these dimensions.

2. **Quality Control**:
   - Supports adjustable quality settings for JPEG and WebP formats (from 0 to 1).

3. **Format Handling**:
   - Detects the MIME type of the image if not specified, supporting formats like JPEG, PNG, WebP, and GIF.

4. **Transformations**:
   - Provides options to rotate the image and flip it horizontally or vertically.

5. **Transparency Management**:
   - Option to keep transparency for PNG and WebP formats, or remove it for JPEG and WebP if specified.

6. **Asynchronous Processing**:
   - Utilizes a `FileReader` to load images and a `canvas` element for the optimization process, ensuring efficient handling of image data.

7. **Error Management**:
   - Provides error handling to capture and report issues during the optimization process.

### Usage Example

Here’s a simple example of how to use `useImageOptimizer`:

```tsx
import { useImageOptimizer } from 'react-img-toolkit';

function ImageOptimizerComponent() {
  const { optimizeImage, loading, error } = useImageOptimizer();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const options = { maxWidth: 800, maxHeight: 600, quality: 0.8, rotate: 90 };
      const optimizedBlob = await optimizeImage(file, options);
      // Handle the optimized image blob (e.g., display it, upload it, etc.)
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## useImageConverter

The `useImageConverter` hook provides a way to convert images between different formats while managing loading states and errors. It supports various options for customization during the conversion process.

### Key Features

1. **Format Support**: 
   - Converts images to the following formats: JPEG, PNG, WebP, and GIF.

2. **Quality Control**:
   - Allows for adjustable quality settings for JPEG and WebP formats (from 0 to 1).

3. **Transparency Handling**:
   - Option to keep transparency for PNG and WebP formats.
   - Removes transparency for JPEG and WebP if specified.

4. **Asynchronous Processing**:
   - Utilizes a `FileReader` to load images and a `canvas` element for the conversion process, ensuring efficient handling of image data.

5. **Error Management**:
   - Provides error handling to capture and report issues during the conversion process.

### Usage Example

Here’s a simple example of how to use `useImageConverter`:

```tsx
import { useImageConverter } from 'react-img-toolkit';

function ImageConverterComponent() {
  const { convertImage, loading, error } = useImageConverter();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const options = { format: 'image/webp', quality: 0.8, keepTransparency: true };
      const convertedBlob = await convertImage(file, options);
      // Handle the converted image blob (e.g., display it, upload it, etc.)
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### useImageOptimizer

The `useImageOptimizer` hook is designed to optimize images by resizing, adjusting quality, and applying transformations such as rotation and flipping. It manages loading states and errors during the optimization process.

### Key Features

1. **Image Resizing**:
   - Allows you to specify maximum width and height, ensuring that images do not exceed these dimensions.

2. **Quality Control**:
   - Supports adjustable quality settings for JPEG and WebP formats (from 0 to 1).

3. **Format Handling**:
   - Detects the MIME type of the image if not specified, supporting formats like JPEG, PNG, WebP, and GIF.

4. **Transformations**:
   - Provides options to rotate the image and flip it horizontally or vertically.

5. **Transparency Management**:
   - Option to keep transparency for PNG and WebP formats, or remove it for JPEG and WebP if specified.

6. **Asynchronous Processing**:
   - Utilizes a `FileReader` to load images and a `canvas` element for the optimization process, ensuring efficient handling of image data.

7. **Error Management**:
   - Provides error handling to capture and report issues during the optimization process.

### Usage Example

Here’s a simple example of how to use `useImageOptimizer`:

```tsx
import { useImageOptimizer } from 'react-img-toolkit';

function ImageOptimizerComponent() {
  const { optimizeImage, loading, error } = useImageOptimizer();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const options = { maxWidth: 800, maxHeight: 600, quality: 0.8, rotate: 90 };
      const optimizedBlob = await optimizeImage(file, options);
      // Handle the optimized image blob (e.g., display it, upload it, etc.)
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## useImageMeta

The `useImageMeta` hook extracts metadata from an image file, providing information such as dimensions, type, size, and name.

**Key Features**:
1. **Metadata Extraction**: Retrieves width, height, type, size, and name of the image.
2. **Error Handling**: Captures errors during file reading and image loading.
3. **State Management**: Uses React's state to manage metadata and error states.

**Usage Example**:
```tsx
import { useImageMeta } from 'react-img-toolkit';

function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const { metadata, error } = useImageMeta(file);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {error && <p>Error: {error}</p>}
      {metadata && (
        <div>
          <p>Name: {metadata.name}</p>
          <p>Type: {metadata.type}</p>
          <p>Size: {metadata.size} bytes</p>
          <p>Dimensions: {metadata.width} x {metadata.height}</p>
        </div>
      )}
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

### useImageConverter Hook

```typescript
interface UseImageConverterProps {
  src: string;
  format: string;
}

interface UseImageConverterResult {
  convert: string | null;
  status: 'idle' | 'loading' | 'loaded' | 'error';
}

function useImageConverter(
  { src, format }: UseImageConverterProps
): UseImageConverterResult;
```

### useImageOptimizer Hook

```typescript
interface UseImageOptimizerProps {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  rotate?: number;
  flipHorizontally?: boolean;
  flipVertically?: boolean;
}

interface UseImageOptimizerResult {
  optimizeImage: (file: File, options: UseImageOptimizerProps) => Promise<Blob | null>;
  loading: boolean;
  error: Error | null;
}

function useImageOptimizer(): UseImageOptimizerResult;
```

### useImageMeta Hook

```typescript
interface UseImageMetaProps {
  file: File | null; // The image file to extract metadata from
}

interface UseImageMetaResult {
  metadata: {
    width: number;
    height: number;
    type: string;
    size: number;
    name: string;
  } | null; // Image metadata or null if not available
  error: string | null; // Error message if any error occurs
}

function useImageMeta(file: UseImageMetaProps): UseImageMetaResult;
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
