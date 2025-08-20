import type { Media } from '@/payload-types'

export const logoLight: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Buyers Agency Logo Light',
  caption: {
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
              text: 'Company logo for light theme',
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
  filename: 'buyers-agency-logo-light.svg',
  mimeType: 'image/svg+xml',
}

export const logoDark: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Buyers Agency Logo Dark',
  caption: {
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
              text: 'Company logo for dark theme',
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
  filename: 'buyers-agency-logo-dark.svg',
  mimeType: 'image/svg+xml',
}

export const iconFavicon: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Buyers Agency Icon',
  caption: {
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
              text: 'Company favicon icon',
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
  filename: 'icon-buyers-agency.svg',
  mimeType: 'image/svg+xml',
}
