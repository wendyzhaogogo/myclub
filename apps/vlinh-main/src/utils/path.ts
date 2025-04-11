const isProduction = import.meta.env.PROD;

export const getPrefixedPath = (path: string): string => {
  // Remove leading slash if exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return isProduction ? `/myclub/${cleanPath}` : `/${cleanPath}`;
};

export const openWindow = (path: string, target: string = "_blank", features?: string) => {
  const prefixedPath = getPrefixedPath(path);
  window.open(prefixedPath, target, features);
}; 