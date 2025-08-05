import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media, Region, Suburb } from '@/payload-types'

type Property1Args = {
  heroImage: Media
  image1: Media
  image2: Media
  image3: Media
  suburbDoc: Suburb
  regionDoc: Region
  agentImage1: Media
  agentImage2: Media
  agentImage3: Media
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
  image2,
  image3,
  suburbDoc,
  regionDoc,
  agentImage1,
  agentImage2,
  agentImage3,
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
      saleHistory: [],
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
          link: 'https://www.realestate.com.au/property-house-qld-norville-148441684?sourcePage=rea:p4ep:property%20details&sourceElement=avm-currently-advertised-view-lis',
          heroImage: comparableImage1.id,
        },
        {
          address: '1 Laack Street Kepnock, Qld 4670',
          salePrice: 665000,
          link: 'https://www.realestate.com.au/sold/property-house-qld-kepnock-148156108',
          heroImage: comparableImage2.id,
        },
        {
          address: '2 Dr Mays Road, Svensson Heights, Qld 4670',
          salePrice: 610000,
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
          details: null,
          agentNotes: null,
          url: null,
          image: easementImage.id,
        },
        {
          type: 'flood',
          effected: 'yes',
          details: null,
          agentNotes: null,
          url: 'https://mapping.bundaberg.qld.gov.au/Html5Viewer_4_13/Index.html?configBase=https://mapping.bundaberg.qld.gov.au/Geocortex/Essentials/gxe_413/REST/sites/BRCPublic/viewers/HTML5Viewer29/virtualdirectory/Resources/Config/Default',
          image: floodImage.id,
        },
        {
          type: 'bushfire',
          effected: 'no',
          details: null,
          agentNotes: null,
          url: null,
          image: bushfireImage.id,
        },
        {
          type: 'publicHousing',
          effected: 'partial',
          details: null,
          agentNotes: null,
          url: null,
          image: publicHousingImage.id,
        },
        {
          type: 'trainLine',
          effected: 'no',
          details: null,
          agentNotes: null,
          url: null,
          image: null,
        },
        {
          type: 'renovations',
          effected: 'partial',
          details: null,
          agentNotes: null,
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
        equityRelease: 0,
        equityReleaseRate: 0,
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
