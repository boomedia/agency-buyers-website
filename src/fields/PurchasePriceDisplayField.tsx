'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { useWatchForm } from '@payloadcms/ui'
import { CustomField } from '@/fields/CustomField'

const PurchasePriceDisplayField = ({ field }: TextFieldClientProps) => {
  const form = useWatchForm()
  const purchasePriceField = form.getField('info.purchasePrice')
  const purchasePrice = purchasePriceField?.value as number

  return (
    <CustomField field={field}>
      <strong>Purchase Price:</strong> $
      {(purchasePrice || 0).toLocaleString('en-AU', { minimumFractionDigits: 2 })}
    </CustomField>
  )
}

export default PurchasePriceDisplayField
