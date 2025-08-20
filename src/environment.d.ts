declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      PREVIEW_SECRET: string
      NEXT_PUBLIC_SERVER_URL: string
      DB_HOST: string
      DB_PORT: string
      DB_USER: string
      DB_PASSWORD: string
      DB_NAME: string
      CMS_API_BASE_URL?: string
      CMS_API_TOKEN?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
