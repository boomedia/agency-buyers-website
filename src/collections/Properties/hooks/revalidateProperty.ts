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

    revalidatePath(path)
    revalidateTag('properties')
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Property> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/properties/${doc.id}`

    revalidatePath(path)
    revalidateTag('properties')
  }

  return doc
}
