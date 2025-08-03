# Project Notes for AI Assistants

## Package Manager
**ALWAYS use `pnpm` for this project, never `npm` or `yarn`**

Examples:
- `pnpm install` (not `npm install`)
- `pnpm run build` (not `npm run build`)
- `pnpm run dev` (not `npm run dev`)
- `pnpm run generate:types` (not `npm run generate:types`)

## Payload CMS
- After making changes to collection configs, always run `pnpm run generate:types`
- Collection slugs are defined in the `slug` property of each collection
- Relationship fields use `relationTo` with the collection slug as a string

## Available Collections
- `properties` - Real estate properties
- `regions` - Geographic regions
- `suburbs` - Suburbs within regions
- `buyers-access` - Buyer access management
- `users` - User accounts
- `media` - File uploads
- `posts` - Blog posts
- `pages` - CMS pages
- `categories` - Content categories

## Recent Changes
- Added `properties` relationship field to `BuyersAccess` collection for portfolio management
