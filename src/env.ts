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

// During build time when SKIP_PAYLOAD_DB is true, skip environment validation
// This allows Docker builds to complete without requiring real environment variables
function getEnv() {
  if (process.env.SKIP_PAYLOAD_DB === 'true') {
    // Return a minimal safe object for build time
    return {
      PAYLOAD_SECRET: 'build-placeholder',
      PREVIEW_SECRET: 'build-placeholder',
      NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_USER: 'postgres',
      DB_PASSWORD: 'postgres',
      DB_NAME: 'agency-buyers-cms',
      RESEND_API_KEY: undefined,
      CMS_API_BASE_URL: undefined,
      CMS_API_TOKEN: undefined,
    }
  }

  // Runtime: validate all environment variables
  return envSchema.parse(process.env)
}

export const env = getEnv()
