import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      // Defer revalidation to avoid Next.js 15 render-time restriction
      setTimeout(() => {
        try {
          revalidatePath(path)
          revalidateTag('posts-sitemap')
        } catch (error) {
          payload.logger.error(`Failed to revalidate post ${doc.slug}:`, error)
        }
      }, 0)
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      // Defer revalidation to avoid Next.js 15 render-time restriction
      setTimeout(() => {
        try {
          revalidatePath(oldPath)
          revalidateTag('posts-sitemap')
        } catch (error) {
          payload.logger.error(`Failed to revalidate old post ${previousDoc.slug}:`, error)
        }
      }, 0)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/posts/${doc?.slug}`

    // Defer revalidation to avoid Next.js 15 render-time restriction
    setTimeout(() => {
      try {
        revalidatePath(path)
        revalidateTag('posts-sitemap')
      } catch (error) {
        console.error(`Failed to revalidate deleted post ${doc?.slug}:`, error)
      }
    }, 0)
  }

  return doc
}
