'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { useLoanAmount } from '@/fields/hooks/useLoanAmount'
import { CustomField } from '@/fields/CustomField'

const LoanAmountDisplayField = ({ field }: TextFieldClientProps) => {
  const loanAmount = useLoanAmount()

  return (
    <CustomField field={field}>
      <strong>Loan Amount:</strong> $
      {loanAmount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
    </CustomField>
  )
}

export default LoanAmountDisplayField
