import { CollectionConfig } from 'payload'

export const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'name',
    group: 'Real Estate',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Convert empty strings to null for number fields to prevent PostgreSQL errors
        const convertEmptyStrings = (obj: any): any => {
          if (obj === '') return null
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
      async ({ data, req }) => {
        // Auto-populate region from selected suburb
        if (data.generalInformation?.address?.suburbName && req.payload) {
          try {
            // Handle both string IDs and objects
            const suburbId =
              typeof data.generalInformation.address.suburbName === 'object'
                ? data.generalInformation.address.suburbName.id
                : data.generalInformation.address.suburbName

            if (suburbId) {
              const suburb = await req.payload.findByID({
                collection: 'suburbs',
                id: suburbId,
              })

              if (suburb && suburb.region) {
                // Always update the region when suburb changes
                const regionId =
                  typeof suburb.region === 'object' ? suburb.region.id : suburb.region
                data.generalInformation.address.region = regionId
              }
            }
          } catch (error) {
            console.warn('Could not auto-populate region from suburb:', error)
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Sync linkedBuyers relationship with BuyersAccess collection
        if (req.payload && doc.linkedBuyers !== undefined) {
          try {
            const currentBuyerIds = Array.isArray(doc.linkedBuyers)
              ? doc.linkedBuyers.map((buyer: any) => (typeof buyer === 'object' ? buyer.id : buyer))
              : []

            const previousBuyerIds = Array.isArray(previousDoc?.linkedBuyers)
              ? previousDoc.linkedBuyers.map((buyer: any) =>
                  typeof buyer === 'object' ? buyer.id : buyer,
                )
              : []

            // Find buyers to add and remove
            const buyersToAdd = currentBuyerIds.filter((id: any) => !previousBuyerIds.includes(id))
            const buyersToRemove = previousBuyerIds.filter(
              (id: any) => !currentBuyerIds.includes(id),
            )

            // Add this property to new buyers
            for (const buyerId of buyersToAdd) {
              const buyer = await req.payload.findByID({
                collection: 'buyers-access',
                id: buyerId,
              })

              if (buyer) {
                const currentProperties = Array.isArray(buyer.properties) ? buyer.properties : []
                const propertyIds = currentProperties.map((prop: any) =>
                  typeof prop === 'object' ? prop.id : prop,
                )

                if (!propertyIds.includes(doc.id)) {
                  await req.payload.update({
                    collection: 'buyers-access',
                    id: buyerId,
                    data: {
                      properties: [...propertyIds, doc.id],
                    },
                  })
                }
              }
            }

            // Remove this property from removed buyers
            for (const buyerId of buyersToRemove) {
              const buyer = await req.payload.findByID({
                collection: 'buyers-access',
                id: buyerId,
              })

              if (buyer) {
                const currentProperties = Array.isArray(buyer.properties) ? buyer.properties : []
                const propertyIds = currentProperties.map((prop: any) =>
                  typeof prop === 'object' ? prop.id : prop,
                )
                const updatedProperties = propertyIds.filter((id: any) => id !== doc.id)

                await req.payload.update({
                  collection: 'buyers-access',
                  id: buyerId,
                  data: {
                    properties: updatedProperties,
                  },
                })
              }
            }
          } catch (error) {
            console.warn('Could not sync buyer relationships:', error)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Property Name',
    },
    {
      name: 'linkedBuyers',
      type: 'relationship',
      label: 'Linked Buyers',
      relationTo: 'buyers-access',
      hasMany: true,
      admin: {
        description:
          'Buyers who have this property in their portfolio. You can remove buyers from this list.',
        isSortable: false,
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General Information',
          fields: [
            {
              name: 'generalInformation',
              type: 'group',
              label: 'General Information',
              fields: [
                {
                  name: 'heroImage',
                  type: 'upload',
                  label: 'Hero Image',
                  relationTo: 'media',
                },
                {
                  name: 'agentNotes',
                  type: 'array',
                  label: 'Agent Notes',
                  fields: [
                    {
                      name: 'agentName',
                      type: 'text',
                      label: 'Agent Name',
                      hooks: {
                        beforeChange: [
                          ({ value, req }) => {
                            // Auto-populate with current user's name if field is empty
                            if (!value && req.user && req.user.collection === 'users') {
                              // Use the user's name field, or email as fallback
                              const user = req.user as any
                              return user.name || user.email || 'Unknown Agent'
                            }
                            return value
                          },
                        ],
                      },
                      admin: {
                        description: 'Auto-filled with current logged-in user name',
                      },
                    },
                    {
                      name: 'agentNote',
                      type: 'richText',
                      label: 'Agent Note',
                      admin: {
                        description: 'Notes about the agent',
                      },
                    },
                  ],
                },
                {
                  name: 'agentSummary',
                  type: 'richText',
                  label: 'Agent Summary',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'videoUrl',
                      type: 'text',
                      label: 'Your Presentation',
                      admin: {
                        width: '33%',
                        description: 'Loom video URL',
                      },
                    },
                    {
                      name: 'purchasePrice',
                      type: 'number',
                      label: 'Purchase Price',
                      admin: {
                        width: '33%',
                        description: 'The target or recommended in AUD Currency',
                        step: 0.01,
                      },
                    },
                    {
                      name: 'askingPrice',
                      type: 'number',
                      label: 'Asking Price',
                      admin: {
                        width: '34%',
                        description: 'AUD Currency',
                        step: 0.01,
                      },
                    },
                  ],
                },
                {
                  name: 'address',
                  type: 'group',
                  label: 'Address',
                  fields: [
                    {
                      name: 'streetAddress',
                      type: 'text',
                      label: 'Street Address',
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'suburbName',
                          type: 'relationship',
                          label: 'Suburb Name',
                          relationTo: 'suburbs',
                          admin: {
                            width: '50%',
                            description: 'Suburb Name',
                          },
                        },
                        {
                          name: 'region',
                          type: 'relationship',
                          label: 'Region',
                          defaultValue: '',
                          relationTo: 'regions',
                          required: false,
                          index: false,
                          admin: {
                            width: '50%',
                            description: 'Region (automatically populated from selected suburb)',
                            readOnly: true,
                          },
                        },
                        {
                          name: 'postcode',
                          type: 'text',
                          label: 'Postcode',
                          admin: {
                            width: '50%',
                          },
                        },
                        {
                          name: 'state',
                          type: 'select',
                          label: 'State',
                          options: [
                            { label: 'NSW', value: 'nsw' },
                            { label: 'VIC', value: 'vic' },
                            { label: 'QLD', value: 'qld' },
                            { label: 'WA', value: 'wa' },
                            { label: 'SA', value: 'sa' },
                            { label: 'TAS', value: 'tas' },
                            { label: 'ACT', value: 'act' },
                            { label: 'NT', value: 'nt' },
                          ],
                          admin: {
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'saleHistory',
                  type: 'array',
                  label: 'Sale History',
                  fields: [
                    {
                      name: 'year',
                      type: 'number',
                      label: 'Year',
                    },
                    {
                      name: 'value',
                      type: 'number',
                      label: 'Value',
                      admin: {
                        description: 'Median Value in AUD Currency',
                        step: 0.01,
                      },
                    },
                  ],
                },
                {
                  name: 'format',
                  type: 'group',
                  label: 'Format',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'bedrooms',
                          type: 'number',
                          label: 'Bedrooms',
                          admin: {
                            width: '25%',
                          },
                        },
                        {
                          name: 'bathrooms',
                          type: 'number',
                          label: 'Bathrooms',
                          admin: {
                            width: '25%',
                          },
                        },
                        {
                          name: 'carSpaces',
                          type: 'number',
                          label: 'Car Spaces',
                          admin: {
                            width: '25%',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'internal',
                      type: 'number',
                      label: 'Internal',
                      admin: {
                        width: '25%',
                        description: 'm² (square meters)',
                      },
                    },
                    {
                      name: 'land',
                      type: 'number',
                      label: 'Land',
                      admin: {
                        width: '25%',
                        description: 'm² (square meters)',
                      },
                    },
                    {
                      name: 'buildYear',
                      type: 'number',
                      label: 'Build Year',
                      min: 1788,
                      max: 2200,
                      admin: {
                        width: '25%',
                      },
                    },
                  ],
                },
                {
                  name: 'images',
                  type: 'array',
                  label: 'Images',
                  admin: {
                    description: 'Image gallery NOT CURRENTLY LIVE',
                  },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'comparableSales',
                  type: 'array',
                  label: 'Comparable Sales',
                  admin: {
                    description: 'Comparable sales',
                  },
                  fields: [
                    {
                      name: 'address',
                      type: 'text',
                      label: 'Address',
                    },
                    {
                      name: 'salePrice',
                      type: 'number',
                      label: 'Sale Price',
                      admin: {
                        description: 'AUD Currency',
                        step: 0.01,
                      },
                    },
                    {
                      name: 'comparison',
                      type: 'radio',
                      label: 'Comparison to Current Property',
                      dbName: 'comp_type',
                      options: [
                        {
                          label: 'Superior',
                          value: 'superior',
                        },
                        {
                          label: 'Similar',
                          value: 'similar',
                        },
                        {
                          label: 'Inferior',
                          value: 'inferior',
                        },
                      ],
                      admin: {
                        layout: 'horizontal',
                        description: 'How this comparable sale compares to the current property',
                      },
                    },
                    {
                      name: 'link',
                      type: 'text',
                      label: 'Link',
                      admin: {
                        description: 'Link to the property external website',
                      },
                    },
                    {
                      name: 'heroImage',
                      type: 'upload',
                      label: 'Hero Image',
                      relationTo: 'media',
                      admin: {
                        description: 'Image',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Due Diligence',
          fields: [
            {
              name: 'dueDiligence',
              type: 'group',
              label: 'Due Diligence',
              fields: [
                {
                  name: 'zoneData',
                  type: 'array',
                  label: 'Zone Data',
                  admin: {
                    description:
                      'Warning: Adding empty zone entries can cause formatting issues. Please ensure all fields are completed before saving.',
                  },
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      label: 'Type',
                      options: [
                        { label: 'Easement', value: 'easement' },
                        { label: 'Flood Zone', value: 'flood' },
                        { label: 'Bushfire Zone', value: 'bushfire' },
                        { label: 'Transmission lines', value: 'transmission' },
                        { label: 'Public Housing', value: 'publicHousing' },
                        { label: 'Train Line', value: 'trainLine' },
                        { label: 'Renovations', value: 'renovations' },
                        { label: 'Other', value: 'other' },
                      ],
                    },
                    {
                      name: 'effected',
                      type: 'select',
                      label: 'Effected',
                      options: [
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' },
                        { label: 'Partial', value: 'partial' },
                      ],
                    },
                    {
                      name: 'details',
                      type: 'richText',
                      label: 'Details',
                      admin: {
                        description: 'More detailed information about the zone data for the buyer',
                      },
                    },
                    {
                      name: 'agentNotes',
                      type: 'richText',
                      label: 'Agent Notes',
                      admin: {
                        description:
                          'These notes are for the agent to provide additional internal information, but not visible to buyers.',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'URL',
                      admin: {
                        description: 'Web link to more information in new window',
                      },
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      label: 'Image',
                      relationTo: 'media',
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'propertyOccupancy',
                      type: 'select',
                      label: 'Property Occupancy',
                      options: [
                        { label: 'Vacant', value: 'vacant' },
                        { label: 'Tenanted', value: 'tenanted' },
                        { label: 'Owner Occupied', value: 'ownerOccupied' },
                      ],
                      admin: {
                        width: '25%',
                      },
                    },
                    {
                      name: 'leaseExpiryDate',
                      type: 'date',
                      label: 'Lease Expiry Date',
                      admin: {
                        width: '25%',
                        date: {
                          pickerAppearance: 'dayOnly',
                        },
                      },
                    },
                    {
                      name: 'lastRentalIncrease',
                      type: 'date',
                      label: 'Last Rental Increase',
                      admin: {
                        width: '25%',
                        description: 'Last Rental Price Date the rent was Increased',
                        date: {
                          pickerAppearance: 'dayOnly',
                        },
                      },
                    },
                    {
                      name: 'currentWeeklyRent',
                      type: 'number',
                      label: 'Current Weekly Rent',
                      admin: {
                        width: '25%',
                        description: 'Weekly AUD Currency',
                        step: 0.01,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Value Proposition',
          fields: [
            {
              name: 'valueProposition',
              type: 'group',
              label: 'Value Proposition',
              fields: [
                {
                  name: 'purchaseCost',
                  type: 'group',
                  label: 'Purchase Cost',
                  fields: [
                    {
                      name: 'purchasePriceDisplay',
                      type: 'text',
                      label: 'Purchase Price (Display)',
                      admin: {
                        description:
                          'Calculated value equals Purchase Price from General Information',
                        readOnly: true,
                        components: {
                          Field: '@/fields/PurchasePriceDisplayField',
                        },
                      },
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'loanTerm',
                          type: 'number',
                          label: 'Loan Term',
                          defaultValue: 30,
                          admin: {
                            width: '20%',
                            description: 'Years',
                            step: 1,
                          },
                        },
                        {
                          name: 'interestRate',
                          type: 'number',
                          label: 'Interest Rate',
                          admin: {
                            width: '20%',
                            description: 'Percentage',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'depositCash',
                          type: 'number',
                          label: 'Deposit Cash',
                          admin: {
                            width: '20%',
                            description: 'AUD value',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'equityRelease',
                          type: 'number',
                          label: 'Equity Release',
                          admin: {
                            width: '20%',
                            description: 'AUD Currency',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'equityReleaseInterestRate',
                          type: 'number',
                          label: 'Equity Release Interest Rate',
                          admin: {
                            width: '20%',
                            description: 'Percentage',
                            step: 0.01,
                          },
                        },
                      ],
                    },
                    {
                      name: 'loanAmountDisplay',
                      type: 'text',
                      label: 'Loan Amount (Display)',
                      admin: {
                        description: 'Calc: Purchase Price - Deposit Cash - Equity Release',
                        readOnly: true,
                        components: {
                          Field: '@/fields/LoanAmountDisplayField',
                        },
                      },
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'depositTotalDisplay',
                          type: 'text',
                          label: 'Deposit Total (Display)',
                          admin: {
                            width: '50%',
                            description: 'Calc: Deposit Cash + Equity Release',
                            readOnly: true,
                            components: {
                              Field: '@/fields/DepositTotalDisplayField',
                            },
                          },
                        },
                        {
                          name: 'depositPercentageDisplay',
                          type: 'text',
                          label: 'Deposit Percentage (Display)',
                          admin: {
                            width: '50%',
                            description: 'Calc: Deposit Total as percentage of Purchase Price',
                            readOnly: true,
                            components: {
                              Field: '@/fields/DepositPercentageDisplayField',
                            },
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'stampDuty',
                          type: 'number',
                          label: 'Stamp Duty',
                          admin: {
                            width: '33%',
                            description: 'AUD Currency',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'renovationsCost',
                          type: 'number',
                          label: 'Renovations Cost',
                          admin: {
                            width: '33%',
                            description: 'AUD Currency',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'buildingAndPest',
                          type: 'number',
                          label: 'Building and Pest',
                          admin: {
                            width: '34%',
                            description: 'AUD Currency',
                            step: 0.01,
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'conveyancing',
                          type: 'number',
                          label: 'Conveyancing',
                          admin: {
                            width: '33%',
                            description: 'This is also called solicitor AUD Currency',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'bankFees',
                          type: 'number',
                          label: 'Bank Fees',
                          admin: {
                            width: '33%',
                            description: 'AUD Currency',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'lendersMortgageInsurance',
                          type: 'number',
                          label: 'Lenders Mortgage Insurance',
                          admin: {
                            width: '34%',
                            description: 'AUD Currency LMI',
                            step: 0.01,
                          },
                        },
                      ],
                    },
                    {
                      name: 'totalPurchaseCostDisplay',
                      type: 'text',
                      label: 'Total Purchase Cost (Display)',
                      admin: {
                        description:
                          'Calc: Purchase Price + Stamp Duty + Renovations Cost + Building and Pest + Conveyancing + Bank Fees + (Lenders Mortgage Insurance / Loan Term)',
                        readOnly: true,
                        components: {
                          Field: '@/fields/TotalPurchaseCostDisplayField',
                        },
                      },
                    },
                  ],
                },
                {
                  name: 'annualExpenses',
                  type: 'group',
                  label: 'Annual Expenses',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'councilRates',
                          type: 'number',
                          label: 'Council Rates',
                          admin: {
                            width: '20%',
                            description: 'Annual AUD Currency',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'insuranceCosts',
                          type: 'number',
                          label: 'Insurance Costs',
                          admin: {
                            width: '20%',
                            description: 'Annual AUD Currency',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'utilities',
                          type: 'number',
                          label: 'Utilities',
                          admin: {
                            width: '20%',
                            description: 'Annual AUD Currency',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'repairsAndMaintenance',
                          type: 'number',
                          label: 'Repairs and Maintenance',
                          admin: {
                            width: '20%',
                            description: 'Annual AUD Currency',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'pmPercentage',
                          type: 'number',
                          label: 'Property Management Percentage',
                          admin: {
                            width: '20%',
                            description: 'Percentage of weekly rent',
                            step: 0.01,
                          },
                        },
                      ],
                    },
                    {
                      name: 'pmFeesDisplay',
                      type: 'text',
                      label: 'Property Management Fees (Display)',
                      admin: {
                        description: 'Calc: Property Management Percentage of Weekly Rent * 52',
                        readOnly: true,
                        components: {
                          Field: '@/fields/PropertyManagementFeesDisplayField',
                        },
                      },
                    },
                    {
                      name: 'loanRepaymentsDisp',
                      type: 'text',
                      label: 'Loan Repayments (Display)',
                      admin: {
                        description:
                          'Calc: (Loan Amount - Equity Release × Interest Rate) + (Loan Amount - Deposit Cash × Equity Release Interest Rate) / Loan Term',
                        readOnly: true,
                        components: {
                          Field: '@/fields/LoanRepaymentsDisplayField',
                        },
                      },
                    },
                    {
                      name: 'totalExpensesDisp',
                      type: 'text',
                      label: 'Total Annual Expenses (Display)',
                      admin: {
                        description:
                          'Calc: Council Rates + Insurance Costs + Utilities + Property Management Fees + Repairs and Maintenance + (Lenders Mortgage Insurance / Loan Term) + Loan Repayments',
                        readOnly: true,
                        components: {
                          Field: '@/fields/TotalAnnualExpensesDisplayField',
                        },
                      },
                    },
                  ],
                },
                {
                  name: 'expectedResults',
                  type: 'group',
                  label: 'Expected Results',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'expectedWeeklyRent',
                          type: 'number',
                          label: 'Expected Weekly Rent',
                          admin: {
                            width: '50%',
                            description: 'Expected Weekly rent as AUD Currency',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'depreciationPotential',
                          type: 'number',
                          label: 'Depreciation Potential',
                          admin: {
                            width: '50%',
                            description: 'AUD Currency Depreciation potential',
                            step: 0.01,
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'annualGrossIncomeDisplay',
                          type: 'text',
                          label: 'Annual Gross Income (Display)',
                          admin: {
                            width: '50%',
                            description: 'Calc: Expected Weekly rent X 52',
                            readOnly: true,
                            components: {
                              Field: '@/fields/AnnualGrossIncomeField',
                            },
                          },
                        },
                        {
                          name: 'annualGrossYieldDisplay',
                          type: 'text',
                          label: 'Annual Gross Yield (Display)',
                          admin: {
                            width: '50%',
                            description: 'Calc: Annual Gross income / Purchase Price X 100',
                            readOnly: true,
                            components: {
                              Field: '@/fields/AnnualGrossYieldField',
                            },
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'annualNetIncomeDisplay',
                          type: 'text',
                          label: 'Annual Net Income (Display)',
                          admin: {
                            width: '50%',
                            description: 'Calc: Gross - Expenses',
                            readOnly: true,
                            components: {
                              Field: '@/fields/AnnualNetIncomeField',
                            },
                          },
                        },
                        {
                          name: 'annualNetYieldDisplay',
                          type: 'text',
                          label: 'Annual Net Yield (Display)',
                          admin: {
                            width: '50%',
                            description: 'Calc: Annual Net Income / Purchase Price X 100',
                            readOnly: true,
                            components: {
                              Field: '@/fields/AnnualNetYieldField',
                            },
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'equityAt8Display',
                          type: 'text',
                          label: 'Equity at 8% (Display)',
                          admin: {
                            width: '25%',
                            description: 'Calc: Purchase price X 0.08',
                            readOnly: true,
                            components: {
                              Field: '@/fields/EquityAt8DisplayField',
                            },
                          },
                        },
                        {
                          name: 'equityAt10Display',
                          type: 'text',
                          label: 'Equity at 10% (Display)',
                          admin: {
                            width: '25%',
                            description: 'Calc: Purchase price X 0.1',
                            readOnly: true,
                            components: {
                              Field: '@/fields/EquityAt10DisplayField',
                            },
                          },
                        },
                        {
                          name: 'equityAt12Display',
                          type: 'text',
                          label: 'Equity at 12% (Display)',
                          admin: {
                            width: '25%',
                            description: 'Calc: Purchase price X 0.12',
                            readOnly: true,
                            components: {
                              Field: '@/fields/EquityAt12DisplayField',
                            },
                          },
                        },
                        {
                          name: 'equityAt16Display',
                          type: 'text',
                          label: 'Equity at 16% (Display)',
                          admin: {
                            width: '25%',
                            description: 'Calc: Purchase price X 0.16',
                            readOnly: true,
                            components: {
                              Field: '@/fields/EquityAt16DisplayField',
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
