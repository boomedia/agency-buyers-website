import type { CompanySetting } from '@/payload-types'

export const companySettings = ({
  logoLight,
  logoDark,
  favicon,
}: {
  logoLight?: any
  logoDark?: any
  favicon?: any
} = {}): Omit<CompanySetting, 'createdAt' | 'id' | 'updatedAt'> => ({
  companyName: 'Buyers Agency',
  motto: 'Your Property Investment Partners',
  description: {
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
              text: 'We are a dedicated buyers agency committed to helping investors make informed property decisions. Our comprehensive due diligence process and market expertise ensure you find the right investment opportunities.',
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
  disclaimer:
    'This information is provided as a guide only and should not be considered as financial advice. Always seek professional advice before making investment decisions.',
  logo: logoLight?.id || null,
  logoDarkmode: logoDark?.id || null,
  corporateVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  favicon: favicon?.id || null,
  faviconDarkmode: favicon?.id || null,
  phone: '+61 7 1234 5678',
  email: 'info@buyersagency.com.au',
  address: '123 Main Street\nBundaberg QLD 4670\nAustralia',
  abn: '12 345 678 901',
  acn: '123 456 789',
  website: 'https://buyersagency.com.au',
  socialMedia: [
    {
      platform: 'Facebook',
      url: 'https://www.facebook.com/buyersagency',
      icon: null,
    },
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/company/buyersagency',
      icon: null,
    },
    {
      platform: 'Instagram',
      url: 'https://www.instagram.com/buyersagency',
      icon: null,
    },
  ],
  brandColours: [
    {
      colorName: 'Primary Blue',
      colorValue: '#1E40AF',
    },
    {
      colorName: 'Secondary Orange',
      colorValue: '#F97316',
    },
    {
      colorName: 'Accent Green',
      colorValue: '#10B981',
    },
    {
      colorName: 'Dark Gray',
      colorValue: '#374151',
    },
    {
      colorName: 'Light Gray',
      colorValue: '#F3F4F6',
    },
  ],
})
