'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { usePropertyManagementFees } from '@/fields/hooks/usePropertyManagementFees'
import { CustomField } from '@/fields/CustomField'

const PropertyManagementFeesDisplayField = ({ field }: TextFieldClientProps) => {
  const managementFees = usePropertyManagementFees()

  return (
    <CustomField field={field}>
      <strong>Property Management Fees:</strong> ${managementFees.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
    </CustomField>
  )
}

export default PropertyManagementFeesDisplayField
