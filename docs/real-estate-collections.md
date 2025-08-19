# Real Estate Collections

This document covers the three main real estate collections: Properties, Regions, and Suburbs.

## Properties Collection

### Overview
The Properties collection is the core of the real estate system, containing detailed property information, financial calculations, and buyer relationships.

### Key Features
- **Financial Calculations**: Automatic calculation of yields, equity projections, and loan details
- **Due Diligence**: Zone data, occupancy status, and risk assessments
- **Buyer Relationships**: Many-to-many relationship with BuyersAccess
- **SEO Support**: Full meta fields for search optimization
- **Live Preview**: Real-time preview of property pages

### Structure

#### General Information Tab
- **Property Name**: Required text field for property identification
- **Hero Image**: Main property image upload
- **Agent Notes**: Array of notes with auto-populated agent names
- **Agent Summary**: Rich text summary for agents
- **Video URL**: Loom presentation URL
- **Purchase Price**: Target/recommended price in AUD
- **Asking Price**: Current asking price in AUD

#### Address Information
- **Street Address**: Property street address
- **Suburb**: Relationship to Suburbs collection
- **Region**: Auto-populated from selected suburb
- **Postcode**: Australian postcode
- **State**: Dropdown with all Australian states

#### Property Details
- **Sale History**: Array of year/value pairs
- **Format**: Bedrooms, bathrooms, car spaces
- **Measurements**: Internal area, land area (in m²)
- **Build Year**: Construction year (1788-2200)
- **Images**: Property image gallery

#### Due Diligence Tab
- **Zone Data**: Array of potential issues
  - Type: Easement, Flood Zone, Bushfire, etc.
  - Effect Level: Yes/No/Partial
  - Details: Rich text explanation
  - Agent Notes: Internal notes (not visible to buyers)
  - URL: External reference links
  - Supporting Image: Visual documentation

#### Occupancy Information
- **Property Occupancy**: Vacant/Tenanted/Owner Occupied
- **Lease Expiry Date**: Current lease end date
- **Last Rental Increase**: Date of last rent increase
- **Current Weekly Rent**: Current rental income (AUD)

#### Value Proposition Tab

##### Purchase Cost Calculations
- **Purchase Price**: Links to General Information
- **Loan Terms**: Term length, interest rate
- **Deposits**: Cash deposit and equity release amounts
- **Costs**: Stamp duty, renovations, inspections, legal fees
- **Automatic Calculations**:
  - Loan amount
  - Total deposit and percentage
  - Total purchase cost

##### Annual Expenses
- **Fixed Costs**: Council rates, insurance, utilities
- **Variable Costs**: Repairs, maintenance
- **Management**: Property management percentage
- **Automatic Calculations**:
  - Property management fees
  - Loan repayments
  - Total annual expenses

##### Expected Results
- **Projections**: Expected weekly rent, depreciation potential
- **Automatic Calculations**:
  - Annual gross income and yield
  - Annual net income and yield
  - Equity projections at 8%, 10%, 12%, 16%

### Hooks and Automation

#### Before Change
- **Empty String Conversion**: Converts empty strings to null for PostgreSQL compatibility
- **Region Auto-Population**: Automatically sets region when suburb is selected

#### After Change
- **Buyer Sync**: Maintains bidirectional relationships with BuyersAccess
- **Cache Revalidation**: Updates Next.js cache when properties change

## Regions Collection

### Overview
Regions represent Local Government Areas (LGAs) and contain community and economic information.

### Key Features
- **Versioning Support**: Draft and published states with autosave
- **Preview Functionality**: Basic preview support for future frontend development
- **Community Data**: Comprehensive community and economic landscape information
- **Infrastructure Tracking**: Development projects and future planning data

### Access Control
- **Read**: Public access
- **Create/Update/Delete**: Authenticated users only

### Fields
- **Name**: Region/LGA name (required)
- **Hero Image**: Main region image
- **Description**: Rich text region overview
- **Video**: Region overview video URL

#### Community & Economic Landscape
Array of community features:
- **Title**: Feature name
- **URL**: External reference link
- **Image**: Feature illustration
- **Icon**: Small feature icon
- **Description**: Rich text details

#### Infrastructure & Future Development
Array of development projects:
- **Title**: Project name
- **URL**: Project information link
- **Image**: Project visualization
- **Icon**: Project type icon
- **Description**: Project details

### Access Control
- **Read**: Public access
- **Create/Update/Delete**: Authenticated users only

## Suburbs Collection

### Overview
Suburbs are linked to regions and contain local market data.

### Key Features
- **Versioning Support**: Draft and published states with autosave
- **Preview Functionality**: Basic preview support for future frontend development  
- **Market Data**: Vacancy rates and median value trends
- **Regional Integration**: Automatic parent-child relationships with regions

### Fields

- **Name**: Suburb name (required)
- **Region**: Relationship to Regions collection (required)
- **Vacancy Rate**: Market vacancy percentage
- **Hero Image**: Suburb representative image
- **Description**: Rich text suburb overview

### Relationships

- **Parent**: Belongs to one Region
- **Children**: Can have multiple Properties

### Data Integration
- **Vacancy Rate**: Used for market analysis
- **Region Link**: Enables automatic region population in Properties

## Relationship Flow

```txt
Region (LGA)
  ↓ (One-to-Many)
Suburb
  ↓ (Many-to-One)
Property
  ↓ (Many-to-Many)
BuyersAccess
```

### Auto-Population Logic
1. User selects Suburb in Property
2. System looks up Suburb's Region
3. Property's Region field is automatically populated
4. Relationship maintains data consistency

## Financial Calculations

### Purchase Cost Formula
```
Total Cost = Purchase Price + Stamp Duty + Renovations + 
            Building & Pest + Conveyancing + Bank Fees + 
            (LMI / Loan Term)
```

### Yield Calculations
```
Gross Yield = (Annual Rent / Purchase Price) × 100
Net Yield = ((Annual Rent - Total Expenses) / Purchase Price) × 100
```

### Equity Projections
```
Equity at X% = Purchase Price × (X / 100)
```

## Best Practices

### Data Entry
1. Always start with Region selection
2. Select Suburb to auto-populate Region in Properties
3. Complete General Information before Value Proposition
4. Verify all calculated fields appear correctly

### Financial Accuracy
1. Use current market rates for interest calculations
2. Include all relevant costs in purchase calculations
3. Verify rent projections against market data
4. Update depreciation schedules regularly

### Due Diligence
1. Document all zone risks thoroughly
2. Include supporting images and URLs
3. Separate buyer-facing details from agent notes
4. Keep occupancy information current
