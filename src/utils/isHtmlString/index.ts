export const isHtmlString = (str: string): boolean => {
  return /<\/?[a-z][\s\S]*>/i.test(str);
};
