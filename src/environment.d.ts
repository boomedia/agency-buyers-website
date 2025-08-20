declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      PREVIEW_SECRET: string
      PUBLIC_SERVER_URL: string
      PRODUCTION_SERVER_URL: string
      PRIVATE_ORIGIN_SERVER_URL: string
      DB_HOST: string
      DB_PORT: string
      DB_USER: string
      DB_PASSWORD: string
      DB_NAME: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
