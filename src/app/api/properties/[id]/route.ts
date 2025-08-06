import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { transformPropertyData } from '@/utilities/transformPropertyData'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })

    const property = await payload.findByID({
      collection: 'properties',
      id,
      depth: 2,
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Transform the property data to match the expected interface
    const transformedProperty = transformPropertyData(property)

    return NextResponse.json(transformedProperty)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
