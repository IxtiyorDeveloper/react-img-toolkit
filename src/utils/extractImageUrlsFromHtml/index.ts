export const extractImageUrlsFromHtml = (html: string): string[] => {
  const imgUrls: string[] = [];
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    imgUrls.push(match[1]);
  }

  return imgUrls;
};
