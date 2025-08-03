import { GlobalConfig } from 'payload'

export const CompanySettings: GlobalConfig = {
  slug: 'company-settings',
  label: 'Company Settings',
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      required: true,
      label: 'Company Name',
    },
    {
      name: 'motto',
      type: 'text',
      label: 'Motto',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      admin: {
        description: 'Rich Text Description',
      },
    },
    {
      name: 'disclaimer',
      type: 'textarea',
      label: 'Disclaimer',
    },
    {
      name: 'logo',
      type: 'upload',
      label: 'Logo',
      relationTo: 'media',
      admin: {
        description: 'Image SVG or PNG',
      },
    },
    {
      name: 'logoDarkmode',
      type: 'upload',
      label: 'Logo Darkmode',
      relationTo: 'media',
      admin: {
        description: 'Image SVG or PNG',
      },
    },
    {
      name: 'corporateVideo',
      type: 'text',
      label: 'Corporate Video',
      admin: {
        description: 'Video URL',
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      label: 'Favicon',
      relationTo: 'media',
      admin: {
        description: 'Image SVG or PNG',
      },
    },
    {
      name: 'faviconDarkmode',
      type: 'upload',
      label: 'Favicon Darkmode',
      relationTo: 'media',
      admin: {
        description: 'Image SVG or PNG',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
      admin: {
        description: 'AU Phone Number',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      admin: {
        description: 'Email Address',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Address',
      admin: {
        description: 'AU Postal address',
      },
    },
    {
      name: 'abn',
      type: 'text',
      label: 'ABN',
      admin: {
        description: 'ABN Number',
      },
    },
    {
      name: 'acn',
      type: 'text',
      label: 'ACN',
      admin: {
        description: 'ACN Number',
      },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website',
      admin: {
        description: 'URL',
      },
    },
    {
      name: 'socialMedia',
      type: 'array',
      label: 'Social Media',
      admin: {
        description: 'Array of Social Media Links with Icon',
      },
      fields: [
        {
          name: 'platform',
          type: 'text',
          label: 'Platform',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
        {
          name: 'icon',
          type: 'upload',
          label: 'Icon',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'brandColours',
      type: 'array',
      label: 'Brand Colours',
      admin: {
        description: 'Array containing text fields, potentially with color picker UI component',
      },
      fields: [
        {
          name: 'colorName',
          type: 'text',
          label: 'Color Name',
          required: true,
        },
        {
          name: 'colorValue',
          type: 'text',
          label: 'Color Value',
          required: true,
          admin: {
            description: 'Hex color code (e.g., #FF0000)',
          },
        },
      ],
    },
  ],
}
