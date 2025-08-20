import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
  properties: '/properties',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug?: string
  id?: string | number
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, id }: Props) => {
  // Handle empty slug for pages - default to 'home' for the home page
  const finalSlug = !slug && collection === 'pages' ? 'home' : slug

  // For properties, use ID instead of slug
  let identifier = finalSlug
  if (collection === 'properties' && id) {
    identifier = String(id)
  }

  // Generate the correct path based on collection and identifier
  let path = `${collectionPrefixMap[collection]}/`
  if (finalSlug === 'home' && collection === 'pages') {
    path = '/' // Home page path is just '/'
  } else if (identifier) {
    path = `${collectionPrefixMap[collection]}/${identifier}`
  }

  const params: Record<string, string> = {
    collection,
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  }

  // Add slug or id based on collection
  if (collection === 'properties' && id) {
    params.id = String(id)
  } else if (identifier) {
    params.slug = identifier
  }

  const encodedParams = new URLSearchParams(params)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
