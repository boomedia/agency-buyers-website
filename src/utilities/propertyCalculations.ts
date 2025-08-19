/**
 * Property calculation utilities for frontend
 * These calculations mirror the backend Payload CMS field calculations
 * located in src/fields/hooks/ and src/fields/*Field.tsx components
 *
 * Reference mapping:
 * - useAnnualGrossIncome → calculateAnnualGrossIncome
 * - useAnnualNetIncome → calculateAnnualNetIncome
 * - AnnualGrossYieldField → calculateAnnualGrossYield
 * - AnnualNetYieldField → calculateAnnualNetYield
 * - useLoanAmount → calculateLoanAmount
 * - usePropertyManagementFees → calculatePropertyManagementFees
 * - useTotalPurchaseCost → calculateTotalPurchaseCost
 * - useAnnualTotalExpenses → calculateAnnualTotalExpenses
 */

import type { Property as ClientProperty } from '~/types/payload-types'

/**
 * Calculate Annual Gross Income
 * Backend ref: src/fields/hooks/useAnnualGrossIncome.ts
 * Formula: Expected Weekly Rent × 52
 */
export const calculateAnnualGrossIncome = (property: ClientProperty): number => {
  const expectedWeeklyRent = property.valueProposition?.expectedResults?.expectedWeeklyRent || 0
  return expectedWeeklyRent * 52
}

/**
 * Calculate Annual Gross Yield
 * Backend ref: src/fields/AnnualGrossYieldField.tsx
 * Formula: (Annual Gross Income / Purchase Price) × 100
 */
export const calculateAnnualGrossYield = (property: ClientProperty): number => {
  const annualGrossIncome = calculateAnnualGrossIncome(property)
  const purchasePrice = property.generalInformation?.purchasePrice || 0

  if (!purchasePrice) return 0
  return (annualGrossIncome / purchasePrice) * 100
}

/**
 * Calculate Loan Amount
 * Backend ref: src/fields/hooks/useLoanAmount.ts
 * Formula: Purchase Price - Deposit Cash - Equity Release
 */
export const calculateLoanAmount = (property: ClientProperty): number => {
  const purchasePrice = property.generalInformation?.purchasePrice || 0
  const depositCash = property.valueProposition?.purchaseCost?.depositCash || 0
  const equityRelease = property.valueProposition?.purchaseCost?.equityRelease || 0

  return purchasePrice - depositCash - equityRelease
}

/**
 * Calculate Property Management Fees
 * Backend ref: src/fields/hooks/usePropertyManagementFees.ts
 * Formula: (Current Weekly Rent × 52) × (PM Percentage / 100)
 */
export const calculatePropertyManagementFees = (property: ClientProperty): number => {
  const currentWeeklyRent = property.dueDiligence?.currentWeeklyRent || 0
  const pmPercentage = property.valueProposition?.annualExpenses?.pmPercentage || 0

  const annualRent = currentWeeklyRent * 52
  return (annualRent * pmPercentage) / 100
}

/**
 * Calculate Loan Repayments
 * Backend ref: src/fields/hooks/useLoanRepayments.ts
 * Complex formula involving loan amount, interest rates, and loan term
 */
