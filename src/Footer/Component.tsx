import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer, CompanySetting, Media } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return (
      <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
        <div className="container py-8">
          <div className="text-center text-sm text-gray-400">Agency Buyers Footer</div>
        </div>
      </footer>
    )
  }

  const footerData: Footer = (await getCachedGlobal('footer', 1)()) as Footer

  // Try to get company settings, but don't fail if they're not available
  let companySettings: CompanySetting | null = null
  try {
    companySettings = (await getCachedGlobal('company-settings', 1)()) as CompanySetting
  } catch (error) {
    console.warn('Company settings not available, using fallback logos', error)
  }

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo
            alwaysLight={true}
            logoLight={companySettings?.logo as Media}
            logoDark={companySettings?.logoDarkmode as Media}
            companyName={companySettings?.companyName}
          />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
