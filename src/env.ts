
import { z } from 'zod';

const envSchema = z.object({
  POSTGRES_URL: z.string().url(),
  PAYLOAD_SECRET: z.string(),
  NEXT_PUBLIC_SERVER_URL: z.string().url(),
  CRON_SECRET: z.string(),
  PREVIEW_SECRET: z.string(),
  CMS_API_BASE_URL: z.string().url(),
  CMS_API_TOKEN: z.string(),
  NEXT_PUBLIC_CMS_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
