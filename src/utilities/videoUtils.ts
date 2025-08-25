/**
 * Utility functions for handling video URLs and converting them to embed-compatible formats
 */

/**
 * Converts various video sharing URLs to their embed-compatible formats
 * Supports YouTube, Vimeo, and Loom URLs
 */
export function getEmbedUrl(url: string): string {
  if (!url) return ''

  // Clean up the URL
  const cleanUrl = url.trim()

  // Handle YouTube URLs
  if (cleanUrl.includes('youtube.com/watch')) {
    const videoId = cleanUrl.split('v=')[1]?.split('&')[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : cleanUrl
  }

  if (cleanUrl.includes('youtu.be/')) {
    const videoId = cleanUrl.split('youtu.be/')[1]?.split('?')[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : cleanUrl
  }

  // Handle Vimeo URLs
  if (cleanUrl.includes('vimeo.com/')) {
    const videoId = cleanUrl.split('vimeo.com/')[1]?.split('?')[0]
    return videoId ? `https://player.vimeo.com/video/${videoId}` : cleanUrl
  }

  // Handle Loom URLs
  if (cleanUrl.includes('loom.com/share/')) {
    const videoId = cleanUrl.split('loom.com/share/')[1]?.split('?')[0]
    return videoId ? `https://www.loom.com/embed/${videoId}` : cleanUrl
  }

  // For Loom embed URLs that are already in embed format
  if (cleanUrl.includes('loom.com/embed/')) {
    return cleanUrl
  }

  // Return original URL if no transformation is needed
  return cleanUrl
}

/**
 * Checks if a URL is a supported video platform
 */
export function isSupportedVideoUrl(url: string): boolean {
  if (!url) return false
  
  const cleanUrl = url.trim().toLowerCase()
  
  return (
    cleanUrl.includes('youtube.com') ||
    cleanUrl.includes('youtu.be') ||
    cleanUrl.includes('vimeo.com') ||
    cleanUrl.includes('loom.com')
  )
}

/**
 * Gets the video platform name from a URL
 */
export function getVideoPlatform(url: string): string {
  if (!url) return 'Unknown'
  
  const cleanUrl = url.trim().toLowerCase()
  
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    return 'YouTube'
  }
  
  if (cleanUrl.includes('vimeo.com')) {
    return 'Vimeo'
  }
  
  if (cleanUrl.includes('loom.com')) {
    return 'Loom'
  }
  
  return 'Unknown'
}
