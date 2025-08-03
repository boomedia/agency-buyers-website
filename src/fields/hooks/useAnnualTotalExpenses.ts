'use client'
import { useWatchForm } from '@payloadcms/ui'
import { useLoanRepayments } from '@/fields/hooks/useLoanRepayments'
import { usePropertyManagementFees } from '@/fields/hooks/usePropertyManagementFees'

export const useAnnualTotalExpenses = () => {
  const form = useWatchForm();
  const councilRates = form.getField('valueProposition.annualExpenses.councilRates').value as number;
  const insuranceCosts = form.getField('valueProposition.annualExpenses.insuranceCosts').value as number;
  const utilities = form.getField('valueProposition.annualExpenses.utilities').value as number;
  const repairsAndMaintenance = form.getField('valueProposition.annualExpenses.repairsAndMaintenance').value as number;
  const lendersMortgageInsurance = form.getField('valueProposition.purchaseCost.lendersMortgageInsurance').value as number;
  const loanTerm = form.getField('valueProposition.purchaseCost.loanTerm').value as number;
  
  const loanRepayments = useLoanRepayments();
  const propertyManagementFees = usePropertyManagementFees();
  
  // LMI divided by loan term for annual portion
  const lmiAnnual = (loanTerm ?? 1) > 0 ? (lendersMortgageInsurance ?? 0) / (loanTerm ?? 1) : 0;

  return (councilRates ?? 0) + 
         (insuranceCosts ?? 0) + 
         (utilities ?? 0) + 
         propertyManagementFees + 
         (repairsAndMaintenance ?? 0) + 
         lmiAnnual + 
         loanRepayments;
}
