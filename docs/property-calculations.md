# Property Calculations Documentation

## Overview

This document explains the relationship between Payload CMS backend calculated fields and frontend calculations for property investment data.

## Background

In the Payload CMS admin interface, property fields are calculated in real-time using custom field components that hook into form data. However, these calculated values may not always be persisted to the database or may be null/empty, causing the frontend to display 0 or blank values.

## Backend Field Components

The backend uses custom field components located in `src/fields/` that leverage hooks in `src/fields/hooks/` to perform calculations:

### Field Components (Admin Interface)
- `AnnualGrossIncomeField.tsx` - Displays calculated annual gross income
- `AnnualGrossYieldField.tsx` - Displays calculated annual gross yield percentage  
- `AnnualNetIncomeField.tsx` - Displays calculated annual net income
- `AnnualNetYieldField.tsx` - Displays calculated annual net yield percentage
- `LoanAmountDisplayField.tsx` - Displays calculated loan amount
- `PropertyManagementFeesDisplayField.tsx` - Displays calculated PM fees
- `TotalPurchaseCostDisplayField.tsx` - Displays total purchase cost
- `TotalAnnualExpensesDisplayField.tsx` - Displays total annual expenses
- `EquityAt*DisplayField.tsx` - Displays equity calculations at various growth rates

### Calculation Hooks (Backend Logic)
- `useAnnualGrossIncome.ts` - Calculates: expectedWeeklyRent × 52
- `useAnnualNetIncome.ts` - Calculates: annualGrossIncome - annualTotalExpenses  
- `useLoanAmount.ts` - Calculates: purchasePrice - depositCash - equityRelease
- `usePropertyManagementFees.ts` - Calculates: (weeklyRent × 52) × (pmPercentage / 100)
- `useLoanRepayments.ts` - Complex loan repayment calculations
- `useTotalPurchaseCost.ts` - Sums all purchase costs + LMI/loanTerm
- `useAnnualTotalExpenses.ts` - Sums all annual expenses + fees + repayments

## Frontend Implementation

To solve the issue of null/empty display values on the frontend, we've created a utility module that replicates all backend calculations:

### Frontend Utility: `src/utilities/propertyCalculations.ts`

This module provides:

1. **Direct calculation functions** that mirror each backend hook
2. **Comprehensive calculation object** via `calculateAllPropertyMetrics()`
3. **Formatting utilities** for consistent display
4. **Type-safe implementation** using the Property interface

### Key Functions

```typescript
// Core calculations (mirrors backend hooks)
calculateAnnualGrossIncome(property)    // → useAnnualGrossIncome
calculateAnnualGrossYield(property)     // → AnnualGrossYieldField  
calculateAnnualNetIncome(property)      // → useAnnualNetIncome
calculateAnnualNetYield(property)       // → AnnualNetYieldField
calculateLoanAmount(property)           // → useLoanAmount
calculatePropertyManagementFees(property) // → usePropertyManagementFees
// ... and more

// Comprehensive calculation
const metrics = calculateAllPropertyMetrics(property)
// Returns all calculated values + formatted strings
```

## Usage Pattern

The frontend now uses a **fallback pattern** to ensure values are always displayed:

```typescript
// Property Card Example
<div className="font-bold text-green-600">
  {property.valueProposition.expectedResults.annualGrossYieldDisplay || 
   metrics.formatted.annualGrossYield}
</div>
```

This pattern:
1. **First** tries to use the stored display value from Payload CMS
2. **Falls back** to the calculated value if the display field is null/empty
3. **Ensures** consistent user experience regardless of data state

## Formula Reference

### Annual Gross Income
```
Expected Weekly Rent × 52
```

### Annual Gross Yield  
```
(Annual Gross Income ÷ Purchase Price) × 100
```

### Annual Net Income
```
Annual Gross Income - Annual Total Expenses
```

### Annual Net Yield
```
(Annual Net Income ÷ Purchase Price) × 100  
```

### Loan Amount
```
Purchase Price - Deposit Cash - Equity Release
```

### Property Management Fees
```
(Current Weekly Rent × 52) × (PM Percentage ÷ 100)
```

### Total Purchase Cost
```
Purchase Price + Stamp Duty + Renovations Cost + 
Building & Pest + Conveyancing + Bank Fees + (LMI ÷ Loan Term)
```

### Annual Total Expenses
```
Council Rates + Insurance + Utilities + Repairs & Maintenance + 
PM Fees + Loan Repayments + (LMI ÷ Loan Term)
```

### Loan Repayments (Complex)
```
Principal Loan:
- Monthly Rate = Interest Rate ÷ 100 ÷ 12
- Payments = Loan Term × 12  
- Principal = (Loan Amount - Equity Release)
- Monthly Payment = (Principal × (Rate × (1 + Rate)^Payments)) ÷ ((1 + Rate)^Payments - 1)

Equity Release:
- Monthly Interest = (Equity Release × Equity Rate ÷ 100) ÷ 12

Annual = (Principal Payment + Equity Payment) × 12
```

### Equity Calculations
```
Equity at 8% = Purchase Price × 0.08
Equity at 10% = Purchase Price × 0.10  
Equity at 12% = Purchase Price × 0.12
Equity at 16% = Purchase Price × 0.16
```

## Data Flow

1. **Admin Entry**: User enters property data in Payload CMS admin
2. **Backend Calculation**: Field components show calculated values in real-time  
3. **Data Storage**: Raw input data is stored, display values may be null
4. **Frontend Display**: Falls back to calculated values when display fields are empty
5. **Consistency**: Same formulas ensure identical results between admin and frontend

## Benefits

- **Reliability**: Frontend always shows calculated values even if display fields are null
- **Consistency**: Identical formulas between backend and frontend  
- **Performance**: No need to recalculate in admin since display is already handled
- **Maintainability**: Centralized calculation logic with clear documentation
- **Type Safety**: Full TypeScript support with proper Property interface

## Maintenance

When updating calculations:

1. **Update backend hook** in `src/fields/hooks/`
2. **Update corresponding function** in `src/utilities/propertyCalculations.ts`  
3. **Ensure formulas match exactly**
4. **Test both admin and frontend displays**
5. **Update this documentation** if formulas change

## Files Modified

- ✅ Created: `src/utilities/propertyCalculations.ts`
- ✅ Updated: `src/app/(frontend)/properties/page.client.tsx`
- ✅ Created: `docs/property-calculations.md` (this file)

The implementation ensures that property investment yields and other calculated values are always displayed correctly on the frontend, regardless of whether the backend display fields are populated.
