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

export const Suburbs: CollectionConfig<'suburbs'> = {
  slug: 'suburbs',
  admin: {
    useAsTitle: 'name',
    group: 'Real Estate',
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : undefined,
        collection: 'suburbs',
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
    region: true,
    heroImage: true,
    vacancyRate: true,
    description: true,
    medianValueByYear: true,
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Convert empty strings and invalid number values to null for number fields to prevent PostgreSQL errors
        const convertEmptyStrings = (obj: unknown): unknown => {
          if (obj === '' || obj === '-' || obj === null || obj === undefined) return null

          // Handle invalid number strings that could cause JSON parsing errors
          if (typeof obj === 'string') {
            // Check if it's supposed to be a number but has invalid format
            const trimmed = obj.trim()
            if (trimmed === '' || trimmed === '-' || trimmed === '.' || /^-+$/.test(trimmed)) {
              return null
            }
            // If it's a number string with just a minus or invalid format, return null
            if (/^-?\.?$/.test(trimmed) || /^-+\.?$/.test(trimmed)) {
              return null
            }
          }

          if (Array.isArray(obj)) return obj.map(convertEmptyStrings)
          if (obj && typeof obj === 'object') {
            const result: Record<string, unknown> = {}
            for (const [key, value] of Object.entries(obj)) {
              result[key] = convertEmptyStrings(value)
            }
            return result
          }
          return obj
        }

        return convertEmptyStrings(data)
      },
    ],
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
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Suburb Name',
          admin: {
            width: '40%',
          },
        },
        {
          name: 'region',
          type: 'relationship',
          label: 'Region',
          relationTo: 'regions',
          required: true,
          admin: {
            width: '40%',
            description: 'Suburbs are in Regions',
          },
        },
        {
          name: 'vacancyRate',
          type: 'number',
          label: 'Vacancy Rate (%)',
          admin: {
            width: '20%',
            description: 'Vacancy rate as a percentage (e.g., 0.7 for 0.7%)',
            step: 0.01,
          },
        },
      ],
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
        description: 'URL-friendly version of the suburb name',
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
      label: 'Suburb Hero Image',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Suburb Description',
    },
    {
      name: 'medianValueByYear',
      type: 'array',
      label: 'Suburb Median Value by Year',
      fields: [
        {
          name: 'year',
          type: 'number',
          label: 'Year',
          required: true,
        },
        {
          name: 'medianValue',
          type: 'number',
          label: 'Median Value',
          admin: {
            description: 'Median Value in AUD Currency',
            step: 0.01,
          },
          required: true,
        },
      ],
    },
  ],
}
