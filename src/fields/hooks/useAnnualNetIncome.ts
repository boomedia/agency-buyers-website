'use client'

import { useAnnualGrossIncome } from '@/fields/hooks/useAnnualGrossIncome'
import { useAnnualTotalExpenses } from '@/fields/hooks/useAnnualTotalExpenses'

export const useAnnualNetIncome = () => {
  const annualGrossIncome = useAnnualGrossIncome()
  const annualTotalExpenses = useAnnualTotalExpenses()

  return annualGrossIncome - annualTotalExpenses
}
