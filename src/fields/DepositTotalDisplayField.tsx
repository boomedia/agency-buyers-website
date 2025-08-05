'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { useWatchForm } from '@payloadcms/ui'
import { CustomField } from '@/fields/CustomField'

const DepositTotalDisplayField = ({ field }: TextFieldClientProps) => {
  const form = useWatchForm()
  const depositCashField = form.getField('valueProposition.purchaseCost.depositCash')
  const equityReleaseField = form.getField('valueProposition.purchaseCost.equityRelease')

  const depositCash = depositCashField?.value as number
  const equityRelease = equityReleaseField?.value as number

  const depositTotal = (depositCash || 0) + (equityRelease || 0)

  return (
    <CustomField field={field}>
      <strong>Deposit Total:</strong> $
      {depositTotal.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
    </CustomField>
  )
}

export default DepositTotalDisplayField
