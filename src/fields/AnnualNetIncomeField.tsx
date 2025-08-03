'use client';

import React from 'react';
import type { TextFieldClientProps } from 'payload'
import { useAnnualNetIncome } from '@/fields/hooks/useAnnualNetIncome'
import { CustomField } from '@/fields/CustomField'

const AnnualNetIncomeField = ({ field }: TextFieldClientProps) => {
  const annualNetIncome = useAnnualNetIncome();

  return (
    <CustomField field={field}>
      <strong>Annual Net Income:</strong> {annualNetIncome.toFixed(2)} AUD
    </CustomField>
  );
};

export default AnnualNetIncomeField;
