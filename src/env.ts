import { z } from 'zod'

const envSchema = z.object({
  PAYLOAD_SECRET: z.string(),
  PREVIEW_SECRET: z.string(),
  NEXT_PUBLIC_SERVER_URL: z.string().url(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  RESEND_API_KEY: z.string().optional(),
  CMS_API_BASE_URL: z.string().optional(),
  CMS_API_TOKEN: z.string().optional(),
})

export const env = envSchema.parse(process.env)
