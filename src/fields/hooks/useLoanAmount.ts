'use client'

import { useWatchForm } from '@payloadcms/ui'

export const useLoanAmount = () => {
  const form = useWatchForm()
  const purchasePrice = form.getField('info.purchasePrice')?.value as number
  const depositCash = form.getField('valProp.purchCost.depositCash')?.value as number
  const equityRelease = form.getField('valProp.purchCost.equityRelease')?.value as number

  return (purchasePrice ?? 0) - (depositCash ?? 0) - (equityRelease ?? 0)
}
