import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/collections/**/*.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
})
