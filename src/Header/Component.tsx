import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header, CompanySetting } from '@/payload-types'

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()

  // Try to get company settings, but don't fail if they're not available
  let companySettings: CompanySetting | null = null
  try {
    companySettings = (await getCachedGlobal('company-settings', 1)()) as CompanySetting
  } catch (error) {
    console.warn('Company settings not available, using fallback logos', error)
  }

  return <HeaderClient data={headerData} companySettings={companySettings} />
}
