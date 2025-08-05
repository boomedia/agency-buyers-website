# Migration Log: Agency Buyers CMS Collections

## Overview
This document tracks the migration of Payload CMS collections from `agency-buyers-cms` to `agency-buyers-website`.

**Source:** `/Users/bill/repos/agency-buyers-cms/`
**Target:** `/Users/bill/repos/agency-buyers-website/`

## Collections Being Migrated

### From agency-buyers-cms:
1. **Properties** - Main property collection with extensive fields including:
   - General Information (address, pricing, format, images, etc.)
   - Due Diligence (zoning, occupancy, lease details)
   - Value Proposition (purchase costs, expenses, expected results)
   - Custom calculated fields with display components
   
2. **Regions** - Geographic regions/LGA with:
   - Basic info (name, description, hero image, video)
   - Community & Economic Landscape array
   - Infrastructure & Future Development array
   
3. **Suburbs** - Suburb data linked to regions with:
   - Name and region relationship
   - Hero image and description
   - Median value by year array
   
4. **AccessToken** - API authentication collection
5. **BuyersAccess** - Frontend buyer authentication (renamed from FrontendAccess)
6. **CompanySettings** - Global settings for company info

### Custom Components Being Migrated:
- Multiple calculated display fields (PurchasePriceDisplayField, LoanAmountDisplayField, etc.)
- Custom hooks for calculations (useLoanAmount, useAnnualGrossIncome, etc.)
- Base CustomField component and FieldDescription

### Existing Collections in agency-buyers-website (to preserve):
- Pages
- Posts  
- Categories
- Media (will be updated but not replaced)
- Users (will be updated but not replaced)
- Header & Footer globals

## Migration Steps

### Phase 1: Setup and Preparation
- [x] Create migration log file
- [x] Create fields directory structure
- [x] Copy custom field components and hooks
- [x] Copy collections

### Phase 2: Collection Migration
- [x] Migrate Properties collection
- [x] Migrate Regions collection
- [x] Migrate Suburbs collection
- [x] Migrate AccessToken collection
- [x] Migrate BuyersAccess collection (renamed from FrontendAccess)
- [x] Migrate CompanySettings global

### Phase 3: Configuration Updates
- [x] Update payload.config.ts to include new collections
- [x] Add Real Estate admin group
- [x] Organize existing collections into appropriate groups
- [ ] Test local development

### Phase 4: Testing and Validation
- [ ] Run pnpm dev to test local development
- [ ] Verify all collections appear in admin
- [ ] Test calculated fields functionality
- [ ] Verify relationships between Regions/Suburbs/Properties work

## Notes
- Maintaining existing agency-buyers-website structure and functionality
- Adding Real Estate admin group for better organization
- All calculated fields and custom components included
- Using existing naming conventions from agency-buyers-cms

## Migrated Files Summary

### Field Components Created:
- `/src/fields/CustomField.tsx` - Base component for display fields
- `/src/fields/FieldDescription.tsx` - Field description component
- `/src/fields/PurchasePriceDisplayField.tsx`
- `/src/fields/LoanAmountDisplayField.tsx`
- `/src/fields/DepositTotalDisplayField.tsx`
- `/src/fields/DepositPercentageDisplayField.tsx`
- `/src/fields/PropertyManagementFeesDisplayField.tsx`
- `/src/fields/LoanRepaymentsDisplayField.tsx`
- `/src/fields/TotalAnnualExpensesDisplayField.tsx`
- `/src/fields/TotalPurchaseCostDisplayField.tsx`
- `/src/fields/AnnualGrossIncomeField.tsx`
- `/src/fields/AnnualGrossYieldField.tsx`
- `/src/fields/AnnualNetIncomeField.tsx`
- `/src/fields/AnnualNetYieldField.tsx`
- `/src/fields/EquityAt8DisplayField.tsx`
- `/src/fields/EquityAt10DisplayField.tsx`
- `/src/fields/EquityAt12DisplayField.tsx`
- `/src/fields/EquityAt16DisplayField.tsx`

### Hooks Created:
- `/src/fields/hooks/useLoanAmount.ts`
- `/src/fields/hooks/useAnnualGrossIncome.ts`
- `/src/fields/hooks/useAnnualNetIncome.ts`
- `/src/fields/hooks/useAnnualTotalExpenses.ts`
- `/src/fields/hooks/useLoanRepayments.ts`
- `/src/fields/hooks/usePropertyManagementFees.ts`
- `/src/fields/hooks/useTotalPurchaseCost.ts`

### Collections Created:
- `/src/collections/Properties.ts` - Main property collection with tabs
- `/src/collections/Regions.ts` - Geographic regions/LGA
- `/src/collections/Suburbs.ts` - Suburbs linked to regions
- `/src/collections/AccessToken.ts` - API authentication
- `/src/collections/BuyersAccess.ts` - Frontend buyer authentication (renamed from FrontendAccess)

### Globals Created:
- `/src/globals/CompanySettings.ts` - Company settings global

### Configuration Updates:
- Updated `/src/payload.config.ts` to include all new collections and globals
- Added admin groups: Content, Real Estate, Admin
- Organized all collections into appropriate groups

## Date Started
2025-08-01

## Versioning change isssue with field name length
Summary of Changes Made
I've shortened the following problematic field names to prevent PostgreSQL identifier length issues:

Group Names (shortened to reduce prefix length):
- valueProposition → valProp
- purchaseCost → purchCost
- annualExpenses → annualExp
- expectedResults → expResults

Field Names:
- totalPurchaseCostDisp → totalCostDisp
- loanAmountDisplay → loanAmountDisp
- depositTotalDisplay → depositTotalDisp
- pmFeesDisplay → pmFeesDisp
- expectedWeeklyRent → expectedRent
- equityAt8Display → equity8Disp
- equityAt10Display → equity10Disp
- equityAt12Display → equity12Disp
- equityAt16Display → equity16Disp

These changes ensure that when Payload CMS generates the database schema with versioning prefixes, all column names will stay within PostgreSQL's 63-character identifier limit. The display labels in the admin interface remain unchanged, so the user experience won't be affected.