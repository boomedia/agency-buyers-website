'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { useTotalPurchaseCost } from '@/fields/hooks/useTotalPurchaseCost'
import { CustomField } from '@/fields/CustomField'

const TotalPurchaseCostDisplayField = ({ field }: TextFieldClientProps) => {
  const totalPurchaseCost = useTotalPurchaseCost()

  return (
    <CustomField field={field}>
      <strong>Total Purchase Cost:</strong> ${totalPurchaseCost.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
    </CustomField>
  )
}

export default TotalPurchaseCostDisplayField
