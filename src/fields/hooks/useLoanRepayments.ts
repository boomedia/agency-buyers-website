'use client'
import { useWatchForm } from '@payloadcms/ui'
import { useLoanAmount } from '@/fields/hooks/useLoanAmount'

export const useLoanRepayments = () => {
  const form = useWatchForm();
  const loanAmount = useLoanAmount();
  const interestRate = form.getField('valueProposition.purchaseCost.interestRate').value as number;
  const equityRelease = form.getField('valueProposition.purchaseCost.equityRelease').value as number;
  const equityReleaseRate = form.getField('valueProposition.purchaseCost.equityReleaseInterestRate').value as number;
  const depositCash = form.getField('valueProposition.purchaseCost.depositCash').value as number;
  const loanTerm = form.getField('valueProposition.purchaseCost.loanTerm').value as number;

  // Calculate loan repayments based on the formula:
  // (Loan Amount - Equity Release × Interest Rate) + (Loan Amount - Deposit Cash × Equity Release Interest Rate) / Loan Term
  const loanMinusEquity = loanAmount - (equityRelease ?? 0);
  const loanMinusDeposit = loanAmount - (depositCash ?? 0);
  
  const interestOnLoan = (loanMinusEquity * (interestRate ?? 0)) / 100;
  const interestOnEquity = (loanMinusDeposit * (equityReleaseRate ?? 0)) / 100;
  
  const totalInterest = interestOnLoan + interestOnEquity;
  
  return (loanTerm ?? 1) > 0 ? totalInterest / (loanTerm ?? 1) : totalInterest;
}
