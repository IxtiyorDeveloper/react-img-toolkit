export const preloadImages = async (
    imageUrls: string[],
    crossOrigin: HTMLImageElement['crossOrigin'],
    referrerPolicy: HTMLImageElement['referrerPolicy']
): Promise<void> => {
  console.log('Starting preload for images:', imageUrls);

  // Use off-screen positioning instead of display: none for Safari
  const preloadContainer = document.createElement('div');
  preloadContainer.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 1px;
    height: 1px;
    overflow: hidden;
    z-index: -1;
  `;
  document.body.appendChild(preloadContainer);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const promises = imageUrls.map(async (url) => {
    try {
      console.log('Preloading image:', url);

      // Try fetch if not Safari
      if (!isSafari) {
        try {
          console.log('Trying fetch for:', url);
          const response = await fetch(url, {
            mode: 'cors',
            credentials: 'include',
            headers: {
              'Accept': 'image/webp,image/*,*/*;q=0.8',
              'Origin': window.location.origin,
              'Cache-Control': 'no-cache'
            }
          });

          if (!response.ok) {
            throw new Error(`Fetch failed with status: ${response.status}`);
          }

          const blob = await response.blob();
          const image = new Image();
          image.src = URL.createObjectURL(blob);

          await new Promise<void>((resolve, reject) => {
            image.onload = () => {
              URL.revokeObjectURL(image.src);
              console.log('Fetch-based preload successful:', url);
              resolve();
            };
            image.onerror = () => {
              URL.revokeObjectURL(image.src);
              reject(new Error(`Fetch image load failed: ${url}`));
            };
          });

          return;
        } catch (fetchError) {
          console.warn('Fetch failed, falling back to image element for:', url);
        }
      }

      // Fallback or Safari path using <img> element
      const img = new Image();
      img.crossOrigin = crossOrigin;
      img.referrerPolicy = referrerPolicy;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          console.log('Image loaded via <img> tag:', url);
          resolve();
        };
        img.onerror = (error) => {
          console.error('Image failed to load via <img> tag:', url, error);
          reject(new Error(`Image failed: ${url}`));
        };
        img.src = url;
      });

      preloadContainer.appendChild(img);
      // Optionally remove after load if desired:
      setTimeout(() => img.remove(), 1000); // slight delay for caching

    } catch (error) {
      console.error('Image preload failed:', url, error);
      throw error;
    }
  });

  try {
    await Promise.all(promises);
    console.log('✅ All images preloaded successfully');
  } catch (error) {
    console.error('⚠️ Some images failed to preload:', error);
  } finally {
    preloadContainer.remove();
    console.log('🧹 Cleaned up preload container');
  }
};
