import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { transformPropertyData } from '@/utilities/transformPropertyData'
import PropertiesClient from './page.client'
import type { Property as PayloadProperty, Region, Suburb } from '@/payload-types'
import type { Property as ClientProperty } from '~/types/payload-types'

// Helper function to get image URL
const getImageUrl = (url: string) => {
  if (!url) return ''
  return url.startsWith('http') ? url : `https://bat.hassen.com.au${url}`
}

const queryProperties = cache(async (): Promise<ClientProperty[]> => {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return []
  }

  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'properties',
      depth: 2,
      limit: 100, // Increased limit for filtering
    })

    // Transform each property to match client interface
    return result.docs.map((property: PayloadProperty) => transformPropertyData(property))
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
  }
})

const queryRegions = cache(async (): Promise<Region[]> => {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return []
  }

  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'regions',
      depth: 1,
      limit: 100,
    })

    return result.docs as Region[]
  } catch (error) {
    console.error('Error fetching regions:', error)
    return []
  }
})

const querySuburbs = cache(async (): Promise<Suburb[]> => {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return []
  }

  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'suburbs',
      depth: 2, // Include region data
      limit: 500,
    })

    return result.docs as Suburb[]
  } catch (error) {
    console.error('Error fetching suburbs:', error)
    return []
  }
})

export default async function PropertiesPage() {
  const [properties, regions, suburbs] = await Promise.all([
    queryProperties(),
    queryRegions(),
    querySuburbs(),
  ])

  if (!properties || properties.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Properties</h1>
        <p className="text-gray-600">No properties available at the moment.</p>
      </div>
    )
  }

  return <PropertiesClient properties={properties} regions={regions} suburbs={[]} />
}
