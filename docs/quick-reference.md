# Quick Reference Guide

This is a condensed reference for common tasks and configurations in the Agency Buyers Website Payload CMS.

## Collection Summary

| Collection | Purpose | Admin Group | Auth Required | Public Read |
|------------|---------|-------------|---------------|-------------|
| Properties | Investment properties with financial data | Real Estate | Yes | Yes |
| Regions | Local Government Areas (LGAs) | Real Estate | Yes | Yes |
| Suburbs | Suburb data linked to regions | Real Estate | Yes | Yes |
| Pages | Website pages with block layouts | Content | Yes | Auth/Published |
| Posts | Blog posts and articles | Content | Yes | Auth/Published |
| Media | File uploads and images | Content | Yes | Yes |
| Categories | Content categorization | Content | Yes | Yes |
| Users | System administrators | Admin | Yes | No |
| BuyersAccess | Buyer accounts with portfolios | Admin | Yes | No |
| AccessToken | API authentication tokens | Admin | Yes | No |

## Common Field Patterns

### Address Fields
```typescript
{
  name: 'address',
  type: 'group',
  fields: [
    { name: 'street', type: 'text' },
    { name: 'suburb', type: 'relationship', relationTo: 'suburbs' },
    { name: 'postcode', type: 'text' },
    { name: 'state', type: 'select', options: [...] }
  ]
}
```

### Price Fields
```typescript
{
  name: 'price',
  type: 'number',
  admin: {
    description: 'AUD Currency',
    step: 0.01
  }
}
```

### Image Upload
```typescript
{
  name: 'image',
  type: 'upload',
  relationTo: 'media',
  admin: {
    description: 'Upload an image'
  }
}
```

### SEO Tab
```typescript
{
  name: 'meta',
  label: 'SEO',
  fields: [
    MetaTitleField({ hasGenerateFn: true }),
    MetaImageField({ relationTo: 'media' }),
    MetaDescriptionField({}),
    PreviewField({ hasGenerateFn: true })
  ]
}
```

## Relationship Patterns

### Many-to-Many
```typescript
// In Collection A
{
  name: 'relatedB',
  type: 'relationship',
  relationTo: 'collection-b',
  hasMany: true
}
```

### Auto-Populated Relationship
```typescript
{
  name: 'region',
  type: 'relationship',
  relationTo: 'regions',
  admin: {
    readOnly: true,
    description: 'Auto-populated from suburb'
  }
}
```

## Financial Calculations

### Basic Yield Formula
```
Gross Yield = (Annual Rent ÷ Purchase Price) × 100
Net Yield = ((Annual Rent - Expenses) ÷ Purchase Price) × 100
```

### Loan Calculations
```
Loan Amount = Purchase Price - Total Deposit
Total Deposit = Cash Deposit + Equity Release
```

### Property Expenses
```
Total Expenses = Rates + Insurance + Utilities + 
                Management + Maintenance + Loan Repayments
```

## Custom Display Components

### File Locations
All custom field components are in `/src/fields/`:
- `PurchasePriceDisplayField.tsx`
- `LoanAmountDisplayField.tsx`
- `AnnualGrossYieldField.tsx`
- `AnnualNetYieldField.tsx`
- `EquityAt10DisplayField.tsx`

### Usage Pattern
```typescript
{
  name: 'calculatedField',
  type: 'text',
  admin: {
    readOnly: true,
    components: {
      Field: '@/fields/CustomDisplayField'
    }
  }
}
```

## Hooks Examples

### Before Change Hook
```typescript
beforeChange: [
  ({ data }) => {
    // Transform data before saving
    return convertEmptyStrings(data)
  }
]
```

### After Change Hook
```typescript
afterChange: [
  async ({ doc, req }) => {
    // React to changes
    await revalidateCache(doc.id)
  }
]
```

## Access Control Patterns

### Public Read
```typescript
access: {
  read: () => true
}
```

### Authenticated Only
```typescript
access: {
  create: authenticated,
  read: authenticated,
  update: authenticated,
  delete: authenticated
}
```

### Published Content
```typescript
access: {
  read: authenticatedOrPublished
}
```

## Admin UI Configuration

### Collection Groups
```typescript
admin: {
  group: 'Real Estate', // or 'Content', 'Admin'
  useAsTitle: 'name',
  defaultColumns: ['name', 'updatedAt']
}
```

### Live Preview
```typescript
admin: {
  livePreview: {
    url: ({ data, req }) => generatePreviewPath({
      id: data?.id,
      collection: 'properties',
      req
    })
  }
}
```

## Environment Setup

### Required Environment Variables
```
POSTGRES_URL=your_database_url
PAYLOAD_SECRET=your_payload_secret
NEXT_PUBLIC_SERVER_URL=your_site_url
BLOB_READ_WRITE_TOKEN=vercel_blob_token
```

### Database Migrations
```bash
# Generate migration
npm run payload migrate:create

# Run migrations
npm run payload migrate
```

## API Usage

### REST API Endpoints
```
GET    /api/properties       # List properties
GET    /api/properties/:id   # Get property
POST   /api/properties       # Create property
PATCH  /api/properties/:id   # Update property
DELETE /api/properties/:id   # Delete property
```

### Authentication Headers
```
# User session (browser)
Cookie: payload-token=session_token

# API key (programmatic)
Authorization: users API-Key your_api_key
```

## Common Tasks

### Adding a New Property
1. Navigate to Real Estate > Properties
2. Click "Create New"
3. Fill in General Information tab
4. Complete Due Diligence details
5. Configure Value Proposition calculations
6. Set up SEO meta fields
7. Save and publish

### Managing Buyer Access
1. Go to Admin > Buyers Access
2. Create buyer account with email
3. Assign properties in Properties > Linked Buyers
4. System automatically syncs relationships

### Uploading Media
1. Go to Content > Media
2. Drag and drop files or click browse
3. Add alt text for accessibility
4. Add caption if needed
5. Reference in other content

### Creating Pages
1. Navigate to Content > Pages
2. Click "Create New"
3. Add title (slug auto-generates)
4. Design hero section
5. Add content blocks
6. Configure SEO settings
7. Preview and publish

## Troubleshooting

### Common Issues

#### Empty String Errors
Properties have a beforeChange hook that converts empty strings to null for PostgreSQL compatibility.

#### Relationship Sync Issues
BuyersAccess relationships are automatically maintained. If they get out of sync, check the afterChange hooks in Properties.

#### Preview Not Working
Ensure NEXT_PUBLIC_SERVER_URL is set correctly and the preview function is configured.

#### File Upload Issues
Check BLOB_READ_WRITE_TOKEN for Vercel Blob Storage or ensure local media directory has write permissions.

### Debugging Tips
1. Check browser console for client-side errors
2. Review server logs for API errors
3. Verify environment variables are set
4. Test database connectivity
5. Check file permissions for uploads

## Performance Tips

### Database
- Use appropriate indexes on frequently queried fields
- Limit relationship depth in queries
- Use pagination for large datasets

### Media
- Optimize images before upload when possible
- Use appropriate image sizes for different contexts
- Enable CDN for production environments

### Content
- Use tabs to organize complex forms
- Implement caching strategies for frequently accessed data
- Consider lazy loading for large content blocks
