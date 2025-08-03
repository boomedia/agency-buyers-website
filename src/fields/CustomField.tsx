'use client'

import React, { PropsWithChildren } from 'react'
import { TextFieldClient } from 'payload'
import { FieldDescription } from '@/fields/FieldDescription'

interface Props {
  field?: Omit<TextFieldClient, 'type'> & Partial<Pick<TextFieldClient, 'type'>>
}

export const CustomField = ({ children, field }: PropsWithChildren<Props>) => {
  const description = field?.admin?.description

  return (
    <div className="field-type" style={{ flex: '1 1 auto' }}>
      <div>{children}</div>
      {description && <FieldDescription>{description as string}</FieldDescription>}
    </div>
  )
}
