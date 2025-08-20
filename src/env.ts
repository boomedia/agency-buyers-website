
import { z } from 'zod';

const envSchema = z.object({
  PAYLOAD_SECRET: z.string(),
  PREVIEW_SECRET: z.string(),
  PUBLIC_SERVER_URL: z.url(),
  PRODUCTION_SERVER_URL: z.url(),
  PRIVATE_ORIGIN_SERVER_URL: z.url(),
  DB_HOST: z.string(),
  DB_PORT: z.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string()
});

export const env = envSchema.parse(process.env);
