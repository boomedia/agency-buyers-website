import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  // Handle empty slug for pages - default to 'home' for the home page
  const finalSlug = !slug && collection === 'pages' ? 'home' : slug

  // Generate the correct path based on collection and slug
  let path = `${collectionPrefixMap[collection]}/`
  if (finalSlug === 'home' && collection === 'pages') {
    path = '/' // Home page path is just '/'
  } else if (finalSlug) {
    path = `${collectionPrefixMap[collection]}/${finalSlug}`
  }

  const encodedParams = new URLSearchParams({
    slug: finalSlug,
    collection,
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
