import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media, Region } from '@/payload-types'

type SuburbBundabergEastArgs = {
  heroImage: Media
  region: Region
}

export const suburbBundabergEast: (
  args: SuburbBundabergEastArgs,
) => RequiredDataFromCollectionSlug<'suburbs'> = ({ heroImage, region }) => {
  return {
    name: 'Bundaberg East',
    _status: 'published',
    region: region.id,
    vacancyRate: 0.5,
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
                text: 'Bundaberg East is a well-established suburb offering excellent value for property investors. Located close to the CBD and major amenities, this suburb provides easy access to schools, shopping centers, and recreational facilities.',
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
    medianValueByYear: [
      {
        year: 2016,
        medianValue: 251000,
      },
      {
        year: 2017,
        medianValue: 236000,
      },
      {
        year: 2018,
        medianValue: 258000,
      },
      {
        year: 2019,
        medianValue: 243000,
      },
      {
        year: 2020,
        medianValue: 250000,
      },
      {
        year: 2021,
        medianValue: 294000,
      },
      {
        year: 2022,
        medianValue: 380000,
      },
      {
        year: 2023,
        medianValue: 410000,
      },
      {
        year: 2024,
        medianValue: 463000,
      },
      {
        year: 2025,
        medianValue: 531000,
      },
    ],
  }
}
