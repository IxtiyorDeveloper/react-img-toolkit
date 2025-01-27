export async function isImageCached(url: string): Promise<boolean> {
  const cache = await caches.open("image-preloader-cache");
  const cachedResponse = await cache.match(url);
  return !!cachedResponse;
}
