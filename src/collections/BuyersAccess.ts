import { CollectionConfig } from 'payload'

export const BuyersAccess: CollectionConfig = {
  slug: 'buyers-access',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'properties',
      type: 'relationship',
      label: 'Properties in Portfolio',
      relationTo: 'properties',
      hasMany: true,
      admin: {
        description: "Select properties that are part of this buyer's portfolio",
      },
    },
  ],
}
