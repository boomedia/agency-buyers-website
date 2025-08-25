import type { CollectionConfig } from 'payload'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

type WhereQuery = {
  id?:
    | {
        in?: unknown[]
      }
    | string
    | number
  and?: WhereQuery[]
  or?: WhereQuery[]
  [key: string]: unknown
}

export const Regions: CollectionConfig<'regions'> = {
  slug: 'regions',
  admin: {
    useAsTitle: 'name',
    group: 'Real Estate',
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : undefined,
        collection: 'regions',
        req,
      }),
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultPopulate: {
    name: true,
    slug: true,
    heroImage: true,
    description: true,
    video: true,
    communityEconomicLandscape: true,
    infrastructureFutureDevelopment: true,
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    beforeDelete: [
      ({ req }) => {
        // Filter out empty string IDs from delete queries to prevent PostgreSQL errors
        const filterEmptyIds = (where: WhereQuery): WhereQuery => {
          if (!where) return where

          // Handle the case where 'id' is in an 'in' array
          if (
            where.id &&
            typeof where.id === 'object' &&
            'in' in where.id &&
            Array.isArray(where.id.in)
          ) {
            where.id.in = where.id.in.filter((id: unknown) => {
              return id !== '' && id !== null && id !== undefined && String(id).trim() !== ''
            })

            // If no valid IDs remain, prevent the delete operation
            if (where.id.in.length === 0) {
              throw new Error('No valid IDs provided for deletion')
            }
          }

          // Handle the case where 'id' is a direct value
          if (where.id && typeof where.id === 'string' && where.id.trim() === '') {
            throw new Error('Invalid empty ID provided for deletion')
          }

          // Handle nested 'and' conditions
          if (where.and && Array.isArray(where.and)) {
            where.and = where.and.map(filterEmptyIds).filter(Boolean)
          }

          // Handle nested 'or' conditions
          if (where.or && Array.isArray(where.or)) {
            where.or = where.or.map(filterEmptyIds).filter(Boolean)
          }

          return where
        }

        if (req.query && req.query.where) {
          req.query.where = filterEmptyIds(req.query.where as WhereQuery)
        }

        return true
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Region Name',
      admin: {
        description: 'Region Name also called Local Government Area LGA',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'Slug',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly version of the region name',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[^a-z0-9_-]/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      label: 'Region Hero Image',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Region Description',
    },
    {
      name: 'video',
      type: 'text',
      label: 'Region Video',
      admin: {
        description: 'Video URL (supports YouTube, Vimeo, and Loom)',
      },
    },
    {
      name: 'communityEconomicLandscape',
      type: 'array',
      label: 'Community & Economic Landscape',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Image',
          relationTo: 'media',
        },
        {
          name: 'icon',
          type: 'upload',
          label: 'Icon',
          relationTo: 'media',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Description',
        },
      ],
    },
    {
      name: 'infrastructureFutureDevelopment',
      type: 'array',
      label: 'Infrastructure & Future Development',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Image',
          relationTo: 'media',
        },
        {
          name: 'icon',
          type: 'upload',
          label: 'Icon',
          relationTo: 'media',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Description',
        },
      ],
    },
  ],
}
