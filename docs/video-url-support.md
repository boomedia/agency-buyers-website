# Video URL Support - Quick Reference

## Overview

The Agency Buyers Website supports video embedding from multiple platforms with automatic URL conversion. Users can paste standard sharing URLs, and the system will automatically convert them to embed-compatible formats.

## Supported Platforms

### YouTube
- **Standard URLs**: `https://youtube.com/watch?v=VIDEO_ID`
- **Short URLs**: `https://youtu.be/VIDEO_ID`
- **Embed Format**: `https://www.youtube.com/embed/VIDEO_ID`

### Vimeo
- **Standard URLs**: `https://vimeo.com/VIDEO_ID`
- **Embed Format**: `https://player.vimeo.com/video/VIDEO_ID`

### Loom
- **Share URLs**: `https://www.loom.com/share/VIDEO_ID`
- **Embed Format**: `https://www.loom.com/embed/VIDEO_ID`

## Where Videos Are Used

### Properties Collection
- **Field**: `generalInformation.videoUrl`
- **Purpose**: Property presentation videos
- **Display**: Modal dialog with embedded video player

### Regions Collection
- **Field**: `video`
- **Purpose**: Regional overview videos
- **Display**: Full-width embedded video in region details

## Implementation Details

### Utility Function
The `getEmbedUrl()` function in `/src/utilities/videoUtils.ts` handles all URL conversions:

```typescript
import { getEmbedUrl } from '@/utilities/videoUtils'

// Converts any supported video URL to embed format
const embedUrl = getEmbedUrl(userProvidedUrl)
```

### Frontend Components
Videos are displayed using standard iframe elements:

```tsx
<iframe
  src={getEmbedUrl(videoUrl)}
  className="w-full h-full rounded-lg"
  allowFullScreen
  title="Video Title"
/>
```

## User Instructions

### Adding Videos in Admin Panel

1. **Copy the Video URL**
   - Go to YouTube, Vimeo, or Loom
   - Copy the full URL from the browser address bar or share button

2. **Paste into CMS Field**
   - Navigate to Property or Region in admin panel
   - Paste URL into the video field
   - No need to convert to embed format manually

3. **Supported URL Formats**
   - Any format from the supported platforms works
   - Share URLs, watch URLs, and even existing embed URLs

### Examples of Valid URLs

**YouTube:**
```
✅ https://www.youtube.com/watch?v=dQw4w9WgXcQ
✅ https://youtu.be/dQw4w9WgXcQ
✅ https://www.youtube.com/embed/dQw4w9WgXcQ (already embed format)
```

**Vimeo:**
```
✅ https://vimeo.com/123456789
✅ https://player.vimeo.com/video/123456789 (already embed format)
```

**Loom:**
```
✅ https://www.loom.com/share/abc123def456
✅ https://loom.com/share/abc123def456
✅ https://www.loom.com/embed/abc123def456 (already embed format)
```

## Troubleshooting

### Video Not Loading
- **Check URL**: Ensure the URL is from a supported platform
- **Privacy Settings**: Make sure the video is publicly accessible
- **X-Frame-Options**: Some videos may have embedding restrictions

### Platform-Specific Issues

**Loom Videos:**
- Ensure the video is set to "Public" or "Anyone with link"
- Business/Enterprise Loom accounts may have different sharing settings

**YouTube Videos:**
- Check that embedding is allowed for the video
- Some music videos or copyrighted content may restrict embedding

**Vimeo Videos:**
- Verify the video privacy settings allow embedding
- Some Vimeo accounts have embedding restrictions

## Recent Updates

- **2025-08-25**: Added Loom support for share URLs
- **2025-08-25**: Enhanced YouTube and Vimeo URL parsing
- **2025-08-25**: Updated admin field descriptions to reflect multi-platform support
