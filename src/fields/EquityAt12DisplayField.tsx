'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { useWatchForm } from '@payloadcms/ui'
import { CustomField } from '@/fields/CustomField'

const EquityAt12DisplayField = ({ field }: TextFieldClientProps) => {
  const form = useWatchForm()
  const purchasePriceField = form.getField('info.purchasePrice')
  const purchasePrice = purchasePriceField?.value as number

  const calculateEquity = () => {
    const purchase = Number(purchasePrice) || 0
    return purchase * 0.12
  }

  return (
    <CustomField field={field}>
      <strong>Equity at 12%:</strong> $
      {calculateEquity().toLocaleString('en-AU', { minimumFractionDigits: 2 })}
    </CustomField>
  )
}

export default EquityAt12DisplayField
