export const preloadImages = async (
    imageUrls: string[],
    crossOrigin: HTMLImageElement['crossOrigin'],
    referrerPolicy: HTMLImageElement['referrerPolicy']
): Promise<void> => {
  console.log('Starting preload for images:', imageUrls);

  // Detect Safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // Safari: off-screen (not display: none!)
  const preloadContainer = document.createElement('div');
  preloadContainer.style.cssText = isSafari
      ? `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 1px;
      height: 1px;
      overflow: hidden;
      z-index: -1;
    `
      : `display: none;`;

  document.body.appendChild(preloadContainer);

  const promises = imageUrls.map(async (url) => {
    try {
      console.log('Preloading image:', url);

      // Chrome path with fetch (skip for Safari)
      if (!isSafari) {
        try {
          console.log('Trying fetch for:', url);
          const response = await fetch(url, {
            mode: 'cors',
            credentials: 'include',
            headers: {
              'Accept': 'image/webp,image/*,*/*;q=0.8',
              'Origin': window.location.origin,
              'Cache-Control': 'no-cache',
            },
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
              resolve();
            };
            image.onerror = () => {
              URL.revokeObjectURL(image.src);
              reject();
            };
          });

          console.log('Fetch successful for:', url);
          return;
        } catch (fetchError) {
          console.warn('Fetch failed, falling back to image element:', url, fetchError);
        }
      }

      // Image element fallback (or primary for Safari)
      const img = new Image();
      img.crossOrigin = crossOrigin;
      img.referrerPolicy = referrerPolicy;

      const loadPromise = new Promise<void>((resolve, reject) => {
        img.onload = () => {
          console.log('Image loaded via <img> tag:', url);
          resolve();
        };
        img.onerror = (error) => {
          console.error('Image failed to load:', url, error);
          reject(new Error(`Image failed: ${url}`));
        };
      });

      preloadContainer.appendChild(img);
      img.src = url;
      await loadPromise;
      img.remove();

    } catch (error) {
      console.error(`Failed to preload image: ${url}`, error);
      throw error;
    }
  });

  try {
    await Promise.all(promises);
    console.log('✅ All images preloaded successfully');
  } catch (error) {
    console.error('⚠️ Some images failed to load:', error);
  } finally {
    preloadContainer.remove();
    console.log('🧹 Cleaned up preload container');
  }
};
