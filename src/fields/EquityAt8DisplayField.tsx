'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { useWatchForm } from '@payloadcms/ui'
import { CustomField } from '@/fields/CustomField'

const EquityAt8DisplayField = ({ field }: TextFieldClientProps) => {
  const form = useWatchForm()
  const purchasePriceField = form.getField('generalInformation.purchasePrice')
  const purchasePrice = purchasePriceField?.value as number

  const equity = (purchasePrice || 0) * 0.08

  return (
    <CustomField field={field}>
      <strong>Equity at 8%:</strong> ${equity.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
    </CustomField>
  )
}

export default EquityAt8DisplayField
