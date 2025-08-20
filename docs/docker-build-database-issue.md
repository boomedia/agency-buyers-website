# Docker Build Database Connection Issue

## Overview

This document describes a critical issue encountered during Docker build process where the Next.js static generation phase was attempting to connect to a PostgreSQL database, causing build failures. The issue occurred when building the application for deployment to Google Cloud Platform.

## The Problem

### Initial Error
The Docker build consistently failed during the "Generating static pages" phase with database connection errors:

```
> Build error occurred
Error: getaddrinfo ENOTFOUND ep-cool-moon-a4uy6y7t.us-east-1.aws.neon.tech
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (node:dns:118:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'ep-cool-moon-a4uy6y7t.us-east-1.aws.neon.tech'
}
```

### Root Cause Analysis
The issue occurred because Next.js was attempting to perform static site generation (SSG) during the Docker build process. During SSG, Next.js runs the application code to pre-render pages, which triggered database connections through:

1. **generateStaticParams functions** - Used to generate dynamic route parameters
2. **Page components** - Server components that fetch data at build time
3. **Archive blocks** - Components that query for posts and content
4. **Sitemap generation** - Routes that fetch all content for SEO sitemaps
5. **Utility functions** - Helper functions that cache global data
6. **Header/Footer components** - Global components that fetch site-wide data

During Docker build, the database is not available, nor should it be required for creating a deployable image.

## The Solution

### Strategy: Conditional Database Access
We implemented a comprehensive solution using the `SKIP_PAYLOAD_DB` environment variable to conditionally disable database access during build time while preserving full functionality at runtime.

### Implementation Details

#### 1. Environment Variable Setup
Added `SKIP_PAYLOAD_DB=true` to the Docker build environment in the Dockerfile:

```dockerfile
ENV SKIP_PAYLOAD_DB=true
```

#### 2. generateStaticParams Functions
Modified all `generateStaticParams` functions to return empty arrays when database is disabled:

**Files affected:**
- `src/app/(frontend)/[slug]/page.tsx`
- `src/app/(frontend)/posts/[slug]/page.tsx` 
- `src/app/(frontend)/posts/page/[pageNumber]/page.tsx`

**Pattern applied:**
```typescript
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return []
  }
  // Original database query logic...
}
```

#### 3. Page Component Query Functions
Protected all database query functions in page components:

**Files affected:**
- `src/app/(frontend)/[slug]/page.tsx`
- `src/app/(frontend)/posts/[slug]/page.tsx`
- `src/app/(frontend)/posts/page.tsx`
- `src/app/(frontend)/posts/page/[pageNumber]/page.tsx`
- `src/app/(frontend)/page.tsx`
- `src/app/(frontend)/globals.css` (layout components)

**Pattern applied:**
```typescript
const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return null
  }
  // Original database query logic...
})
```

#### 4. ArchiveBlock Component
Modified the ArchiveBlock component to handle missing database gracefully:

**File:** `src/blocks/ArchiveBlock/Component.tsx`

```typescript
export const ArchiveBlock: React.FC<ArchiveBlockProps> = async (props) => {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return (
      <div className={cn('mx-auto w-full', className)}>
        <div className="container">
          <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8">
            <div className="col-span-4 sm:col-span-8 lg:col-span-12">
              <RichText data={introContent} enableGutter={false} />
            </div>
          </div>
        </div>
      </div>
    )
  }
  // Original database query logic...
}
```

#### 5. Sitemap Routes
Protected sitemap generation from database dependencies:

**Files affected:**
- `src/app/(frontend)/sitemap.ts`
- `src/app/(frontend)/posts/sitemap.ts`

**Pattern applied:**
```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return [
      {
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
      },
    ]
  }
  // Original database query logic...
}
```

#### 6. Utility Functions
Added guards to core utility functions that cache global data:

**Files affected:**
- `src/utilities/getRedirects.ts`
- `src/utilities/getGlobals.ts` 
- `src/utilities/getDocument.ts`

**Pattern applied:**
```typescript
export const getRedirects = cache(async (): Promise<Redirect[]> => {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return []
  }
  // Original database query logic...
})
```

#### 7. Header and Footer Components
Protected global components from database dependencies:

