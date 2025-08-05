import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type RegionBundabergArgs = {
  heroImage: Media
  communityImage: Media
  economicImage: Media
  employmentImage: Media
  hospitalIcon: Media
  newHomesImage: Media
}

export const regionBundaberg: (
  args: RegionBundabergArgs,
) => RequiredDataFromCollectionSlug<'regions'> = ({
  heroImage,
  communityImage,
  economicImage,
  employmentImage,
  hospitalIcon,
  newHomesImage,
}) => {
  return {
    name: 'Bundaberg Regional Council',
    heroImage: heroImage.id,
    description: {
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
                text: "Bundaberg is experiencing a significant housing demand surge, driven by population growth, infrastructure investments, and lifestyle appeal. The region's population has grown by 97.83% from 2016 to 2021, reaching over 99,000 residents, and continues to attract families, retirees, and remote workers seeking affordability and coastal living. This demand has led to a tight rental market, with vacancy rates below 1%, and a 7.85% increase in median house rental prices between Q1 and Q3 2023. To address the housing shortage, the Bundaberg Regional Council has approved nearly 5,000 residential lots along the coast, with significant developments underway in areas like Innes Park. These factors underscore Bundaberg's strong housing demand, presenting opportunities for property investors and developers.",
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
    video: 'https://www.loom.com/share/28f70079095e4d9a85878727bd91ab83',
    communityEconomicLandscape: [
      {
        title: 'Community Profile',
        url: 'https://profile.id.com.au/bundaberg/',
        image: communityImage.id,
        icon: null,
        description: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                tag: 'h6',
                type: 'heading',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'Community Demographics',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
              },
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'The information provided here is the data in relation to the community profile including demographics, household composition, and social indicators.',
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
      {
        title: 'Economic Profile',
        url: 'https://economy.id.com.au/bundaberg',
        image: economicImage.id,
        icon: null,
        description: {
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
                    text: 'Economic indicators and business landscape analysis for the Bundaberg region.',
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
      {
        title: 'Employment By Industry',
        url: 'https://economy.id.com.au/bundaberg/employment-by-industry',
        image: employmentImage.id,
        icon: null,
        description: null,
      },
    ],
    infrastructureFutureDevelopment: [
      {
        title: '$1.2B Hospital Upgrade',
        url: 'https://statements.qld.gov.au/statements/100313',
        image: null,
        icon: hospitalIcon.id,
        description: {
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
                    text: "Construction has officially commenced on the $1.2 billion Bundaberg Hospital project, marking a significant milestone in Queensland's healthcare infrastructure. This development will add 121 beds, expanding the hospital's capacity to over 400 beds, and will include enhanced emergency department facilities, additional operating theatres, and comprehensive outpatient and diagnostic services. The project is expected to create approximately 2,887 local construction jobs and is slated for completion by late 2027. As part of the broader Health Big Build initiative, this hospital is the first step in establishing a health and education precinct aimed at meeting the needs of the growing Bundaberg community.",
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
      {
        title: '1000 New Homes Approved',
        url: 'https://www.realestate.com.au/news/housing-boom-headed-for-bundaberg-with-new-funding-to-enable-10000-homes/',
        image: newHomesImage.id,
        icon: null,
        description: {
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
                    text: 'The Bundaberg Regional Council has approved significant residential development to address housing demand.',
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
  }
}
