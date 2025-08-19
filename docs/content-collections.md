# Content Collections

This document covers the content management collections: Pages, Posts, Media, and Categories.

## Pages Collection

### Overview
Pages represent the main website pages with flexible block-based layouts and SEO optimization.

### Key Features
- **Block-based Layout**: Flexible content blocks for varied page designs
- **Live Preview**: Real-time preview during editing
- **SEO Optimization**: Complete meta field support
- **Draft System**: Auto-save drafts with version control

### Structure

#### Basic Information
- **Title**: Page title (required)
- **Slug**: URL-friendly identifier (auto-generated)

#### Content Tabs

##### Hero Tab
Configurable hero section with:
- **Hero Type**: Various hero layout options
- **Background**: Images, videos, or color backgrounds
- **Content**: Headlines, descriptions, call-to-action buttons

##### Content Tab
Block-based content system with these block types:
- **Call to Action**: Promotional sections with buttons
- **Content**: Rich text content blocks
- **Media Block**: Image and video content
- **Archive**: Dynamic content listings
- **Form Block**: Contact and lead forms

##### SEO Tab
- **Meta Title**: Search engine title
- **Meta Description**: Search description
- **Meta Image**: Social sharing image
- **Preview**: Live SEO preview

### Access Control
- **Create/Update/Delete**: Authenticated users only
- **Read**: Authenticated or published content

### Live Preview
- **URL Generation**: Automatic preview URL creation
- **Responsive**: Mobile, tablet, desktop breakpoints
- **Real-time**: Updates as you edit

## Posts Collection

### Overview
Posts are blog articles and news content with category organization and rich content support.

### Key Features
- **Rich Text Editor**: Lexical editor with advanced features
- **Category System**: Multi-category organization
- **Author Management**: Author relationship support
- **SEO Optimization**: Full meta field support

### Structure

#### Basic Information
- **Title**: Post title (required)
- **Slug**: URL-friendly identifier
- **Published Date**: Publication timestamp
- **Author**: Relationship to Users collection

#### Content
- **Rich Text**: Main post content with:
  - **Block Support**: Embedded media and components
  - **Toolbar Features**: Fixed and inline toolbars
  - **Media Embedding**: Images, videos, and files
  - **Code Blocks**: Syntax-highlighted code snippets

#### Organization
- **Categories**: Many-to-many relationship with Categories
- **Tags**: Flexible tagging system
- **Featured**: Mark posts as featured content

#### SEO
Complete SEO field support identical to Pages collection.

### Content Blocks
Posts support embedded blocks:
- **Banner**: Promotional banners
- **Code**: Syntax-highlighted code blocks
- **Media Block**: Rich media presentations

## Media Collection

### Overview
Central media management for all uploaded files including images, documents, and videos.

### Key Features
- **Multi-format Support**: Images, videos, documents
- **Automatic Processing**: Thumbnail and size generation
- **Focal Point**: Smart image cropping
- **SEO Support**: Alt text and captions

### Structure

#### Basic Fields
- **File**: The uploaded file (automatic)
- **Alt Text**: Accessibility description
- **Caption**: Rich text caption with formatting

#### Automatic Processing
- **Thumbnails**: Admin interface previews
- **Responsive Sizes**: Multiple image sizes for different devices
- **Focal Point**: Click-to-set image focus point

### Image Sizes
Automatically generated sizes:
- **Thumbnail**: Small admin previews
- **Card**: Medium content cards
- **Feature**: Large hero images
- **Original**: Full-size uploads

### Storage
- **Production**: Vercel Blob Storage
- **Local**: Public media directory
- **CDN**: Automatic optimization and delivery

### Access Control
- **Upload/Edit/Delete**: Authenticated users only
- **Read**: Public access for website display

## Categories Collection

### Overview
Hierarchical organization system for Posts and other content types.

### Key Features
- **Simple Structure**: Title and slug only
- **SEO Friendly**: URL-optimized slugs
- **Flexible**: Can be extended for other content types

### Structure
- **Title**: Category name (required)
- **Slug**: URL-friendly identifier (auto-generated)

### Usage
- **Posts**: Many-to-many relationship
- **Navigation**: Category-based menus
- **Filtering**: Content organization and filtering

### Access Control
- **Create/Update/Delete**: Authenticated users only
- **Read**: Public access

## Content Workflow

### Page Creation Workflow
1. **Create Page**: Add title and basic information
2. **Design Hero**: Configure hero section
3. **Add Content**: Use blocks to build page layout
4. **SEO Setup**: Configure meta fields
5. **Preview**: Use live preview to verify
6. **Publish**: Make page live

### Post Publishing Workflow
1. **Draft Creation**: Start with title and basic info
2. **Content Writing**: Use rich text editor
3. **Media Addition**: Upload and embed media
4. **Categorization**: Assign relevant categories
5. **SEO Optimization**: Configure meta fields
6. **Review**: Preview before publishing
7. **Publish**: Make post live

### Media Management
1. **Upload**: Drag and drop or browse files
2. **Metadata**: Add alt text and captions
3. **Processing**: Automatic size generation
4. **Usage**: Reference in content
5. **Organization**: Use collections for grouping

## Block System

### Available Blocks

#### Call to Action
- **Purpose**: Promotional sections and lead generation
- **Features**: Headlines, descriptions, buttons, backgrounds
- **Styling**: Color schemes and layout options

#### Content Block
- **Purpose**: Rich text content sections
- **Features**: Full formatting, media embedding
- **Layout**: Column options and spacing

#### Media Block
- **Purpose**: Image and video presentations
- **Features**: Captions, sizing, positioning
- **Formats**: Images, videos, galleries

#### Archive Block
- **Purpose**: Dynamic content listings
- **Features**: Category filtering, pagination
- **Display**: Grid and list layouts

#### Form Block
- **Purpose**: Contact and lead forms
- **Features**: Field customization, validation
- **Integration**: Email notifications, CRM

### Block Configuration
Each block supports:
- **Custom CSS Classes**: Styling customization
- **Conditional Display**: Show/hide logic
- **Animation**: Entry animations
- **Spacing**: Margin and padding controls

## SEO Features

### Meta Fields
All content types support:
- **Meta Title**: Search engine title (auto-generated or custom)
- **Meta Description**: Search description
- **Meta Image**: Social sharing image
- **Open Graph**: Facebook and Twitter cards

### URL Structure
- **Slugs**: Auto-generated from titles
- **Hierarchy**: Parent/child page relationships
- **Redirects**: Automatic redirect management

### Schema Markup
- **Automatic**: Generated for content types
- **Rich Snippets**: Enhanced search results
- **Local Business**: Location-based SEO

## Performance Features

### Caching
- **Next.js Integration**: Automatic page caching
- **Revalidation**: Smart cache invalidation
- **CDN**: Global content delivery

### Image Optimization
- **WebP**: Modern format support
- **Lazy Loading**: Performance optimization
- **Responsive**: Device-appropriate sizes

### Content Optimization
- **Minification**: CSS and JavaScript compression
- **Preloading**: Critical resource prioritization
- **Bundle Splitting**: Optimized code delivery
