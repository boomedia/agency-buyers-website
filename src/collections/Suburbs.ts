import type { CollectionConfig } from 'payload'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Suburbs: CollectionConfig<'suburbs'> = {
  slug: 'suburbs',
  admin: {
    useAsTitle: 'name',
    group: 'Real Estate',
    preview: (data, { req }) =>
      generatePreviewPath({
        id: typeof data?.id === 'string' || typeof data?.id === 'number' ? data.id : undefined,
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
    region: true,
    heroImage: true,
    vacancyRate: true,
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
        const convertEmptyStrings = (obj: any): any => {
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
            const result: any = {}
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
