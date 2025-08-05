'use client'
import { useWatchForm } from '@payloadcms/ui'
import { useLoanAmount } from '@/fields/hooks/useLoanAmount'

export const useLoanRepayments = () => {
  const form = useWatchForm()
  const loanAmount = useLoanAmount()
  const interestRate = form.getField('valProp.purchCost.interestRate')?.value as number
  const equityRelease = form.getField('valProp.purchCost.equityRelease')?.value as number
  const equityReleaseRate = form.getField('valProp.purchCost.equityReleaseRate')?.value as number
  const depositCash = form.getField('valProp.purchCost.depositCash')?.value as number
  const loanTerm = form.getField('valProp.purchCost.loanTerm')?.value as number

  // Calculate loan repayments based on the formula:
  // (Loan Amount - Equity Release × Interest Rate) + (Loan Amount - Deposit Cash × Equity Release Interest Rate) / Loan Term
  const loanMinusEquity = loanAmount - (equityRelease ?? 0)
  const loanMinusDeposit = loanAmount - (depositCash ?? 0)

  const interestOnLoan = (loanMinusEquity * (interestRate ?? 0)) / 100
  const interestOnEquity = (loanMinusDeposit * (equityReleaseRate ?? 0)) / 100

  const totalInterest = interestOnLoan + interestOnEquity

  return (loanTerm ?? 1) > 0 ? totalInterest / (loanTerm ?? 1) : totalInterest
}
