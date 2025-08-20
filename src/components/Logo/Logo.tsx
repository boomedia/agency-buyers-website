import clsx from 'clsx'
import React from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  logoLight?: Media | null
  logoDark?: Media | null
  companyName?: string | null
  alwaysLight?: boolean // For footer which is always on dark background
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    logoLight,
    logoDark,
    companyName,
    alwaysLight = false,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  // Convert priority string to boolean for Media component
  const priorityBoolean = priority === 'high'

  // Debug logging
  console.log('Logo Debug:', {
    hasLogoLight: !!logoLight?.url,
    hasLogoDark: !!logoDark?.url,
    alwaysLight,
    logoLightUrl: logoLight?.url,
    logoDarkUrl: logoDark?.url,
  })

  // If we have company logos from database, use them
  if (logoLight?.url || logoDark?.url) {
    // If alwaysLight is true (footer), only show light logo
    if (alwaysLight && logoLight?.url) {
      return (
        <div className={clsx('max-w-[9.375rem] w-full h-[34px] relative', className)}>
          <MediaComponent
            resource={logoLight}
            loading={loading}
            priority={priorityBoolean}
            className="w-full h-full object-contain"
            alt={companyName || 'Company Logo'}
          />
        </div>
      )
    }

    // For header - responsive logo switching
    return (
      <div className={clsx('max-w-[9.375rem] w-full h-[34px] relative', className)}>
        {/* Show appropriate logo based on theme */}
        {logoDark?.url && (
          <MediaComponent
            resource={logoDark}
            loading={loading}
            priority={priorityBoolean}
            className="w-full h-full object-contain block dark:hidden"
            alt={companyName || 'Company Logo'}
          />
        )}
        {logoLight?.url && (
          <MediaComponent
            resource={logoLight}
            loading={loading}
            priority={priorityBoolean}
            className="w-full h-full object-contain hidden dark:block"
            alt={`${companyName || 'Company'} Logo Light`}
          />
        )}
      </div>
    )
  }

  // Fallback to public directory logos
  return (
    <div className={clsx('max-w-[9.375rem] w-full h-[34px] relative', className)}>
      {/* If alwaysLight, only show light logo */}
      {alwaysLight ? (
        <Image
          src="/buyers-agency-logo-light.svg"
          alt={companyName || 'Buyers Agency Logo'}
          width={193}
          height={34}
          loading={loading}
          priority={priorityBoolean}
          className="w-full h-full object-contain"
        />
      ) : (
        <>
          {/* Dark logo - shows in light mode, hidden in dark mode */}
          <Image
            src="/buyers-agency-logo-dark.svg"
            alt={companyName || 'Buyers Agency Logo'}
            width={193}
            height={34}
            loading={loading}
            priority={priorityBoolean}
            className="w-full h-full object-contain block dark:hidden"
          />
          {/* Light logo - hidden in light mode, visible in dark mode */}
          <Image
            src="/buyers-agency-logo-light.svg"
            alt={`${companyName || 'Buyers Agency'} Logo Light`}
            width={193}
            height={34}
            loading={loading}
            priority={priorityBoolean}
            className="w-full h-full object-contain hidden dark:block"
          />
        </>
      )}
    </div>
  )
}
