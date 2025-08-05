'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { useWatchForm } from '@payloadcms/ui'
import { useAnnualGrossIncome } from '@/fields/hooks/useAnnualGrossIncome'
import { CustomField } from '@/fields/CustomField'

const AnnualGrossYieldField = ({ field }: TextFieldClientProps) => {
  const form = useWatchForm()

  const purchasePriceField = form.getField('info.purchasePrice')
  const purchasePrice = purchasePriceField?.value as number

  const annualGrossIncome = useAnnualGrossIncome()
  const grossYield = purchasePrice ? (annualGrossIncome / purchasePrice) * 100 : 0

  return (
    <CustomField field={field}>
      <strong>Annual Gross Yield:</strong> {grossYield.toFixed(2)}%
    </CustomField>
  )
}

export default AnnualGrossYieldField
