import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
}

export const post1: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
}) => {
  return {
    slug: 'first-home-buyer-guide-australia',
    _status: 'published',
    authors: [author],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Navigate the Australian property market with confidence. Your journey to homeownership starts here, where expert guidance meets local market knowledge.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Disclaimer',
              blockType: 'banner',
              content: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 1,
                          mode: 'normal',
                          style: '',
                          text: 'Important:',
                          version: 1,
                        },
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: ' This content is for educational purposes only and should not be considered financial advice. Always consult with qualified professionals before making property investment decisions. ',
                          version: 1,
                        },
                        {
                          type: 'link',
                          children: [
                            {
                              type: 'text',
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Contact our team for personalised advice',
                              version: 1,
                            },
                          ],
                          direction: 'ltr',
                          fields: {
                            linkType: 'custom',
                            newTab: false,
                            url: '/contact',
                          },
                          format: '',
                          indent: 0,
                          version: 3,
                        },
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: '.',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      textFormat: 0,
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                },
              },
              style: 'info',
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Understanding the First Home Owner Grant (FHOG)',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: "As a first home buyer in Australia, you're entering one of the most exciting chapters of your life. The property market can seem overwhelming, but with the right guidance and understanding of available grants and schemes, homeownership is within reach. The First Home Owner Grant varies by state, but it's designed to help you get your foot on the property ladder. In Queensland, for example, eligible buyers can receive up to $15,000 for new homes, while other states offer similar incentives. Understanding these opportunities is crucial to maximising your purchasing power and making informed decisions in today's competitive market.",
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: "Here's a simple checklist to help you prepare for your first property purchase in Australia:",
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h4',
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'First Home Buyer Checklist',
              blockType: 'code',
              code: "// First Home Buyer Checklist - Australia\n\nconst firstHomeBuyerChecklist = {\n    finances: {\n        depositSaved: '5-20% of property value',\n        preApproval: 'Secured from lender',\n        stampDuty: 'Calculated and budgeted',\n        inspectionFees: '$300-600 per property',\n        conveyancing: '$800-2000'\n    },\n    \n    research: {\n        locationAnalysis: 'Growth potential and amenities',\n        marketComparisons: 'Recent sales in area',\n        futureInfrastructure: 'Planned developments',\n        schoolZones: 'If applicable',\n        transportLinks: 'Public transport access'\n    },\n    \n    legal: {\n        contractReview: 'Qualified conveyancer',\n        buildingInspection: 'Professional assessment',\n        pestInspection: 'Especially for older homes',\n        strata: 'For units/townhouses',\n        cooling off: 'Understand your rights'\n    }\n};\n\nconsole.log('Your journey to homeownership starts here!');\n",
              language: 'javascript',
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Location, Location, Location: Why It Still Matters',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: "In Australia's dynamic property market, the old adage 'location, location, location' remains as relevant as ever. When choosing your first home, consider proximity to employment hubs, quality schools, public transport, and future infrastructure developments. Areas like Brisbane's inner suburbs, Melbourne's growth corridors, and Sydney's emerging precincts offer excellent opportunities for both lifestyle and capital growth.",
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: "The Australian property market is uniquely positioned with strong population growth, particularly in major cities and regional centres. Understanding demographic trends, employment opportunities, and government infrastructure spending can give you a significant advantage. Our buyers agency specialises in identifying these emerging hotspots before they become mainstream, ensuring our clients secure properties with strong growth potential at today's prices.",
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: '',
              blockType: 'mediaBlock',
              media: blockImage.id,
            },
            format: '',
            version: 2,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Professional Guidance',
              blockType: 'banner',
              content: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'As your trusted buyers agency, we provide comprehensive support throughout your property journey. From initial market research and property selection to negotiation and settlement, our experienced team ensures you make informed decisions with confidence.',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      textFormat: 0,
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                },
              },
              style: 'info',
            },
            format: '',
            version: 2,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    heroImage: heroImage.id,
    meta: {
      description:
        'Navigate the Australian property market with confidence. Your journey to homeownership starts here, where expert guidance meets local market knowledge.',
      image: heroImage.id,
      title: "The Complete First Home Buyer's Guide to Australian Property",
    },
    relatedPosts: [], // this is populated by the seed script
    title: "The Complete First Home Buyer's Guide to Australian Property",
  }
}
