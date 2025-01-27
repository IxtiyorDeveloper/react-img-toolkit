export const preloadImages = async (imageUrls: string[]): Promise<void> => {
  const promises = imageUrls.map((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = resolve;
      img.onerror = (error) => {
        console.error(`Failed to load image at ${url}`, error);
        reject(error);
      };
    });
  });

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error("Some images failed to load.");
  }
};
