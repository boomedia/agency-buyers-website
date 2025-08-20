import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow localhost for development
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      // Dynamic patterns from environment variables
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Handle fs module issues on client side
    if (!isServer) {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }

    return webpackConfig
  },
  reactStrictMode: true,
  output: 'standalone',
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