export const calculateLoanRepayments = (property: ClientProperty): number => {
  const loanAmount = calculateLoanAmount(property)
  const interestRate = property.valueProposition?.purchaseCost?.interestRate || 0
  const equityRelease = property.valueProposition?.purchaseCost?.equityRelease || 0
  const equityReleaseRate = property.valueProposition?.purchaseCost?.equityReleaseInterestRate || 0
  const loanTerm = property.valueProposition?.purchaseCost?.loanTerm || 30

  // Principal loan repayments
  const principalLoan = loanAmount - equityRelease
  const monthlyRate = interestRate / 100 / 12
  const numPayments = loanTerm * 12

  let principalRepayments = 0
  if (monthlyRate > 0 && numPayments > 0) {
    principalRepayments =
      (principalLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
  }

  // Equity release interest-only repayments
  const equityRepayments = (equityRelease * equityReleaseRate) / 100 / 12

  // Return annual amount
  return (principalRepayments + equityRepayments) * 12
}

/**
 * Calculate Total Purchase Cost
 * Backend ref: src/fields/hooks/useTotalPurchaseCost.ts
 * Formula: Purchase Price + all additional costs + (LMI / Loan Term)
 */
export const calculateTotalPurchaseCost = (property: ClientProperty): number => {
  const purchasePrice = property.generalInformation?.purchasePrice || 0
  const stampDuty = property.valueProposition?.purchaseCost?.stampDuty || 0
  const renovationsCost = property.valueProposition?.purchaseCost?.renovationsCost || 0
  const buildingAndPest = property.valueProposition?.purchaseCost?.buildingAndPest || 0
  const conveyancing = property.valueProposition?.purchaseCost?.conveyancing || 0
  const bankFees = property.valueProposition?.purchaseCost?.bankFees || 0
  const lendersMortgageInsurance =
    property.valueProposition?.purchaseCost?.lendersMortgageInsurance || 0
  const loanTerm = property.valueProposition?.purchaseCost?.loanTerm || 30

  const lmiAnnual = loanTerm ? lendersMortgageInsurance / loanTerm : 0

  return (
    purchasePrice +
    stampDuty +
    renovationsCost +
    buildingAndPest +
    conveyancing +
    bankFees +
    lmiAnnual
  )
}

/**
 * Calculate Annual Total Expenses
 * Backend ref: src/fields/hooks/useAnnualTotalExpenses.ts
 * Formula: All annual expenses + PM fees + loan repayments + (LMI / Loan Term)
 */
export const calculateAnnualTotalExpenses = (property: ClientProperty): number => {
  const councilRates = property.valueProposition?.annualExpenses?.councilRates || 0
  const insuranceCosts = property.valueProposition?.annualExpenses?.insuranceCosts || 0
  const utilities = property.valueProposition?.annualExpenses?.utilities || 0
  const repairsMaintenance = property.valueProposition?.annualExpenses?.repairsAndMaintenance || 0
  const lendersMortgageInsurance =
    property.valueProposition?.purchaseCost?.lendersMortgageInsurance || 0
  const loanTerm = property.valueProposition?.purchaseCost?.loanTerm || 30

  const pmFees = calculatePropertyManagementFees(property)
  const loanRepayments = calculateLoanRepayments(property)
  const lmiAnnual = loanTerm ? lendersMortgageInsurance / loanTerm : 0

  return (
    councilRates +
    insuranceCosts +
    utilities +
    repairsMaintenance +
    pmFees +
    loanRepayments +
    lmiAnnual
  )
}

/**
 * Calculate Annual Net Income
 * Backend ref: src/fields/hooks/useAnnualNetIncome.ts
 * Formula: Annual Gross Income - Annual Total Expenses
 */
export const calculateAnnualNetIncome = (property: ClientProperty): number => {
  const annualGrossIncome = calculateAnnualGrossIncome(property)
  const annualTotalExpenses = calculateAnnualTotalExpenses(property)

  return annualGrossIncome - annualTotalExpenses
}

/**
 * Calculate Annual Net Yield
 * Backend ref: src/fields/AnnualNetYieldField.tsx
 * Formula: (Annual Net Income / Purchase Price) × 100
 */
export const calculateAnnualNetYield = (property: ClientProperty): number => {
  const annualNetIncome = calculateAnnualNetIncome(property)
  const purchasePrice = property.generalInformation?.purchasePrice || 0

  if (!purchasePrice) return 0
  return (annualNetIncome / purchasePrice) * 100
}

/**
 * Calculate Equity at various growth rates
 * Backend ref: EquityAt*DisplayField.tsx components
 */
export const calculateEquityAt8 = (property: ClientProperty): number => {
  const purchasePrice = property.generalInformation?.purchasePrice || 0
  return purchasePrice * 0.08
}

export const calculateEquityAt10 = (property: ClientProperty): number => {
  const purchasePrice = property.generalInformation?.purchasePrice || 0
  return purchasePrice * 0.1
}

export const calculateEquityAt12 = (property: ClientProperty): number => {
  const purchasePrice = property.generalInformation?.purchasePrice || 0
  return purchasePrice * 0.12
}

export const calculateEquityAt16 = (property: ClientProperty): number => {
  const purchasePrice = property.generalInformation?.purchasePrice || 0
  return purchasePrice * 0.16
}

/**
 * Calculate Deposit Total
 * Formula: Deposit Cash + Equity Release
 */
export const calculateDepositTotal = (property: ClientProperty): number => {
  const depositCash = property.valueProposition?.purchaseCost?.depositCash || 0
  const equityRelease = property.valueProposition?.purchaseCost?.equityRelease || 0
  return depositCash + equityRelease
}

/**
 * Calculate Deposit Percentage
 * Formula: (Deposit Total / Purchase Price) × 100
 */
export const calculateDepositPercentage = (property: ClientProperty): number => {
  const purchasePrice = property.generalInformation?.purchasePrice || 0
  const depositTotal = calculateDepositTotal(property)

  if (!purchasePrice) return 0
  return (depositTotal / purchasePrice) * 100
}

/**
 * Format number as percentage with 2 decimal places
 * Used consistently across yield calculations
 */
export const formatAsPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`
}

/**
 * Format number as currency (AUD)
 * Used consistently across monetary calculations
 */
export const formatAsCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Comprehensive calculation object for a property
 * Returns all calculated values in one place for easy access
 */
export const calculateAllPropertyMetrics = (property: ClientProperty) => {
  return {
    // Income calculations
    annualGrossIncome: calculateAnnualGrossIncome(property),
    annualNetIncome: calculateAnnualNetIncome(property),

    // Yield calculations
    annualGrossYield: calculateAnnualGrossYield(property),
    annualNetYield: calculateAnnualNetYield(property),

    // Cost calculations
    loanAmount: calculateLoanAmount(property),
    totalPurchaseCost: calculateTotalPurchaseCost(property),
    annualTotalExpenses: calculateAnnualTotalExpenses(property),
    propertyManagementFees: calculatePropertyManagementFees(property),
    loanRepayments: calculateLoanRepayments(property),

    // Equity calculations
    equityAt8: calculateEquityAt8(property),
    equityAt10: calculateEquityAt10(property),
    equityAt12: calculateEquityAt12(property),
    equityAt16: calculateEquityAt16(property),

    // Formatted strings (matching backend display format)
    formatted: {
      annualGrossYield: formatAsPercentage(calculateAnnualGrossYield(property)),
      annualNetYield: formatAsPercentage(calculateAnnualNetYield(property)),
      annualGrossIncome: formatAsCurrency(calculateAnnualGrossIncome(property)),
      annualNetIncome: formatAsCurrency(calculateAnnualNetIncome(property)),
      totalPurchaseCost: formatAsCurrency(calculateTotalPurchaseCost(property)),
      annualTotalExpenses: formatAsCurrency(calculateAnnualTotalExpenses(property)),
      equityAt8: formatAsCurrency(calculateEquityAt8(property)),
      equityAt10: formatAsCurrency(calculateEquityAt10(property)),
      equityAt12: formatAsCurrency(calculateEquityAt12(property)),
      equityAt16: formatAsCurrency(calculateEquityAt16(property)),
    },
  }
}
