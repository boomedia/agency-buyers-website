# Development Guide

This document contains important information for developers and AI assistants working on this project.

## Package Manager

**⚠️ Important: Always use `pnpm` for this project**

```bash
# Correct usage
pnpm install
pnpm run dev
pnpm run build
pnpm run generate:types

# ❌ Do not use
npm install
yarn install
```

## Project Structure

This is a Next.js application with Payload CMS.

### Key Technologies
- **Frontend**: Next.js 14+ with TypeScript
- **CMS**: Payload CMS v3
- **Database**: Vercel Postgres
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

## Payload CMS

### Type Generation
After making changes to collection configurations, always regenerate types:

```bash
pnpm run generate:types
```

### Collections
- `properties` - Real estate properties
- `regions` - Geographic regions  
- `suburbs` - Suburbs within regions
- `buyers-access` - Buyer access and portfolio management
- `users` - User accounts
- `media` - File uploads
- `posts` - Blog posts
- `pages` - CMS pages
- `categories` - Content categories

### Relationship Fields
Use the collection slug in `relationTo`:

```typescript
{
  name: 'fieldName',
  type: 'relationship',
  relationTo: 'collection-slug', // Must match the slug in collection config
  hasMany: true, // For multiple selections
}
```

## Development Workflow

1. Make code changes
2. Run type generation if Payload collections were modified
3. Test changes locally with `pnpm run dev`
4. Run linting with `pnpm run lint`

## Recent Changes

- **2025-08-01**: Added `properties` relationship field to `BuyersAccess` collection for portfolio management