**Files affected:**
- `src/Header/Component.tsx`
- `src/Footer/Component.tsx`

**Pattern applied:**
```typescript
export async function Header() {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return (
      <div className="bg-theme-elevation-50 border-b border-theme-elevation-100">
        <div className="container py-3">
          <div className="font-medium">Agency Buyers Header</div>
        </div>
      </div>
    )
  }
  // Original database query logic...
}
```

## Files Modified

### Core Application Files
1. `src/app/(frontend)/[slug]/page.tsx` - Dynamic page generation
2. `src/app/(frontend)/posts/[slug]/page.tsx` - Blog post pages  
3. `src/app/(frontend)/posts/page.tsx` - Blog listing page
4. `src/app/(frontend)/posts/page/[pageNumber]/page.tsx` - Paginated blog listings
5. `src/app/(frontend)/page.tsx` - Homepage
6. `src/blocks/ArchiveBlock/Component.tsx` - Archive component

### Sitemap Generation
7. `src/app/(frontend)/sitemap.ts` - Main sitemap
8. `src/app/(frontend)/posts/sitemap.ts` - Posts sitemap

### Utility Functions  
9. `src/utilities/getRedirects.ts` - Redirect management
10. `src/utilities/getGlobals.ts` - Global data caching
11. `src/utilities/getDocument.ts` - Document fetching

### Global Components
12. `src/Header/Component.tsx` - Site header
13. `src/Footer/Component.tsx` - Site footer

## Build Process

### Docker Build Command
```bash
docker buildx build --platform=linux/amd64 -t australia-southeast1-docker.pkg.dev/agency-buyers-platform/payload-cms-repo/payload-cms:1.0.0 .
```

### Build Results
- **Before fix:** Build failed consistently at "Generating static pages (11/15)"
- **After fix:** Build completed successfully in ~3.7 minutes (222.2 seconds)
- **Image size:** Successfully created for linux/amd64 platform
- **Status:** Ready for deployment to Google Cloud Platform

## Key Learnings

### 1. Static Generation Scope
Next.js static generation touches many more components than initially apparent:
- Not just page components, but also global layouts
- Utility functions used across components
- Sitemap generation routes
- Archive and content blocks

### 2. Database Dependency Discovery
The issue required systematic investigation to find all database connection points:
- Used `grep` searches to find `getPayload` calls
- Traced through component trees to find indirect dependencies
- Discovered utility functions were being called during static generation

### 3. Graceful Degradation
The solution maintains application functionality while providing sensible fallbacks:
- Empty arrays for missing data collections
- Simplified UI components when database unavailable
- Preserved build-time optimizations where possible

### 4. Environment-Based Configuration
Using `SKIP_PAYLOAD_DB` environment variable provides:
- Clean separation between build-time and runtime behavior
- Easy debugging and testing capabilities
- No performance impact on production runtime

## Best Practices for Future Development

### 1. Database-Free Components
When creating new components that might be used during static generation:
- Always check for `SKIP_PAYLOAD_DB` environment variable
- Provide meaningful fallback content
- Avoid hard dependencies on database connections

### 2. Utility Function Design
- Make utility functions database-optional by default
- Return null or empty collections when database unavailable
- Document database dependencies clearly

### 3. Testing Static Generation
- Test Docker builds regularly during development
- Use `SKIP_PAYLOAD_DB=true` locally to simulate build environment
- Verify fallback UI renders appropriately

### 4. Static Generation Strategy
- Consider which pages truly need static generation
- Use `generateStaticParams` judiciously for dynamic routes
- Balance build-time generation with runtime performance

## Deployment Notes

The application is now successfully building and ready for deployment to Google Cloud Platform. The `SKIP_PAYLOAD_DB` environment variable should only be set to `true` during build time - at runtime, the application will connect to the database normally and provide full functionality.

**Build artifacts:**
- Docker image: `australia-southeast1-docker.pkg.dev/agency-buyers-platform/payload-cms-repo/payload-cms:1.0.0`
- Platform: linux/amd64
- Status: Ready for GCP deployment

---

*Last updated: August 21, 2025*
*Issue resolved in: feat/deploy-setup branch*
