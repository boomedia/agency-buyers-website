'use client';

import React from 'react';
import type { TextFieldClientProps } from 'payload'
import { useAnnualGrossIncome } from '@/fields/hooks/useAnnualGrossIncome'
import { CustomField } from '@/fields/CustomField'

const AnnualGrossIncomeField = ({ field }: TextFieldClientProps) => {
  const annualIncome = useAnnualGrossIncome()

  return (
    <CustomField field={field}>
      <strong>Annual Gross Income:</strong> {annualIncome.toFixed(2)} AUD
    </CustomField>
  );
};

export default AnnualGrossIncomeField;
