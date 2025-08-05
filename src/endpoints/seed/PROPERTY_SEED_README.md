# Property Seed Data

This directory contains seed data for the Properties collection and related collections (Regions, Suburbs, Buyers Access).

## Files Created

### Property Data

- `property-1.ts` - Main property: "61 Scotland Street Bundaberg East"
- `property-2.ts` - Second property: "15 Walker Street Bundaberg East"
- `property-images.ts` - Image definitions for all property-related media

### Location Data

- `region-bundaberg.ts` - Bundaberg Regional Council region data
- `suburb-bundaberg-east.ts` - Bundaberg East suburb data

### Updated Files

- `index.ts` - Updated to include Properties, Regions, Suburbs, and Buyers Access collections in seeding

## Data Structure

The seed data matches the JSON API structure provided and includes:

### Properties

- **General Information**: Hero images, agent notes, video URLs, pricing, address details, property format, images, comparable sales
- **Due Diligence**: Zone data (easement, flood, bushfire, public housing, train line, renovations), occupancy details, lease information
- **Value Proposition**: Purchase costs, annual expenses, expected results with calculated fields

### Regions

- Community and economic landscape data
- Infrastructure and future development information
- Rich text descriptions and media assets

### Suburbs

- Regional associations
- Median value trends by year
- Vacancy rates and descriptions

### Buyers Access

- **5 Demo Buyers**: Realistic user accounts with different property portfolios
- **Authentication Ready**: All accounts use `password123` for testing
- **Portfolio Variations**: Different access levels from no properties to full portfolio access

## Key Features

1. **Relationships**: Properties are properly linked to suburbs and regions
2. **Media Assets**: Comprehensive image seeding for all visual elements
3. **Rich Text**: Properly formatted rich text content matching the Lexical editor structure
4. **Financial Calculations**: All financial fields are populated to demonstrate the calculation features
5. **Zone Data**: Complete due diligence information with various zone types and effects

## Usage

Run the seed command to populate the database with this demo property data:

```bash
npm run seed
# or
yarn seed
```

This will create a complete real estate portfolio with:

- 1 Region (Bundaberg Regional Council)
- 1 Suburb (Bundaberg East)
- 2 Properties with full data
- 5 Buyers Access accounts with varying property portfolios
- All associated media assets
- Demo users and existing blog content

## Buyers Access Demo Accounts

The seed data includes 5 realistic buyer accounts for testing authentication and property access:

| Name | Email | Properties | Use Case |
|------|-------|------------|----------|
| **John Doe** | `john.doe@example.com` | Both properties | Full portfolio access |
| **Sarah Wilson** | `sarah.wilson@example.com` | Property 1 only | Partial access testing |
| **Michael Chen** | `michael.chen@example.com` | Property 2 only | Partial access testing |
| **Emma Thompson** | `emma.thompson@example.com` | Property 1 only | Partial access testing |
| **David Johnson** | `david.johnson@example.com` | No properties | New buyer (no access) |

**All accounts use password:** `password123`

These accounts allow you to test:

- ✅ Property-specific access controls
- ✅ Portfolio-based content filtering
- ✅ Authentication workflows
- ✅ Different user permission levels

## Troubleshooting

### Database Deadlock Issues

The seed process has been optimized to prevent PostgreSQL deadlock errors by:

1. **Sequential Collection Deletion**: Collections are deleted in dependency order rather than in parallel
2. **Error Handling**: Individual collection deletions are wrapped in try-catch blocks
3. **Timing Delays**: Small delays prevent database contention during cleanup
4. **Detailed Logging**: Better visibility into which operations succeed or fail
5. **Retry Logic**: Failed image downloads are retried with exponential backoff
6. **Fallback Images**: Service outages don't prevent seeding completion

If you encounter deadlock errors:

1. Wait for the current seed operation to timeout/fail
2. Try running the seed command again (the cleanup process is more robust now)
3. If issues persist, restart your database connection or check for hanging transactions

### Common Issues

- **Foreign Key Constraints**: Properties depend on suburbs, suburbs depend on regions, buyers access depends on properties - the seed process handles this correctly
- **Media Upload Failures**: If image fetching fails, the system automatically retries with exponential backoff and uses fallback images if needed
- **Filename Uniqueness**: Each media file now has a unique filename to prevent validation errors
- **Type Errors**: Ensure all collection relationships are properly defined in your schema
- **Service Outages**: Picsum Photos outages are handled gracefully with retry logic and transparent PNG fallbacks

### Media Files

The seed data uses a mix of high-quality placeholder images:

**Blog Content (PayloadCMS Template)**:

- `image-post1.webp`, `image-post2.webp`, etc. - Original blog post images

**Real Estate Images (Picsum Photos)**:

- `property-hero.jpg` (800x600) - Main property hero image
- `property-image-1.jpg`, `property-image-2.jpg` (800x600) - Property gallery images  
- `comparable-1.jpg`, `comparable-2.jpg` (800x600) - Comparable sales images
- `easement-map.jpg`, `flood-map.jpg` (1200x800) - Zone mapping images (landscape)
- `bundaberg-hero.jpg` (1600x900) - Region hero image (panoramic)
- `suburb-hero.jpg` (1600x900) - Suburb hero image (panoramic)
- `community-infographic.jpg` (600x400) - Region data graphics
- `hospital-icon.jpg` (400x400) - Infrastructure icons (square)

**Benefits of Picsum Photos**:

- ✅ Unique images for each property element
- ✅ Appropriate dimensions for different use cases  
- ✅ High-quality, realistic placeholder content
- ✅ Fast loading and reliable service
- ✅ No filename conflicts or licensing issues

## Notes

- All monetary values are in AUD
- Images use high-quality placeholder content from Picsum Photos with fallback support
- Rich text content follows the Lexical editor format
- Field names are shortened in the database schema (e.g., `info` instead of `generalInformation`)
- The data structure supports the custom calculation fields defined in the Properties collection
- Buyers Access accounts use bcrypt-hashed passwords for security
- All seed operations include comprehensive error handling and logging
