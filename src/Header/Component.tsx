import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header, CompanySetting } from '@/payload-types'

export async function Header() {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return (
      <header className="container relative z-20 py-8 lg:py-8">
        <div className="flex justify-between">
          <div>Header (Database disabled during build)</div>
        </div>
      </header>
    )
  }

  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return (
      <div className="bg-theme-elevation-50 border-b border-theme-elevation-100">
        <div className="container py-3">
          <div className="font-medium">Agency Buyers Header</div>
        </div>
      </div>
    )
  }

  const headerData: Header = (await getCachedGlobal('header', 1)()) as Header

  // Try to get company settings, but don't fail if they're not available
  let companySettings: CompanySetting | null = null
  try {
    companySettings = (await getCachedGlobal('company-settings', 1)()) as CompanySetting
  } catch (error) {
    console.warn('Company settings not available, using fallback logos', error)
  }

  return <HeaderClient data={headerData} companySettings={companySettings} />
}
