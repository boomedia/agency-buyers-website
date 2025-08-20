import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { EnhancedPropertyDetails } from './page.client'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import { transformPropertyData } from '@/utilities/transformPropertyData'
import type { Property as PayloadProperty } from '@/payload-types'
import type { Property as ClientProperty } from '~/types/payload-types'

type Args = {
  params: Promise<{
    id?: string
  }>
}

const queryPropertyById = cache(async ({ id }: { id: string }): Promise<ClientProperty | null> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  try {
    const result = (await payload.findByID({
      collection: 'properties',
      id,
      draft,
      overrideAccess: draft,
      depth: 2,
    })) as PayloadProperty

    return transformPropertyData(result)
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
})

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { id } = await paramsPromise
  if (!id) {
    return {
      title: 'Property Not Found',
    }
  }

  try {
    const property = await queryPropertyById({ id })

    if (!property) {
      return {
        title: 'Property Not Found',
      }
    }

    // Use SEO meta fields if available, otherwise fallback to property data
    const title = (property as any).meta?.title || property.name
    const description =
      (property as any).meta?.description ||
      `Property details for ${property.name} - ${property.generalInformation.address.streetAddress}`

    return {
      title,
      description,
      // Add more meta fields as needed
      openGraph: {
        title,
        description,
        images: (property as any).meta?.image?.url
          ? [
              {
                url: (property as any).meta.image.url,
                alt: (property as any).meta.image.alt || property.name,
              },
            ]
          : property.generalInformation.heroImage?.url
            ? [
                {
                  url: property.generalInformation.heroImage.url,
                  alt: property.generalInformation.heroImage.alt || property.name,
                },
              ]
            : [],
      },
    }
  } catch (error) {
    return {
      title: 'Property Not Found',
    }
  }
}

export default async function PropertyPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { id } = await paramsPromise

  if (!id) {
    notFound()
  }

  const url = `/properties/${id}`
  let property: ClientProperty | null = null

  try {
    property = await queryPropertyById({ id })
  } catch (error) {
    console.error('Error fetching property:', error)
  }

  if (!property) {
    return <PayloadRedirects url={url} />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <EnhancedPropertyDetails property={property} />
    </>
  )
}
