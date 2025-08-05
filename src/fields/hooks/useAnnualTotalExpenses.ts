'use client'
import { useWatchForm } from '@payloadcms/ui'
import { useLoanRepayments } from '@/fields/hooks/useLoanRepayments'
import { usePropertyManagementFees } from '@/fields/hooks/usePropertyManagementFees'

export const useAnnualTotalExpenses = () => {
  const form = useWatchForm()
  const councilRates = form.getField('valProp.annualExp.councilRates')?.value as number
  const insuranceCosts = form.getField('valProp.annualExp.insuranceCosts')?.value as number
  const utilities = form.getField('valProp.annualExp.utilities')?.value as number
  const repairsAndMaintenance = form.getField('valProp.annualExp.repairsMaintenance')
    ?.value as number
  const lendersMortgageInsurance = form.getField('valProp.purchCost.lendersInsurance')
    ?.value as number
  const loanTerm = form.getField('valProp.purchCost.loanTerm')?.value as number

  const loanRepayments = useLoanRepayments()
  const propertyManagementFees = usePropertyManagementFees()

  // LMI divided by loan term for annual portion
  const lmiAnnual = (loanTerm ?? 1) > 0 ? (lendersMortgageInsurance ?? 0) / (loanTerm ?? 1) : 0

  return (
    (councilRates ?? 0) +
    (insuranceCosts ?? 0) +
    (utilities ?? 0) +
    propertyManagementFees +
    (repairsAndMaintenance ?? 0) +
    lmiAnnual +
    loanRepayments
  )
}
