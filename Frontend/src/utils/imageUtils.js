// utils/imageUtils.js
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

  // Handle both absolute and relative paths
  if (imagePath.startsWith("/")) {
    return `${BASE_URL}${imagePath}`;
  }

  return `${BASE_URL}/${imagePath}`;
};
