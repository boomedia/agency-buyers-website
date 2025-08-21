import { createLocalReq, getPayload } from 'payload'
import { seed } from '@/endpoints/seed'
import config from '@payload-config'
import { headers } from 'next/headers'

export const maxDuration = 60 // This function can run for a maximum of 60 seconds

export async function POST(): Promise<Response> {
  try {
    const payload = await getPayload({ config })
    const requestHeaders = await headers()

    // Authenticate by passing request headers
    const { user } = await payload.auth({ headers: requestHeaders })

    if (!user) {
      payload.logger.warn('Seed endpoint accessed without authentication')
      return new Response('Action forbidden.', { status: 403 })
    }

    payload.logger.info(`Seed endpoint accessed by user: ${user.id}`)

    // Create a Payload request object to pass to the Local API for transactions
    // At this point you should pass in a user, locale, and any other context you need for the Local API
    const payloadReq = await createLocalReq({ user }, payload)

    await seed({ payload, req: payloadReq })

    payload.logger.info('Seeding completed successfully')
    return Response.json({ success: true })
  } catch (e) {
    console.error('Detailed seed error:', e)
    const payload = await getPayload({ config }).catch(() => null)
    if (payload) {
      payload.logger.error({ err: e, message: 'Error seeding data' })
    }
    return new Response(`Error seeding data: ${e instanceof Error ? e.message : String(e)}`, {
      status: 500,
    })
  }
}
