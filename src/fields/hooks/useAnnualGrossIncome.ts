'use client'

import { useWatchForm } from '@payloadcms/ui'

export const useAnnualGrossIncome = () => {
  const form = useWatchForm()
  const expectedWeeklyRentField = form.getField('valProp.expResults.expectedRent')
  const expectedWeeklyRent = expectedWeeklyRentField?.value as number

  return (expectedWeeklyRent ?? 0) * 52
}
