'use client';

import React from 'react';
import { useWatchForm } from '@payloadcms/ui';
import { useAnnualNetIncome } from '@/fields/hooks/useAnnualNetIncome'
import { CustomField } from '@/fields/CustomField'
import type { TextFieldClientProps } from 'payload'

const AnnualNetYieldField = ({ field }: TextFieldClientProps) => {
  const form = useWatchForm();
  const annualNetIncome = useAnnualNetIncome();
  const purchasePrice = form.getField('generalInformation.purchasePrice').value as number;

  const annualNetYield = purchasePrice ? (annualNetIncome / purchasePrice) * 100 : 0;

  return (
    <CustomField field={field}>
      <strong>Annual Net Yield:</strong> {annualNetYield.toFixed(2)}%
    </CustomField>
  )
};

export default AnnualNetYieldField;
