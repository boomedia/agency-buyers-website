import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { property1 } from './property-1'
import { property2 } from './property-2'
import { regionBundaberg } from './region-bundaberg'
import { suburbBundabergEast } from './suburb-bundaberg-east'
import {
  propertyHeroImage,
  propertyImage1,
  propertyImage2,
  propertyImage3,
  comparableImage1,
  comparableImage2,
  comparableImage3,
  easementImage,
  floodImage,
  bushfireImage,
  publicHousingImage,
  bundabergHeroImage,
  communityImage,
  economicImage,
  employmentImage,
  hospitalIcon,
  newHomesImage,
  suburbHeroImage,
} from './property-images'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
  'properties',
  'regions',
  'suburbs',
  'buyers-access',
]

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [],
      },
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [],
      },
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    }),
  ])

  // Delete collections sequentially to avoid deadlocks, especially for related collections
  payload.logger.info(`— Clearing collections sequentially...`)

  // Delete in reverse dependency order: properties first, then suburbs, then regions
  const collectionsToDelete = [
    'buyers-access', // Delete buyers-access first (has foreign key to properties)
    'properties', // Delete properties second (has foreign keys to suburbs/regions)
    'suburbs', // Delete suburbs third (has foreign key to regions)
    'regions', // Delete regions fourth (no dependencies)
    'categories', // Then other collections
    'media',
    'pages',
    'posts',
    'forms',
    'form-submissions',
    'search',
  ]

  for (const collection of collectionsToDelete) {
    if (collections.includes(collection as any)) {
      try {
        await payload.db.deleteMany({ collection: collection as any, req, where: {} })
        payload.logger.info(`   ✓ Cleared ${collection}`)
        // Small delay to prevent database contention
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        payload.logger.warn(`   ⚠ Could not clear ${collection}:`, error)
      }
    }
  }

  // Delete versions sequentially as well
  for (const collection of collectionsToDelete) {
    if (collections.includes(collection as any)) {
      const collectionConfig = payload.collections[collection as CollectionSlug]
      if (collectionConfig?.config.versions) {
        try {
          await payload.db.deleteVersions({ collection: collection as any, req, where: {} })
          payload.logger.info(`   ✓ Cleared ${collection} versions`)
          // Small delay to prevent database contention
          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (error) {
          payload.logger.warn(`   ⚠ Could not clear ${collection} versions:`, error)
        }
      }
    }
  }

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [
    image1Buffer,
    image2Buffer,
    image3Buffer,
    hero1Buffer,
    propertyHeroBuffer,
    propertyImage1Buffer,
    propertyImage2Buffer,
    propertyImage3Buffer,
    comparable1Buffer,
    comparable2Buffer,
    comparable3Buffer,
    easementBuffer,
    floodBuffer,
    bushfireBuffer,
    publicHousingBuffer,
    bundabergHeroBuffer,
    communityBuffer,
    economicBuffer,
    employmentBuffer,
    hospitalIconBuffer,
    newHomesBuffer,
    suburbHeroBuffer,
  ] = await Promise.allSettled([
    // Original blog post images - keep existing PayloadCMS template images
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
      'image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
      'image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
      'image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
      'image-hero1.webp',
    ),
    // Property images - realistic real estate photos from Picsum
    fetchFileByURL('https://picsum.photos/800/600?random=1', 'property-hero.jpg'),
    fetchFileByURL('https://picsum.photos/800/600?random=2', 'property-image-1.jpg'),
    fetchFileByURL('https://picsum.photos/800/600?random=3', 'property-image-2.jpg'),
    fetchFileByURL('https://picsum.photos/800/600?random=4', 'property-image-3.jpg'),
    // Comparable properties - different angles/styles
    fetchFileByURL('https://picsum.photos/800/600?random=5', 'comparable-1.jpg'),
    fetchFileByURL('https://picsum.photos/800/600?random=6', 'comparable-2.jpg'),
    fetchFileByURL('https://picsum.photos/800/600?random=7', 'comparable-3.jpg'),
    // Zone maps - wider landscape format for maps
    fetchFileByURL('https://picsum.photos/1200/800?random=8', 'easement-map.jpg'),
    fetchFileByURL('https://picsum.photos/1200/800?random=9', 'flood-map.jpg'),
    fetchFileByURL('https://picsum.photos/1200/800?random=10', 'bushfire-map.jpg'),
    fetchFileByURL('https://picsum.photos/1200/800?random=11', 'public-housing-map.jpg'),
    // Region and suburb hero images - panoramic format
    fetchFileByURL('https://picsum.photos/1600/900?random=12', 'bundaberg-hero.jpg'),
    fetchFileByURL('https://picsum.photos/600/400?random=13', 'community-infographic.jpg'),
    fetchFileByURL('https://picsum.photos/600/400?random=14', 'economic-infographic.jpg'),
    fetchFileByURL('https://picsum.photos/600/400?random=15', 'employment-infographic.jpg'),
    // Icon - smaller square format
    fetchFileByURL('https://picsum.photos/400/400?random=16', 'hospital-icon.jpg'),
    fetchFileByURL('https://picsum.photos/1200/800?random=17', 'new-homes-development.jpg'),
    fetchFileByURL('https://picsum.photos/1600/900?random=18', 'suburb-hero.jpg'),
  ]).then((results) => {
    // Handle settled promises and provide fallbacks for failed requests
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        payload.logger.warn(`Failed to fetch image at index ${index}:`, result.reason)
        // Return a simple fallback buffer for failed images
        return createFallbackImage(`fallback-${index}.jpg`)
      }
    })
  })

  const [
    demoAuthor,
    image1Doc,
    image2Doc,
    image3Doc,
    imageHomeDoc,
    propertyHeroDoc,
    propertyImage1Doc,
    propertyImage2Doc,
    propertyImage3Doc,
    comparable1Doc,
    comparable2Doc,
    comparable3Doc,
    easementDoc,
    floodDoc,
    bushfireDoc,
    publicHousingDoc,
    bundabergHeroDoc,
    communityDoc,
    economicDoc,
    employmentDoc,
    hospitalIconDoc,
    newHomesDoc,
    suburbHeroDoc,
  ] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),
    // Property-related images
    payload.create({
      collection: 'media',
      data: propertyHeroImage,
      file: propertyHeroBuffer,
    }),
    payload.create({
      collection: 'media',
      data: propertyImage1,
      file: propertyImage1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: propertyImage2,
      file: propertyImage2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: propertyImage3,
      file: propertyImage3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: comparableImage1,
      file: comparable1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: comparableImage2,
      file: comparable2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: comparableImage3,
      file: comparable3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: easementImage,
      file: easementBuffer,
    }),
    payload.create({
      collection: 'media',
      data: floodImage,
      file: floodBuffer,
    }),
    payload.create({
      collection: 'media',
      data: bushfireImage,
      file: bushfireBuffer,
    }),
    payload.create({
      collection: 'media',
      data: publicHousingImage,
      file: publicHousingBuffer,
    }),
    payload.create({
      collection: 'media',
      data: bundabergHeroImage,
      file: bundabergHeroBuffer,
    }),
    payload.create({
      collection: 'media',
      data: communityImage,
      file: communityBuffer,
    }),
    payload.create({
      collection: 'media',
      data: economicImage,
      file: economicBuffer,
    }),
    payload.create({
      collection: 'media',
      data: employmentImage,
      file: employmentBuffer,
    }),
    payload.create({
      collection: 'media',
      data: hospitalIcon,
      file: hospitalIconBuffer,
    }),
    payload.create({
      collection: 'media',
      data: newHomesImage,
      file: newHomesBuffer,
    }),
    payload.create({
      collection: 'media',
      data: suburbHeroImage,
      file: suburbHeroBuffer,
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Technology',
        breadcrumbs: [
          {
            label: 'Technology',
            url: '/technology',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'News',
        breadcrumbs: [
          {
            label: 'News',
            url: '/news',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Finance',
        breadcrumbs: [
          {
            label: 'Finance',
            url: '/finance',
          },
        ],
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Design',
        breadcrumbs: [
          {
            label: 'Design',
            url: '/design',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Software',
        breadcrumbs: [
          {
            label: 'Software',
            url: '/software',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Engineering',
        breadcrumbs: [
          {
            label: 'Engineering',
            url: '/engineering',
          },
        ],
      },
    }),
  ])

  payload.logger.info(`— Seeding regions and suburbs...`)

  // Create region first
  let bundabergRegionDoc
  try {
    bundabergRegionDoc = await payload.create({
      collection: 'regions',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: regionBundaberg({
        heroImage: bundabergHeroDoc,
        communityImage: communityDoc,
        economicImage: economicDoc,
        employmentImage: employmentDoc,
        hospitalIcon: hospitalIconDoc,
        newHomesImage: newHomesDoc,
      }),
    })
    payload.logger.info(`   ✓ Created Bundaberg region`)
  } catch (error) {
    payload.logger.error(`Failed to create region:`, error)
    throw error
  }

  // Create suburb with region reference
  let bundabergEastSuburbDoc
  try {
    bundabergEastSuburbDoc = await payload.create({
      collection: 'suburbs',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: suburbBundabergEast({
        heroImage: suburbHeroDoc,
        region: bundabergRegionDoc,
      }),
    })
    payload.logger.info(`   ✓ Created Bundaberg East suburb`)
  } catch (error) {
    payload.logger.error(`Failed to create suburb:`, error)
    throw error
  }

  payload.logger.info(`— Seeding properties...`)

  // Create property with all references
  let property1Doc
  try {
    property1Doc = await payload.create({
      collection: 'properties',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: property1({
        heroImage: propertyHeroDoc,
        image1: propertyImage1Doc,
        image2: propertyImage2Doc,
        image3: propertyImage3Doc,
        suburbDoc: bundabergEastSuburbDoc,
        regionDoc: bundabergRegionDoc,
        agentImage1: propertyImage1Doc,
        agentImage2: propertyImage2Doc,
        agentImage3: propertyImage3Doc,
        comparableImage1: comparable1Doc,
        comparableImage2: comparable2Doc,
        comparableImage3: comparable3Doc,
        easementImage: easementDoc,
        floodImage: floodDoc,
        bushfireImage: bushfireDoc,
        publicHousingImage: publicHousingDoc,
      }),
    })
    payload.logger.info(`   ✓ Created property 1: ${property1Doc.name}`)
  } catch (error) {
    payload.logger.error(`Failed to create property 1:`, error)
    throw error
  }

  let property2Doc
  try {
    property2Doc = await payload.create({
      collection: 'properties',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: property2({
        heroImage: propertyImage2Doc,
        image1: propertyImage3Doc,
        suburbDoc: bundabergEastSuburbDoc,
        regionDoc: bundabergRegionDoc,
        comparableImage1: comparable1Doc,
        easementImage: easementDoc,
        floodImage: floodDoc,
      }),
    })
    payload.logger.info(`   ✓ Created property 2: ${property2Doc.name}`)
  } catch (error) {
    payload.logger.error(`Failed to create property 2:`, error)
    throw error
  }

  payload.logger.info(`— Seeding buyers access accounts...`)

  // Create buyers access accounts with property portfolios
  const buyersAccessData = [
    {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: 'password123',
      properties: [property1Doc.id, property2Doc.id], // Both properties - Experienced investor
    },
    {
      email: 'sarah.wilson@example.com',
      name: 'Sarah Wilson',
      password: 'password123',
      properties: [property1Doc.id], // First property only - New investor focused on flood-affected area
    },
    {
      email: 'michael.chen@example.com',
      name: 'Michael Chen',
      password: 'password123',
      properties: [property2Doc.id], // Second property only - Prefers low-maintenance/vacant properties
    },
    {
      email: 'emma.thompson@example.com',
      name: 'Emma Thompson',
      password: 'password123',
      properties: [property1Doc.id], // First property only - Interested in value-add renovations
    },
    {
      email: 'david.johnson@example.com',
      name: 'David Johnson',
      password: 'password123',
      properties: [], // No properties yet - Prospective buyer evaluating options
    },
  ]

  for (const buyerData of buyersAccessData) {
    try {
      const buyerDoc = await payload.create({
        collection: 'buyers-access',
        depth: 0,
        context: {
          disableRevalidate: true,
        },
        data: buyerData,
      })
      payload.logger.info(`   ✓ Created buyer: ${buyerDoc.name} (${buyerDoc.email})`)
    } catch (error) {
      payload.logger.error(`Failed to create buyer ${buyerData.name}:`, error)
    }
  }

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Admin',
              url: '/admin',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Source Code',
              newTab: true,
              url: 'https://github.com/payloadcms/payload/tree/main/templates/website',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Payload',
              newTab: true,
              url: 'https://payloadcms.com/',
            },
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

function createFallbackImage(filename: string): File {
  // Create a simple 1x1 pixel transparent PNG as fallback
  const transparentPng = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
    0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
    0x42, 0x60, 0x82,
  ])

  return {
    name: filename,
    data: transparentPng,
    mimetype: 'image/png',
    size: transparentPng.length,
  }
}

async function fetchFileByURL(url: string, customName?: string): Promise<File> {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        credentials: 'include',
        method: 'GET',
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
      }

      const data = await res.arrayBuffer()
      const defaultName = url.split('/').pop() || `file-${Date.now()}`
      const fileName = customName || defaultName

      // Determine MIME type from filename extension
      const extension = fileName.split('.').pop()?.toLowerCase() || 'jpg'
      let mimeType = 'image/jpeg' // default

      if (extension === 'webp') {
        mimeType = 'image/webp'
      } else if (extension === 'png') {
        mimeType = 'image/png'
      } else if (extension === 'jpg' || extension === 'jpeg') {
        mimeType = 'image/jpeg'
      }

      return {
        name: fileName,
        data: Buffer.from(data),
        mimetype: mimeType,
        size: data.byteLength,
      }
    } catch (error) {
      lastError = error as Error

      if (attempt < maxRetries) {
        // Wait before retrying, with exponential backoff
        const delay = Math.pow(2, attempt - 1) * 1000 // 1s, 2s, 4s
        console.log(`Attempt ${attempt} failed for ${url}, retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  // If all retries failed, throw the last error
  throw lastError || new Error(`Failed to fetch file from ${url} after ${maxRetries} attempts`)
}
