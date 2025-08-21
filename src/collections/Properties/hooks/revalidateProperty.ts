import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Property } from '@/payload-types'

export const revalidateProperty: CollectionAfterChangeHook<Property> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/properties/${doc.id}`

    payload.logger.info(`Revalidating property at path: ${path}`)

    // Defer revalidation to avoid Next.js 15 render-time restriction
    setTimeout(() => {
      try {
        revalidatePath(path)
        revalidateTag('properties')
      } catch (error) {
        payload.logger.error(`Failed to revalidate property ${doc.id}:`, error)
      }
    }, 0)
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Property> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/properties/${doc.id}`

    // Defer revalidation to avoid Next.js 15 render-time restriction
    setTimeout(() => {
      try {
        revalidatePath(path)
        revalidateTag('properties')
      } catch (error) {
        console.error(`Failed to revalidate deleted property ${doc.id}:`, error)
      }
    }, 0)
  }

  return doc
}
