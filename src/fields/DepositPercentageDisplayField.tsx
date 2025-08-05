'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { useWatchForm } from '@payloadcms/ui'
import { CustomField } from '@/fields/CustomField'

const DepositPercentageDisplayField = ({ field }: TextFieldClientProps) => {
  const form = useWatchForm()
  const purchasePriceField = form.getField('info.purchasePrice')
  const depositCashField = form.getField('valProp.purchCost.depositCash')
  const equityReleaseField = form.getField('valProp.purchCost.equityRelease')

  const purchasePrice = purchasePriceField?.value as number
  const depositCash = depositCashField?.value as number
  const equityRelease = equityReleaseField?.value as number

  const depositTotal = (depositCash || 0) + (equityRelease || 0)
  const depositPercentage = purchasePrice ? (depositTotal / purchasePrice) * 100 : 0

  return (
    <CustomField field={field}>
      <strong>Deposit Percentage:</strong> {depositPercentage.toFixed(2)}%
    </CustomField>
  )
}

export default DepositPercentageDisplayField
