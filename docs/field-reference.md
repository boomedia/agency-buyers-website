# Field Reference Guide

This document provides detailed information about field types, custom components, and configuration options used throughout the collections.

## Standard Field Types

### Text Fields
- **Type**: `text`
- **Usage**: Names, addresses, short descriptions
- **Options**: 
  - `required`: Boolean to make field mandatory
  - `unique`: Boolean to enforce uniqueness
  - `minLength`/`maxLength`: Character limits
  - `defaultValue`: Default text value

### Number Fields
- **Type**: `number`
- **Usage**: Prices, measurements, percentages
- **Options**:
  - `step`: Decimal precision (e.g., 0.01 for currency)
  - `min`/`max`: Value constraints
  - `admin.description`: Helper text for users

### Email Fields
- **Type**: `email`
- **Usage**: Contact information
- **Features**: Automatic email validation
- **Options**: Same as text fields plus email-specific validation

### Date Fields
- **Type**: `date`
- **Usage**: Lease dates, timestamps
- **Options**:
  - `admin.date.pickerAppearance`: 'dayOnly', 'timeOnly', 'dayAndTime'
  - `admin.description`: Usage instructions

### Select Fields
- **Type**: `select`
- **Usage**: Predefined options (states, property types)
- **Structure**:
```typescript
{
  type: 'select',
  options: [
    { label: 'Display Name', value: 'stored_value' },
    // ... more options
  ]
}
```

### Radio Fields
- **Type**: `radio`
- **Usage**: Single choice from limited options
- **Layout**: 
  - `admin.layout`: 'horizontal' or 'vertical'
  - Similar structure to select fields

## Rich Content Fields

### Rich Text (Lexical)
- **Type**: `richText`
- **Editor**: Lexical editor with advanced features
- **Features**:
  - Block support (media, code, banners)
  - Inline and fixed toolbars
  - Headings and formatting
  - Horizontal rules

### Upload Fields
- **Type**: `upload`
- **Usage**: Images, documents, media files
- **Configuration**:
  - `relationTo`: 'media' (references Media collection)
  - `required`: Boolean for mandatory uploads
  - `admin.description`: Usage guidelines

## Relationship Fields

### Single Relationships
- **Type**: `relationship`
- **Usage**: One-to-one or many-to-one relationships
- **Configuration**:
```typescript
{
  type: 'relationship',
  relationTo: 'collection-slug',
  required: boolean,
  admin: {
    description: 'Helper text'
  }
}
```

### Multiple Relationships
- **Type**: `relationship`
- **Usage**: Many-to-many relationships
- **Configuration**:
```typescript
{
  type: 'relationship',
  relationTo: 'collection-slug',
  hasMany: true,
  admin: {
    isSortable: false // Disable drag sorting
  }
}
```

## Complex Field Types

### Array Fields
- **Type**: `array`
- **Usage**: Repeating data structures
- **Structure**:
```typescript
{
  type: 'array',
  fields: [
    // Nested field definitions
  ],
  admin: {
    description: 'Usage instructions'
  }
}
```

### Group Fields
- **Type**: `group`
- **Usage**: Organizing related fields
- **Benefits**: Namespace fields and improve admin UI
- **Structure**:
```typescript
{
  type: 'group',
  name: 'groupName',
  fields: [
    // Nested field definitions
  ]
}
```

### Row Fields
- **Type**: `row`
- **Usage**: Horizontal field layout
- **Configuration**:
```typescript
{
  type: 'row',
  fields: [
    {
      name: 'field1',
      type: 'text',
      admin: { width: '50%' }
    },
    {
      name: 'field2', 
      type: 'text',
      admin: { width: '50%' }
    }
  ]
}
```

### Tab Fields
- **Type**: `tabs`
- **Usage**: Organizing fields into tabs
- **Structure**:
```typescript
{
  type: 'tabs',
  tabs: [
    {
      label: 'Tab Name',
      fields: [
        // Field definitions
      ]
    }
  ]
}
```

## Custom Display Components

The system uses custom React components for calculated and display fields:

### Financial Display Fields
- **Purchase Price Display**: Shows formatted purchase price
- **Loan Amount Display**: Calculates loan amount from inputs
- **Deposit Total Display**: Sums cash deposit and equity release
- **Deposit Percentage Display**: Calculates deposit as percentage
- **Total Purchase Cost Display**: Sums all purchase-related costs

### Income and Yield Fields
- **Annual Gross Income**: Calculates from weekly rent (rent × 52)
- **Annual Gross Yield**: Calculates percentage return
- **Annual Net Income**: Subtracts expenses from gross income
- **Annual Net Yield**: Net return percentage

### Expense Calculation Fields
- **Property Management Fees**: Calculates from percentage and rent
- **Loan Repayments**: Complex loan calculation display
- **Total Annual Expenses**: Sums all expense categories

### Equity Projection Fields
- **Equity at 8%**: Purchase price × 0.08
- **Equity at 10%**: Purchase price × 0.10
- **Equity at 12%**: Purchase price × 0.12
- **Equity at 16%**: Purchase price × 0.16

