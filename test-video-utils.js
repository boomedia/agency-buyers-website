import { getEmbedUrl, isSupportedVideoUrl, getVideoPlatform } from './src/utilities/videoUtils.js'

// Test YouTube URLs
console.log('=== YouTube Tests ===')
console.log('Standard URL:', getEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'))
console.log('Short URL:', getEmbedUrl('https://youtu.be/dQw4w9WgXcQ'))
console.log('With params:', getEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s'))

// Test Vimeo URLs
console.log('\n=== Vimeo Tests ===')
console.log('Standard URL:', getEmbedUrl('https://vimeo.com/123456789'))
console.log('With params:', getEmbedUrl('https://vimeo.com/123456789?h=abc123'))

// Test Loom URLs
console.log('\n=== Loom Tests ===')
console.log('Share URL:', getEmbedUrl('https://www.loom.com/share/abc123def456'))
console.log('Share URL no www:', getEmbedUrl('https://loom.com/share/abc123def456'))
console.log('Already embed:', getEmbedUrl('https://www.loom.com/embed/abc123def456'))

// Test platform detection
console.log('\n=== Platform Detection ===')
console.log('YouTube:', getVideoPlatform('https://www.youtube.com/watch?v=test'))
console.log('Vimeo:', getVideoPlatform('https://vimeo.com/123'))
console.log('Loom:', getVideoPlatform('https://loom.com/share/test'))
console.log('Unknown:', getVideoPlatform('https://example.com/video'))

// Test support detection
console.log('\n=== Support Detection ===')
console.log('YouTube supported:', isSupportedVideoUrl('https://www.youtube.com/watch?v=test'))
console.log('Vimeo supported:', isSupportedVideoUrl('https://vimeo.com/123'))
console.log('Loom supported:', isSupportedVideoUrl('https://loom.com/share/test'))
console.log('Unknown supported:', isSupportedVideoUrl('https://example.com/video'))

// Test edge cases
console.log('\n=== Edge Cases ===')
console.log('Empty string:', getEmbedUrl(''))
console.log('Invalid URL:', getEmbedUrl('not-a-url'))
console.log('Regular website:', getEmbedUrl('https://example.com'))
