'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { useLoanRepayments } from '@/fields/hooks/useLoanRepayments'
import { CustomField } from '@/fields/CustomField'

const LoanRepaymentsDisplayField = ({ field }: TextFieldClientProps) => {
  const loanRepayments = useLoanRepayments()

  return (
    <CustomField field={field}>
      <strong>Loan Repayments:</strong> ${loanRepayments.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
    </CustomField>
  )
}

export default LoanRepaymentsDisplayField