## Field Configuration Options

### Admin Options
- **width**: Percentage width for row layouts ('25%', '50%', etc.)
- **description**: Helper text displayed below field
- **readOnly**: Prevents editing (for calculated fields)
- **components.Field**: Custom React component path

### Validation Options
- **required**: Makes field mandatory
- **unique**: Enforces database uniqueness
- **min/max**: Numeric range validation
- **minLength/maxLength**: Text length validation

### Default Values
- **Static Values**: Fixed default values
- **Dynamic Values**: Functions that calculate defaults
- **User Context**: Access to current user for auto-population

### Hooks
Fields can have hooks for custom behavior:
- **beforeChange**: Transform data before saving
- **afterChange**: React to data changes
- **beforeValidate**: Custom validation logic

## Calculation Logic

### Financial Calculations

#### Purchase Cost
```
Total Cost = Purchase Price + Stamp Duty + Renovations + 
            Building & Pest + Conveyancing + Bank Fees + 
            (LMI ÷ Loan Term)
```

#### Loan Calculations
```
Loan Amount = Purchase Price - Deposit Cash - Equity Release
Deposit Total = Deposit Cash + Equity Release
Deposit % = (Deposit Total ÷ Purchase Price) × 100
```

#### Yield Calculations
```
Gross Income = Weekly Rent × 52
Gross Yield = (Gross Income ÷ Purchase Price) × 100
Net Income = Gross Income - Total Expenses
Net Yield = (Net Income ÷ Purchase Price) × 100
```

#### Expense Calculations
```
PM Fees = (Weekly Rent × PM Percentage ÷ 100) × 52
Total Expenses = Council Rates + Insurance + Utilities + 
                PM Fees + Repairs + (LMI ÷ Loan Term) + 
                Loan Repayments
```

### Display Formatting

#### Currency Display
- **Format**: Australian Dollar (AUD)
- **Precision**: 2 decimal places
- **Separators**: Comma thousands separator
- **Example**: $1,234,567.89

#### Percentage Display
- **Format**: Percentage with 2 decimal places
- **Example**: 5.25%

#### Date Display
- **Format**: DD/MM/YYYY for Australian dates
- **Input**: Calendar picker for date selection

## Video URL Fields

### Video Field Configuration
Video fields in the system support multiple platforms and automatically convert sharing URLs to embed-compatible formats.

#### Supported Platforms
- **YouTube**: Standard watch URLs and youtu.be short URLs
- **Vimeo**: Standard vimeo.com URLs
- **Loom**: Share URLs from loom.com/share/

#### URL Conversion Examples

**YouTube URLs:**
```
Input:  https://youtube.com/watch?v=dQw4w9WgXcQ
Output: https://www.youtube.com/embed/dQw4w9WgXcQ

Input:  https://youtu.be/dQw4w9WgXcQ
Output: https://www.youtube.com/embed/dQw4w9WgXcQ
```

**Vimeo URLs:**
```
Input:  https://vimeo.com/123456789
Output: https://player.vimeo.com/video/123456789
```

**Loom URLs:**
```
Input:  https://www.loom.com/share/abc123def456
Output: https://www.loom.com/embed/abc123def456
```

#### Field Configuration
```typescript
{
  name: 'videoUrl',
  type: 'text',
  label: 'Video URL',
  admin: {
    description: 'Video URL (supports YouTube, Vimeo, and Loom)',
  },
}
```

#### Usage in Collections
- **Properties**: `generalInformation.videoUrl` - Property presentation videos
- **Regions**: `video` - Regional overview videos

#### Frontend Implementation
The video URLs are automatically converted to embed format using the `getEmbedUrl()` utility function:

```typescript
import { getEmbedUrl } from '@/utilities/videoUtils'

// Usage in component
<iframe
  src={getEmbedUrl(videoUrl)}
  className="w-full h-full rounded-lg"
  allowFullScreen
  title="Video"
/>
```

#### User Instructions
When adding video URLs in the admin panel:
1. Copy the full URL from the video platform
2. Paste the URL into the video field
3. The system will automatically handle embed conversion
4. All major sharing formats are supported (no need to use embed URLs)

## Best Practices

### Field Organization
1. **Group Related Fields**: Use group and row types
2. **Logical Tabs**: Separate content by purpose
3. **Clear Labels**: Use descriptive field names
4. **Helper Text**: Provide admin.description for complex fields

### Data Validation
1. **Required Fields**: Mark essential fields as required
2. **Reasonable Limits**: Set min/max values appropriately
3. **Format Validation**: Use appropriate field types
4. **Custom Validation**: Implement hooks for business rules

### User Experience
1. **Auto-Population**: Use defaults and hooks for convenience
2. **Read-Only Calculations**: Show computed values clearly
3. **Responsive Layout**: Use width percentages for mobile
4. **Progressive Disclosure**: Use tabs for complex forms

### Performance
1. **Efficient Relationships**: Avoid deeply nested relationships
2. **Image Optimization**: Configure appropriate sizes
3. **Lazy Loading**: Use tabs to defer field rendering
4. **Minimal Required**: Only require truly essential fields
