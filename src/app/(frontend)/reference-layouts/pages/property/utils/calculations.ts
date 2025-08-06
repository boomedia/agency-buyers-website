/**
 * Property calculation utilities
 * Handles all financial calculations for property data
 */

import type { PropertyApiResponse } from '~/domains/property/types';

// Helper functions to calculate derived values
export const calculateDepositPercentage = (property: PropertyApiResponse) => {
  const depositTotal = property.valueProposition.purchaseCost.depositCash + property.valueProposition.purchaseCost.equityRelease;
  const purchasePrice = property.generalInformation.purchasePrice;
  return ((depositTotal / purchasePrice) * 100).toFixed(1) + '%';
};

export const calculateLoanAmount = (property: PropertyApiResponse) => {
  const purchasePrice = property.generalInformation.purchasePrice;
  const depositCash = property.valueProposition.purchaseCost.depositCash;
  const equityRelease = property.valueProposition.purchaseCost.equityRelease;
  return purchasePrice - depositCash - equityRelease;
};

export const calculatePropertyManagementFees = (property: PropertyApiResponse) => {
  const pmPercentage = property.valueProposition.annualExpenses.pmPercentage;
  const expectedWeeklyRent = property.valueProposition.expectedResults.expectedWeeklyRent;
  return ((pmPercentage / 100) * expectedWeeklyRent) * 52;
};

export const calculateAnnualGrossIncome = (property: PropertyApiResponse) => {
  const expectedWeeklyRent = property.valueProposition.expectedResults.expectedWeeklyRent;
  return expectedWeeklyRent * 52;
};

export const calculateAnnualGrossYield = (property: PropertyApiResponse) => {
  const annualGrossIncome = calculateAnnualGrossIncome(property);
  const purchasePrice = property.generalInformation.purchasePrice;
  return ((annualGrossIncome / purchasePrice) * 100).toFixed(2) + '%';
};

export const calculateLoanRepayments = (property: PropertyApiResponse) => {
  const loanAmount = calculateLoanAmount(property);
  const interestRate = property.valueProposition.purchaseCost.interestRate / 100 / 12; // Monthly rate
  const loanTermMonths = property.valueProposition.purchaseCost.loanTerm * 12;

  // Calculate monthly payment using loan formula: P * [r(1+r)^n] / [(1+r)^n - 1]
  const monthlyPayment = loanAmount * (interestRate * Math.pow(1 + interestRate, loanTermMonths)) / (Math.pow(1 + interestRate, loanTermMonths) - 1);

  // Annual loan repayments
  return monthlyPayment * 12;
};

export const calculateTotalAnnualExpenses = (property: PropertyApiResponse) => {
  const expenses = property.valueProposition.annualExpenses;
  return expenses.councilRates +
    expenses.insuranceCosts +
    expenses.utilities +
    calculatePropertyManagementFees(property) +
    expenses.repairsAndMaintenance +
    calculateLoanRepayments(property);
};

export const calculateAnnualNetIncome = (property: PropertyApiResponse) => {
  const annualGrossIncome = calculateAnnualGrossIncome(property);
  const totalExpenses = calculateTotalAnnualExpenses(property);
  return annualGrossIncome - totalExpenses;
};

export const calculateAnnualNetYield = (property: PropertyApiResponse) => {
  const annualNetIncome = calculateAnnualNetIncome(property);
  const purchasePrice = property.generalInformation.purchasePrice;
  return ((annualNetIncome / purchasePrice) * 100).toFixed(2) + '%';
};

export const calculateEquityAt8 = (property: PropertyApiResponse) => {
  return property.generalInformation.purchasePrice * 0.08;
};

export const calculateEquityAt10 = (property: PropertyApiResponse) => {
  return property.generalInformation.purchasePrice * 0.10;
};

export const calculateEquityAt12 = (property: PropertyApiResponse) => {
  return property.generalInformation.purchasePrice * 0.12;
};

export const calculateEquityAt16 = (property: PropertyApiResponse) => {
  return property.generalInformation.purchasePrice * 0.16;
};

export const calculateTotalPurchaseCost = (property: PropertyApiResponse) => {
  const costs = property.valueProposition.purchaseCost;
  return property.generalInformation.purchasePrice +
    costs.stampDuty +
    costs.renovationsCost +
    costs.buildingAndPest +
    costs.conveyancing +
    costs.bankFees +
    costs.lendersMortgageInsurance;
};
