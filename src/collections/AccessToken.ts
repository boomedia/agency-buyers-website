import type { CollectionConfig } from 'payload'

export const AccessToken: CollectionConfig = {
  slug: 'access-token',
  admin: {
    group: 'Admin',
  },
  auth: {
    useAPIKey: true,
    disableLocalStrategy: true
  },
  fields: [{
    name: 'name',
    type: 'text',
    required: true,
    label: 'Name'
  }],
}
