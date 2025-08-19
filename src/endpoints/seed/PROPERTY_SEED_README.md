# Property Seed Data

This directory contains enhanced seed data for the Properties collection and related collections (Regions, Suburbs, Buyers Access), updated to match the latest collections documentation.

## Files Created

### Property Data

- `property-1.ts` - Main property: "61 Scotland Street Bundaberg East" - **Enhanced with comprehensive due diligence data**
- `property-2.ts` - Second property: "15 Walker Street Bundaberg East" - **Enhanced with detailed zone information**
- `property-images.ts` - Image definitions for all property-related media

### Location Data

- `region-bundaberg.ts` - Bundaberg Regional Council region data - **Enhanced with additional infrastructure projects**
- `suburb-bundaberg-east.ts` - Bundaberg East suburb data

### Updated Files

- `index.ts` - Updated to include Properties, Regions, Suburbs, and Buyers Access collections in seeding

## Data Structure Updates

The seed data has been enhanced to match the latest collections documentation and includes:

### Properties

- **General Information**: Hero images, agent notes, video URLs, pricing, address details, property format, images, **enhanced comparable sales with complete sale history**
- **Due Diligence**: **Comprehensive zone data with rich text descriptions**, detailed explanations for:
  - Easement analysis with title search confirmation
  - Flood zone mapping with specific flood levels and insurance recommendations
  - Bushfire risk assessment with QFES mapping references
  - Public housing proximity analysis with impact assessments
  - Train line distance analysis
  - Renovation potential with cost/benefit analysis
- **Value Proposition**: Purchase costs, annual expenses, expected results with calculated fields

### Regions

- **Enhanced Community and Economic Landscape**: Comprehensive demographic data and community profiles
- **Expanded Infrastructure and Future Development**: Multiple major projects including:
  - $1.2 billion Bundaberg Hospital expansion
  - 1,000+ new homes approved with detailed development plans
  - Bundaberg Ring Road Stage 2 extension
  - Port of Bundaberg expansion for economic growth
- **Versioning Support**: Now includes draft/published states with `_status` field
- **Preview Functionality**: Basic preview support for future development
- Rich text descriptions and media assets

### Suburbs

- Regional associations with automatic parent-child relationships
- **Comprehensive median value trends** by year (2016-2025)
- Vacancy rates and detailed descriptions
- **Versioning Support**: Now includes draft/published states with `_status` field
- **Preview Functionality**: Basic preview support for future development

### Buyers Access

- **5 Demo Buyers**: Realistic user accounts with different property portfolios
- **Authentication Ready**: All accounts use `password123` for testing
- **Portfolio Variations**: Different access levels from no properties to full portfolio access

## Key Enhanced Features

1. **Enhanced Relationships**: Properties are properly linked to suburbs and regions with automatic region population
2. **Comprehensive Media Assets**: Complete image seeding for all visual elements with zone mapping images
3. **Rich Text Content**: Properly formatted rich text content matching the Lexical editor structure throughout
4. **Detailed Financial Calculations**: All financial fields are populated to demonstrate the calculation features
5. **Comprehensive Zone Data**: Complete due diligence information with:
   - Detailed explanations for each zone type
   - Rich text descriptions for buyer education
   - Agent notes for internal reference
   - Supporting URLs and documentation
   - Visual mapping and evidence images
6. **Complete Sale History**: Historical sale data for property valuation context
7. **Enhanced Infrastructure Data**: Comprehensive regional development projects and community features
8. **Market Analysis Data**: Detailed suburb trends and vacancy rate information
9. **Versioning Support**: All real estate collections (Properties, Regions, Suburbs) now support draft/published states with autosave

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

## Enhanced Buyers Access Demo Accounts

The seed data includes 5 realistic buyer accounts with diverse investment strategies for comprehensive testing:

| Name | Email | Properties | Investment Profile |
|------|-------|------------|-------------------|
| **John Doe** | `john.doe@example.com` | Both properties | Experienced investor with diversified portfolio |
| **Sarah Wilson** | `sarah.wilson@example.com` | Property 1 only | New investor interested in flood-affected areas |
| **Michael Chen** | `michael.chen@example.com` | Property 2 only | Prefers low-maintenance/vacant properties |
| **Emma Thompson** | `emma.thompson@example.com` | Property 1 only | Value-add investor focused on renovation potential |
| **David Johnson** | `david.johnson@example.com` | No properties | Prospective buyer evaluating investment options |

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
