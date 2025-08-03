import { CollectionConfig } from 'payload'

export const Suburbs: CollectionConfig = {
  slug: 'suburbs',
  admin: {
    useAsTitle: 'name',
    group: 'Real Estate',
  },
  access: {
    read: () => true,
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
