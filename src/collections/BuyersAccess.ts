import { CollectionConfig } from 'payload'

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

export const BuyersAccess: CollectionConfig = {
  slug: 'buyers-access',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, context }) => {
        // Sync properties relationship with Properties collection
        // Skip sync if this update is coming from a property relationship sync to prevent infinite loops
        if (req.payload && doc.properties !== undefined && !context?.skipPropertySync) {
          try {
            const currentPropertyIds = Array.isArray(doc.properties)
              ? doc.properties.map((property: any) =>
                  typeof property === 'object' ? property.id : property,
                )
              : []

            const previousPropertyIds = Array.isArray(previousDoc?.properties)
              ? previousDoc.properties.map((property: any) =>
                  typeof property === 'object' ? property.id : property,
                )
              : []

            // Find properties to add and remove
            const propertiesToAdd = currentPropertyIds.filter(
              (id: any) => !previousPropertyIds.includes(id),
            )
            const propertiesToRemove = previousPropertyIds.filter(
              (id: any) => !currentPropertyIds.includes(id),
            )

            // Add this buyer to new properties
            for (const propertyId of propertiesToAdd) {
              try {
                const property = await req.payload.findByID({
                  collection: 'properties',
                  id: propertyId,
                })

                if (property) {
                  const currentBuyers = Array.isArray(property.linkedBuyers)
                    ? property.linkedBuyers
                    : []
                  const buyerIds = currentBuyers.map((buyer: any) =>
                    typeof buyer === 'object' ? buyer.id : buyer,
                  )

                  if (!buyerIds.includes(doc.id)) {
                    await req.payload.update({
                      collection: 'properties',
                      id: propertyId,
                      data: {
                        linkedBuyers: [...buyerIds, doc.id],
                      },
                      context: { skipPropertySync: true }, // Prevent reverse sync
                    })
                  }
                }
              } catch (propertyError) {
                console.warn(
                  `Could not add buyer ${doc.id} to property ${propertyId}:`,
                  propertyError,
                )
              }
            }

            // Remove this buyer from removed properties
            for (const propertyId of propertiesToRemove) {
              try {
                const property = await req.payload.findByID({
                  collection: 'properties',
                  id: propertyId,
                })

                if (property) {
                  const currentBuyers = Array.isArray(property.linkedBuyers)
                    ? property.linkedBuyers
                    : []
                  const buyerIds = currentBuyers.map((buyer: any) =>
                    typeof buyer === 'object' ? buyer.id : buyer,
                  )
                  const updatedBuyers = buyerIds.filter((id: any) => id !== doc.id)

                  await req.payload.update({
                    collection: 'properties',
                    id: propertyId,
                    data: {
                      linkedBuyers: updatedBuyers,
                    },
                    context: { skipPropertySync: true }, // Prevent reverse sync
                  })
                }
              } catch (propertyError) {
                console.warn(
                  `Could not remove buyer ${doc.id} from property ${propertyId}:`,
                  propertyError,
                )
              }
            }
          } catch (error) {
            console.warn('Could not sync property relationships:', error)
          }
        }
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
