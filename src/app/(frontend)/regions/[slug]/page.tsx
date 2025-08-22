import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Region } from '@/payload-types'
import { RegionDetails } from './page.client'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const queryRegionBySlug = cache(async ({ slug }: { slug: string }): Promise<Region | null> => {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return null
  }

  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'regions',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      draft,
      overrideAccess: draft,
      depth: 2,
    })

    return (result.docs[0] as Region) || null
  } catch (error) {
    console.error('Error fetching region:', error)
    return null
  }
})

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  if (!slug) {
    return {
      title: 'Region Not Found',
    }
  }

  try {
    const region = await queryRegionBySlug({ slug })

    if (!region) {
      return {
        title: 'Region Not Found',
      }
    }

    return {
      title: region.name,
      description: `Information about ${region.name} region`,
      openGraph: {
        title: region.name,
        description: `Information about ${region.name} region`,
        images:
          typeof region.heroImage === 'object' && region.heroImage?.url
            ? [
                {
                  url: region.heroImage.url,
                  alt: region.heroImage.alt || region.name,
                },
              ]
            : [],
      },
    }
  } catch (_error) {
    return {
      title: 'Region Not Found',
    }
  }
}

export default async function RegionPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise

  if (!slug) {
    notFound()
  }

  const url = `/regions/${slug}`
  let region: Region | null = null

  try {
    region = await queryRegionBySlug({ slug })
  } catch (error) {
    console.error('Error fetching region:', error)
  }

  if (!region) {
    return <PayloadRedirects url={url} />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <RegionDetails region={region} />
    </>
  )
}
