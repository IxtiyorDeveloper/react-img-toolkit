import { isHtmlString } from "../isHtmlString";
import { extractImageUrlsFromHtml } from "../extractImageUrlsFromHtml";

export const extractImageUrlsFromData = (data: any): string[] => {
  let urls: string[] = [];

  if (Array.isArray(data)) {
    data.forEach((item) => {
      urls = urls.concat(extractImageUrlsFromData(item));
    });
  } else if (typeof data === "object" && data !== null) {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        urls = urls.concat(extractImageUrlsFromData(data[key]));
      }
    }
  } else if (typeof data === "string") {
    if (isHtmlString(data)) {
      urls = urls.concat(extractImageUrlsFromHtml(data));
    } else if (data.startsWith("http")) {
      urls.push(data);
    }
  }

  return urls;
};
