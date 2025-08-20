'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  // Manually add the "Properties" link
  const propertiesLink = {
    link: {
      type: 'custom' as const,
      url: '/properties',
      label: 'Properties',
      newTab: false,
    }
  }

  const allNavItems = [...navItems, propertiesLink];

  return (
    <nav className="flex gap-3 items-center">
      {allNavItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
