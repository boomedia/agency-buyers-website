#!/usr/bin/env node

const { execSync } = require('child_process')
const readline = require('readline')

console.log('Attempting to handle Payload migrations automatically...')

try {
  // Kill any existing processes
  execSync('pkill -f "next dev"', { stdio: 'ignore' })

  // Try to generate and run migrations
  console.log('Generating migrations...')
  execSync('npx payload generate', { stdio: 'inherit' })

  console.log('Starting development server...')
  execSync('pnpm dev', { stdio: 'inherit' })
} catch (error) {
  console.error('Error handling migrations:', error.message)
  console.log('Please manually start the development server with: pnpm dev')
  console.log('And accept the migration prompts when they appear.')
}
