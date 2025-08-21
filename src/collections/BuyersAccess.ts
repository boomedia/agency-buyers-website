import { CollectionConfig } from 'payload'

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
