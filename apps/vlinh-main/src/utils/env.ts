export const getBasePath = () => {
  return '';
};

export const getFullPath = (path: string) => {
  // Remove leading slash if exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `#/${cleanPath}`;
};

export const openWindow = (path: string, target: string = "_blank", features?: string) => {
  const fullPath = getFullPath(path);
  window.open(fullPath, target, features);
}; 