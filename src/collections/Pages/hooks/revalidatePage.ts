import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)

      // Defer revalidation to avoid Next.js 15 render-time restriction
      setTimeout(() => {
        try {
          revalidatePath(path)
          revalidateTag('pages-sitemap')
        } catch (error) {
          payload.logger.error(`Failed to revalidate page ${doc.slug}:`, error)
        }
      }, 0)
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      // Defer revalidation to avoid Next.js 15 render-time restriction
      setTimeout(() => {
        try {
          revalidatePath(oldPath)
          revalidateTag('pages-sitemap')
        } catch (error) {
          payload.logger.error(`Failed to revalidate old page ${previousDoc.slug}:`, error)
        }
      }, 0)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`

    // Defer revalidation to avoid Next.js 15 render-time restriction
    setTimeout(() => {
      try {
        revalidatePath(path)
        revalidateTag('pages-sitemap')
      } catch (error) {
        console.error(`Failed to revalidate deleted page ${doc?.slug}:`, error)
      }
    }, 0)
  }

  return doc
}
