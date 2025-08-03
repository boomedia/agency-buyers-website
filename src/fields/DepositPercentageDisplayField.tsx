'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { useWatchForm } from '@payloadcms/ui'
import { CustomField } from '@/fields/CustomField'

const DepositPercentageDisplayField = ({ field }: TextFieldClientProps) => {
  const form = useWatchForm()
  const purchasePrice = form.getField('generalInformation.purchasePrice').value as number
  const depositCash = form.getField('valueProposition.purchaseCost.depositCash').value as number
  const equityRelease = form.getField('valueProposition.purchaseCost.equityRelease').value as number
  
  const depositTotal = (depositCash || 0) + (equityRelease || 0)
  const depositPercentage = purchasePrice ? (depositTotal / purchasePrice) * 100 : 0

  return (
    <CustomField field={field}>
      <strong>Deposit Percentage:</strong> {depositPercentage.toFixed(2)}%
    </CustomField>
  )
}

export default DepositPercentageDisplayField
