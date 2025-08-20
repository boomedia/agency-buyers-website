# Payload CMS Overview

## System Architecture

The Agency Buyers Website uses Payload CMS as a headless content management system with the following configuration:

### Database
- **Adapter**: Vercel Postgres
- **Migration Directory**: `src/migrations`
- **Connection**: Environment variable `POSTGRES_URL`

### Storage
- **Provider**: Vercel Blob Storage
- **Media Directory**: `public/media`
- **Image Processing**: Sharp for thumbnails and resizing

### Editor
- **Default Editor**: Lexical Rich Text Editor
- **Features**: Block support, inline toolbar, fixed toolbar, headings, horizontal rules

## Admin Interface

### Groups
The admin interface is organized into three logical groups:

1. **Content** - Website pages, posts, media, and categories
2. **Real Estate** - Properties, regions, and suburbs
3. **Admin** - User management and access control

### Live Preview
- **Enabled for**: Properties and Pages
- **Breakpoints**: Mobile (375px), Tablet (768px), Desktop (1440px)
- **Preview URLs**: Generated based on collection type and slug

### Authentication
- **User Collection**: `users`
- **Auth Strategy**: Local authentication with email/password
- **API Keys**: Supported for programmatic access

## Access Control

### Roles and Permissions

#### Public Access
- **Read Access**: Properties, Regions, Suburbs, Media, Categories
- **No Authentication Required**: Basic content viewing

#### Authenticated Users
- **Full CRUD Access**: All collections
- **Admin Panel Access**: Complete administrative interface
- **Content Management**: Pages, posts, and media uploads

#### Buyers Access
- **Special Collection**: Separate authentication system
- **Property Portfolios**: Linked to specific properties
- **Limited Scope**: Property viewing only

## Global Configuration

### Hooks
- **Before Change**: Data validation and transformation
- **After Change**: Cache revalidation and relationship sync
- **After Delete**: Cleanup and cache invalidation

### Fields
- **Slug Generation**: Automatic URL-friendly slug creation
- **SEO Fields**: Meta title, description, and image support
- **Relationship Syncing**: Automatic bidirectional relationship management

### Plugins
- **SEO Plugin**: Comprehensive SEO field support
- **Custom Components**: Field-specific display components
- **Validation**: Real-time field validation

## Development Features

### TypeScript Support
- **Type Generation**: Automatic TypeScript types from collections
- **Type Safety**: Full IntelliSense support
- **Collection Generics**: Type-safe collection references

### Custom Components
- **Before Login**: Custom login page messaging
- **Before Dashboard**: Welcome dashboard content
- **Field Components**: Custom field rendering and validation

### Environment Configuration
- **Development**: Local database and file storage
- **Production**: Vercel-hosted with blob storage
- **Preview**: Live preview URLs for content editing

## Performance Optimizations

### Caching
- **Next.js Integration**: Automatic page revalidation
- **Collection Hooks**: Smart cache invalidation
- **Media Optimization**: Multiple image sizes and formats

### Database
- **Efficient Queries**: Optimized relationship loading
- **Indexes**: Strategic indexing for performance
- **Migration System**: Versioned schema changes

### File Handling
- **Image Sizes**: Multiple responsive sizes
- **Focal Point**: Smart image cropping
- **Admin Thumbnails**: Fast preview generation
