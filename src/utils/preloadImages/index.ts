export const preloadImages = async (imageUrls: string[], crossOrigin: HTMLImageElement['crossOrigin'], referrerPolicy: HTMLImageElement['referrerPolicy']): Promise<void> => {
  // Create a hidden div to append images for Safari
  const preloadContainer = document.createElement('div');
  preloadContainer.style.display = 'none';
  document.body.appendChild(preloadContainer);

  const promises = imageUrls.map(async (url) => {
    try {
      // First try with fetch (works well in Safari)
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'image/webp,image/*,*/*;q=0.8',
          'Origin': window.location.origin
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${url}`);
      }

      // Create image element
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';
      
      // Add to container
      preloadContainer.appendChild(img);
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Image failed to load: ${url}`));
        img.src = url;
      });
      
      // Remove from container after loading
      img.remove();
    } catch (error) {
      console.error(`Failed to preload image: ${url}`, error);
      // Try with different settings
      const img = new Image();
      img.crossOrigin = 'use-credentials';
      img.referrerPolicy = 'strict-origin-when-cross-origin';
      
      // Add to container
      preloadContainer.appendChild(img);
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Image failed to load after retry: ${url}`));
        img.src = url;
      });
      
      // Remove from container
      img.remove();
    }
  });

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error("Some images failed to load.", error);
  } finally {
    // Clean up the container
    preloadContainer.remove();
  }
};
