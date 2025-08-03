'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { useAnnualTotalExpenses } from '@/fields/hooks/useAnnualTotalExpenses'
import { CustomField } from '@/fields/CustomField'

const TotalAnnualExpensesDisplayField = ({ field }: TextFieldClientProps) => {
  const totalAnnualExpenses = useAnnualTotalExpenses()

  return (
    <CustomField field={field}>
      <strong>Total Annual Expenses:</strong> ${totalAnnualExpenses.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
    </CustomField>
  )
}

export default TotalAnnualExpensesDisplayField
