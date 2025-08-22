import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Suburb } from '@/payload-types'
import { SuburbDetails } from './page.client'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const querySuburbBySlug = cache(async ({ slug }: { slug: string }): Promise<Suburb | null> => {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return null
  }

  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'suburbs',
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

    return (result.docs[0] as Suburb) || null
  } catch (error) {
    console.error('Error fetching suburb:', error)
    return null
  }
})

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  if (!slug) {
    return {
      title: 'Suburb Not Found',
    }
  }

  try {
    const suburb = await querySuburbBySlug({ slug })

    if (!suburb) {
      return {
        title: 'Suburb Not Found',
      }
    }

    return {
      title: suburb.name,
      description: `Information about ${suburb.name} suburb`,
      openGraph: {
        title: suburb.name,
        description: `Information about ${suburb.name} suburb`,
        images:
          typeof suburb.heroImage === 'object' && suburb.heroImage?.url
            ? [
                {
                  url: suburb.heroImage.url,
                  alt: suburb.heroImage.alt || suburb.name,
                },
              ]
            : [],
      },
    }
  } catch (_error) {
    return {
      title: 'Suburb Not Found',
    }
  }
}

export default async function SuburbPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise

  if (!slug) {
    notFound()
  }

  const url = `/suburbs/${slug}`
  let suburb: Suburb | null = null

  try {
    suburb = await querySuburbBySlug({ slug })
  } catch (error) {
    console.error('Error fetching suburb:', error)
  }

  if (!suburb) {
    return <PayloadRedirects url={url} />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <SuburbDetails suburb={suburb} />
    </>
  )
}
