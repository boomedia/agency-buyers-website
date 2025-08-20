import { postgresAdapter } from '@payloadcms/db-postgres'
import { gcsStorage } from '@payloadcms/storage-gcs'
import { resendAdapter } from '@payloadcms/email-resend'

import sharp from 'sharp'
import path from 'path'
import { buildConfig, Plugin } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Properties } from './collections/Properties'
import { Regions } from './collections/Regions'
import { Suburbs } from './collections/Suburbs'
import { AccessToken } from './collections/AccessToken'
import { BuyersAccess } from './collections/BuyersAccess'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { CompanySettings } from './globals/CompanySettings'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, RESEND_API_KEY } = process.env

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    // Add groups for better organization in the admin UI
    // @ts-expect-error unreleased config
    groups: [
      {
        name: 'Content',
        label: 'Content',
      },
      {
        name: 'Real Estate',
        label: 'Real Estate',
      },
      {
        name: 'Admin',
        label: 'Admin',
      },
    ],
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  email: resendAdapter({
    defaultFromAddress: 'delivered@resend.dev', // Replace with your verified domain
    defaultFromName: 'Agency Buyers',
    apiKey: RESEND_API_KEY!,
  }),
  db: postgresAdapter({
    pool: {
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: parseInt(DB_PORT!, 10),
      database: DB_NAME,
    },
    prodMigrations: migrations,
  }),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    Properties,
    Regions,
    Suburbs,
    AccessToken,
    BuyersAccess,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, CompanySettings],
  plugins: [
    ...plugins,
    NODE_ENV === 'production'
      ? [
          gcsStorage({
            collections: {
              media: true,
            },
            bucket: process.env.GCS_BUCKET_NAME!,
            options: {
              apiEndpoint: process.env.GCS_ENDPOINT!,
              projectId: process.env.GCS_PROJECT_ID!,
            },
          }),
        ]
      : undefined,
  ].filter(Boolean) as Plugin[],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
