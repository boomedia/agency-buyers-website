'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { useWatchForm } from '@payloadcms/ui'
import { CustomField } from '@/fields/CustomField'

const EquityAt16DisplayField = ({ field }: TextFieldClientProps) => {
  const form = useWatchForm()
  const purchasePrice = form.getField('generalInformation.purchasePrice').value as number

  const calculateEquity = () => {
    const purchase = Number(purchasePrice) || 0
    return purchase * 0.16
  }

  return (
    <CustomField field={field}>
      <strong>Equity at 16%:</strong> ${calculateEquity().toLocaleString('en-AU', { minimumFractionDigits: 2 })}
    </CustomField>
  )
}

export default EquityAt16DisplayField
