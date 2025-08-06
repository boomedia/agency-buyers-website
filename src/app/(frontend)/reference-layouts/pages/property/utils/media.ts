/**
 * Image and URL utilities for property data
 * Handles image URLs, embed URLs, and media processing
 */

export const getImageUrl = (url: string) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://cms.hassen.com.au${url}`;
};

export const getEmbedUrl = (url: string) => {
  if (!url) return '';

  // Convert Loom share URLs to embed URLs
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (loomMatch) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }

  // Convert YouTube watch URLs to embed URLs
  const youtubeMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Convert YouTube short URLs to embed URLs
  const youtubeShortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtubeShortMatch) {
    return `https://www.youtube.com/embed/${youtubeShortMatch[1]}`;
  }

  // Convert Vimeo URLs to embed URLs
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // If it's already an embed URL or unknown format, return as-is
  return url;
};
