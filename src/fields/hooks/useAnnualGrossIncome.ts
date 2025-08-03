'use client'

import { useWatchForm } from '@payloadcms/ui'

export const useAnnualGrossIncome = () => {
  const form = useWatchForm()
  const expectedWeeklyRent = form.getField('valueProposition.expectedResults.expectedWeeklyRent')
    .value as number

  return (expectedWeeklyRent ?? 0) * 52
}
