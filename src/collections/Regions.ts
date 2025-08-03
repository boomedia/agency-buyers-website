import { CollectionConfig } from 'payload'

export const Regions: CollectionConfig = {
  slug: 'regions',
  admin: {
    useAsTitle: 'name',
    group: 'Real Estate',
  },
  access: {
    read: () => true,
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
        description: 'Video URL',
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
