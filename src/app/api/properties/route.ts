import { NextResponse } from 'next/server'

export async function GET() {
  // Skip during build time when database is not available
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    return NextResponse.json({
      docs: [],
      totalDocs: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 10,
      nextPage: null,
      page: 1,
      pagingCounter: 1,
      prevPage: null,
      totalPages: 1,
    })
  }

  const { env } = await import('~/env')
  const { CMS_API_BASE_URL, CMS_API_TOKEN } = env
  const apiUrl = `${CMS_API_BASE_URL}/properties?depth=1`

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `users API-Key ${CMS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `API Error: ${response.status} ${errorText}` },
        { status: response.status },
      )
    }

    const properties = await response.json()
    return NextResponse.json(properties)
  } catch (error) {
    return NextResponse.json({ error: 'Fetch Error' }, { status: 500 })
  }
}
