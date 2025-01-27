import { isImageCached } from "../isImageCached";

export async function cacheImages(urls: string[]) {
  const cache = await caches.open("image-preloader-cache");
  await Promise.all(
    urls.map(async (url) => {
      if (!(await isImageCached(url))) {
        try {
          await cache.add(url);
        } catch (error) {
          console.error(`Failed to cache image: ${url}`, error);
        }
      }
    }),
  );
}
