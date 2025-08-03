'use client'

import { useWatchForm } from '@payloadcms/ui'

export const useLoanAmount = () => {
  const form = useWatchForm()
  const purchasePrice = form.getField('generalInformation.purchasePrice').value as number
  const depositCash = form.getField('valueProposition.purchaseCost.depositCash').value as number
  const equityRelease = form.getField('valueProposition.purchaseCost.equityRelease').value as number

  return (purchasePrice ?? 0) - (depositCash ?? 0) - (equityRelease ?? 0)
}
