import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media, Region, Suburb } from '@/payload-types'

type Property1Args = {
  heroImage: Media
  image1: Media
  _image2: Media
  _image3: Media
  suburbDoc: Suburb
  regionDoc: Region
  _agentImage1: Media
  _agentImage2: Media
  _agentImage3: Media
  comparableImage1: Media
  comparableImage2: Media
  comparableImage3: Media
  easementImage: Media
  floodImage: Media
  bushfireImage: Media
  publicHousingImage: Media
}

export const property1: (args: Property1Args) => RequiredDataFromCollectionSlug<'properties'> = ({
  heroImage,
  image1,
  _image2,
  _image3,
  suburbDoc,
  regionDoc,
  _agentImage1,
  _agentImage2,
  _agentImage3,
  comparableImage1,
  comparableImage2,
  comparableImage3,
  easementImage,
  floodImage,
  bushfireImage,
  publicHousingImage,
}) => {
  return {
    name: '61 Scotland Street Bundaberg East',
    _status: 'published',
    info: {
      heroImage: heroImage.id,
      agentNotes: [
        {
          agentName: 'Bobby Haeri Testing Agent name',
          agentNote: null,
        },
      ],
      agentSummary: null,
      videoUrl: 'https://www.loom.com/share/48d42a84001544a0836178b8f7a263e7',
      purchasePrice: 485000,
      askingPrice: 495000,
      addr: {
        streetAddress: '61 Scotland Street Bundaberg East',
        suburbName: suburbDoc.id,
        region: regionDoc.id,
        postcode: '4670',
        state: 'qld',
      },
      saleHistory: [
        {
          year: 2019,
          value: 315000,
        },
        {
          year: 2015,
          value: 265000,
        },
        {
          year: 2011,
          value: 225000,
        },
      ],
      format: {
        bedrooms: 3,
        bathrooms: 1,
        carSpaces: 0,
      },
      internal: null,
      land: 749,
      buildYear: 2003,
      images: [
        {
          image: image1.id,
        },
      ],
      comparableSales: [
        {
          address: '35 Glenmorris Street Norville',
          salePrice: 570000,
          comparison: 'superior',
          link: 'https://www.realestate.com.au/property-house-qld-norville-148441684?sourcePage=rea:p4ep:property%20details&sourceElement=avm-currently-advertised-view-lis',
          heroImage: comparableImage1.id,
        },
        {
          address: '1 Laack Street Kepnock, Qld 4670',
          salePrice: 665000,
          comparison: 'similar',
          link: 'https://www.realestate.com.au/sold/property-house-qld-kepnock-148156108',
          heroImage: comparableImage2.id,
        },
        {
          address: '2 Dr Mays Road, Svensson Heights, Qld 4670',
          salePrice: 610000,
          comparison: 'inferior',
          link: 'https://www.realestate.com.au/sold/property-house-qld-svensson+heights-147969168',
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
                      text: 'Property has been reviewed for easements and no easements were found that would affect the property value or usage. The title search confirms clear boundaries without any restrictions.',
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
          agentNotes: {
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
                      text: 'Confirmed clear title during conveyancing review',
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
          url: null,
          image: easementImage.id,
        },
        {
          type: 'flood',
          effected: 'yes',
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
                      text: 'Property is located in a defined flood area according to Bundaberg Regional Council flood mapping. The property is in a 1:100 year flood zone with an expected flood level of 12.2m AHD. Flood insurance is available and recommended. Historical data shows last significant flood event in 2013.',
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
          agentNotes: {
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
                      text: 'Recommend buyers review flood insurance options and consider this in their finance calculations. Property has good elevation within the flood zone.',
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
          url: 'https://mapping.bundaberg.qld.gov.au/Html5Viewer_4_13/Index.html?configBase=https://mapping.bundaberg.qld.gov.au/Geocortex/Essentials/gxe_413/REST/sites/BRCPublic/viewers/HTML5Viewer29/virtualdirectory/Resources/Config/Default',
          image: floodImage.id,
        },
        {
          type: 'bushfire',
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
                      text: 'Property is not located in a bushfire-prone area according to Queensland Fire and Emergency Services mapping. Standard home insurance rates apply.',
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
          image: bushfireImage.id,
        },
        {
          type: 'publicHousing',
          effected: 'partial',
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
                      text: 'There are some public housing properties within a 500m radius of this location. The closest public housing complex is approximately 300m away on Henderson Street. This may have minimal impact on property values but should be considered for rental desirability.',
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
          agentNotes: {
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
                      text: 'Impact is minimal due to distance and well-maintained public housing. Monitor for any future developments.',
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
          url: null,
          image: publicHousingImage.id,
        },
        {
          type: 'trainLine',
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
                      text: 'No train lines or major rail infrastructure within 2km of this property. The closest rail line is the North Coast Line, approximately 3km away with no noise impact.',
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
          image: null,
        },
        {
          type: 'renovations',
          effected: 'partial',
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
                      text: 'Property would benefit from minor cosmetic renovations including interior painting, kitchen updates, and bathroom refresh. Estimated renovation cost of $15,000-$25,000 could increase rental yield by $30-50 per week and property value by $40,000-$60,000.',
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
          agentNotes: {
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
                      text: 'Recommend including renovation costs in purchase calculations. Good opportunity for value-add strategy.',
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
          url: null,
          image: null,
        },
      ],
      propertyOccupancy: 'tenanted',
      leaseExpiryDate: '2026-05-03T12:00:00.000Z',
      lastRentalIncrease: null,
      currentWeeklyRent: 520,
    },
    valProp: {
      purchCost: {
        loanTerm: 30,
        interestRate: 6.12,
        depositCash: 48500,
        equityRelease: 55000,
        equityReleaseRate: 6.4,
        stampDuty: 17503,
        renovationsCost: 0,
        buildingAndPest: 650,
        conveyancing: 2300,
        bankFees: null,
        lendersInsurance: 8744,
      },
      annualExp: {
        councilRates: 3000,
        insuranceCosts: 3500,
        utilities: 700,
        pmPercentage: 7,
        repairsMaintenance: 700,
      },
      expResults: {
        expectedRent: 550,
        depreciation: 3000,
      },
    },
  }
}
