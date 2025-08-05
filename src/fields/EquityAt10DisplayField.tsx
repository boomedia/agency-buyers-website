'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { useWatchForm } from '@payloadcms/ui'
import { CustomField } from '@/fields/CustomField'

const EquityAt10DisplayField = ({ field }: TextFieldClientProps) => {
  const form = useWatchForm()
  const purchasePriceField = form.getField('generalInformation.purchasePrice')
  const purchasePrice = purchasePriceField?.value as number

  const calculateEquity = () => {
    const purchase = Number(purchasePrice) || 0
    return purchase * 0.1
  }

  return (
    <CustomField field={field}>
      <strong>Equity at 10%:</strong> $
      {calculateEquity().toLocaleString('en-AU', { minimumFractionDigits: 2 })}
    </CustomField>
  )
}

export default EquityAt10DisplayField
