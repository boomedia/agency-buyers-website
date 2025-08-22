import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media, Region, Suburb } from '@/payload-types'

type Property2Args = {
  heroImage: Media
  image1: Media
  suburbDoc: Suburb
  regionDoc: Region
  comparableImage1: Media
  comparableImage2: Media
  comparableImage3: Media
  easementImage: Media
  floodImage: Media
}

export const property2: (args: Property2Args) => RequiredDataFromCollectionSlug<'properties'> = ({
  heroImage,
  image1,
  suburbDoc,
  regionDoc,
  comparableImage1,
  comparableImage2,
  comparableImage3,
  easementImage,
  floodImage,
}) => {
  return {
    name: '15 Walker Street Bundaberg East',
    _status: 'published',
    info: {
      heroImage: heroImage.id,
      agentNotes: [
        {
          agentName: 'Sarah Johnson',
          agentNote: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  format: '',
                  indent: 0,
                  version: 1,
                  children: [
                    {
                      mode: 'normal',
                      text: 'Great investment opportunity in a growing area.',
                      type: 'text',
                      style: '',
                      detail: 0,
                      format: 0,
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  textStyle: '',
                  textFormat: 0,
                },
              ],
              direction: 'ltr',
            },
          },
        },
      ],
      agentSummary: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  mode: 'normal',
                  text: 'This property represents excellent value in the Bundaberg East market with strong rental potential and capital growth prospects.',
                  type: 'text',
                  style: '',
                  detail: 0,
                  format: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              textStyle: '',
              textFormat: 0,
            },
          ],
          direction: 'ltr',
        },
      },
      videoUrl: 'https://www.loom.com/share/another-demo-video-id',
      purchasePrice: 425000,
      askingPrice: 435000,
      addr: {
        streetAddress: '15 Walker Street Bundaberg East',
        suburbName: suburbDoc.id,
        region: regionDoc.id,
        postcode: '4670',
        state: 'qld',
      },
      saleHistory: [
        {
          year: 2020,
          value: 365000,
        },
        {
          year: 2017,
          value: 295000,
        },
        {
          year: 2013,
          value: 235000,
        },
      ],
      format: {
        bedrooms: 3,
        bathrooms: 2,
        carSpaces: 1,
      },
      internal: 125,
      land: 675,
      buildYear: 1995,
      images: [
        {
          image: image1.id,
        },
      ],
      comparableSales: [
        {
          address: '22 Smith Street Bundaberg East',
          salePrice: 445000,
          comparison: 'superior',
          link: 'https://www.realestate.com.au/property-example',
          heroImage: comparableImage1.id,
        },
        {
          address: '18 Jones Road Bundaberg East',
          salePrice: 415000,
          comparison: 'similar',
          link: 'https://www.realestate.com.au/property-example-2',
          heroImage: comparableImage2.id,
        },
        {
          address: '33 Green Street Bundaberg East',
          salePrice: 395000,
          comparison: 'inferior',
          link: 'https://www.realestate.com.au/property-example-3',
          heroImage: comparableImage3.id,
        },
      ],
    },
    dueDiligence: {
      zoneData: [
        {
          type: 'easement',
          effected: 'no',
          details: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  format: '',
                  indent: 0,
                  version: 1,
                  children: [
                    {
                      mode: 'normal',
                      text: 'Title search confirms no easements affecting this property. Clear boundaries and unrestricted land use.',
                      type: 'text',
                      style: '',
                      detail: 0,
                      format: 0,
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  textStyle: '',
                  textFormat: 0,
                },
              ],
              direction: 'ltr',
            },
          },
          agentNotes: null,
          url: null,
          image: easementImage.id,
        },
        {
          type: 'flood',
          effected: 'no',
          details: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  format: '',
                  indent: 0,
                  version: 1,
                  children: [
                    {
                      mode: 'normal',
                      text: 'Property is located outside the defined flood area. Excellent elevation provides natural flood protection. Standard insurance rates apply.',
                      type: 'text',
                      style: '',
                      detail: 0,
                      format: 0,
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  textStyle: '',
                  textFormat: 0,
                },
              ],
              direction: 'ltr',
            },
          },
          agentNotes: null,
          url: 'https://mapping.bundaberg.qld.gov.au/flood-mapping',
          image: floodImage.id,
        },
        {
          type: 'bushfire',
          effected: 'no',
          details: null,
          agentNotes: null,
          url: null,
          image: null,
        },
        {
          type: 'publicHousing',
          effected: 'no',
          details: null,
          agentNotes: null,
          url: null,
          image: null,
        },
      ],
      propertyOccupancy: 'vacant',
      leaseExpiryDate: null,
      lastRentalIncrease: null,
      currentWeeklyRent: null,
    },
    valProp: {
      purchCost: {
        loanTerm: 30,
        interestRate: 6.25,
        depositCash: 42500,
        equityRelease: 0,
        equityReleaseRate: 0,
        stampDuty: 15250,
        renovationsCost: 5000,
        buildingAndPest: 650,
        conveyancing: 2300,
        bankFees: 800,
        lendersInsurance: 7200,
      },
      annualExp: {
        councilRates: 2800,
        insuranceCosts: 3200,
        utilities: 600,
        pmPercentage: 7.5,
        repairsMaintenance: 800,
      },
      expResults: {
        expectedRent: 520,
        depreciation: 2500,
      },
    },
  }
}
