'use client'
import { useWatchForm } from '@payloadcms/ui'

export const useTotalPurchaseCost = () => {
  const form = useWatchForm()
  const purchasePrice = form.getField('info.purchasePrice')?.value as number
  const stampDuty = form.getField('valProp.purchCost.stampDuty')?.value as number
  const renovationsCost = form.getField('valProp.purchCost.renovationsCost')?.value as number
  const buildingAndPest = form.getField('valProp.purchCost.buildingAndPest')?.value as number
  const conveyancing = form.getField('valProp.purchCost.conveyancing')?.value as number
  const bankFees = form.getField('valProp.purchCost.bankFees')?.value as number
  const lendersMortgageInsurance = form.getField('valProp.purchCost.lendersInsurance')
    ?.value as number
  const loanTerm = form.getField('valProp.purchCost.loanTerm')?.value as number

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
