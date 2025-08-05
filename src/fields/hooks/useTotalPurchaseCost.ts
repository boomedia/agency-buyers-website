'use client'
import { useWatchForm } from '@payloadcms/ui'

export const useTotalPurchaseCost = () => {
  const form = useWatchForm()
  const purchasePrice = form.getField('generalInformation.purchasePrice')?.value as number
  const stampDuty = form.getField('valueProposition.purchaseCost.stampDuty')?.value as number
  const renovationsCost = form.getField('valueProposition.purchaseCost.renovationsCost')
    ?.value as number
  const buildingAndPest = form.getField('valueProposition.purchaseCost.buildingAndPest')
    ?.value as number
  const conveyancing = form.getField('valueProposition.purchaseCost.conveyancing')?.value as number
  const bankFees = form.getField('valueProposition.purchaseCost.bankFees')?.value as number
  const lendersMortgageInsurance = form.getField(
    'valueProposition.purchaseCost.lendersMortgageInsurance',
  )?.value as number
  const loanTerm = form.getField('valueProposition.purchaseCost.loanTerm')?.value as number

  const lmiAnnual = loanTerm && lendersMortgageInsurance ? lendersMortgageInsurance / loanTerm : 0

  return (
    (purchasePrice ?? 0) +
    (stampDuty ?? 0) +
    (renovationsCost ?? 0) +
    (buildingAndPest ?? 0) +
    (conveyancing ?? 0) +
    (bankFees ?? 0) +
    lmiAnnual
  )
}
