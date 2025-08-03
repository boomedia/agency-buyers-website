'use client'
import { useWatchForm } from '@payloadcms/ui'

export const usePropertyManagementFees = () => {
  const form = useWatchForm();
  const weeklyRent = form.getField('dueDiligence.currentWeeklyRent').value as number;
  const managementPercentage = form.getField('valueProposition.annualExpenses.pmPercentage').value as number;

  const annualRent = (weeklyRent ?? 0) * 52;
  return (annualRent * (managementPercentage ?? 0)) / 100;
}
