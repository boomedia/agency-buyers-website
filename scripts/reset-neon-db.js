#!/usr/bin/env node

// Reset Neon Database Script
// This script will drop all tables and enums to start completely fresh

import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function resetDatabase() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  })

  try {
    console.log('🔄 Connecting to Neon database...')

    // Drop the public schema entirely and recreate it
    console.log('🗑️  Dropping public schema...')
    await pool.query('DROP SCHEMA public CASCADE')
    console.log('✓ Dropped public schema')

    console.log('🆕 Creating fresh public schema...')
    await pool.query('CREATE SCHEMA public')
    console.log('✓ Created public schema')

    // Grant permissions to the user
    await pool.query('GRANT ALL ON SCHEMA public TO public')
    await pool.query('GRANT ALL ON SCHEMA public TO neondb_owner')
    console.log('✓ Granted permissions')

    console.log('✅ Database completely reset!')
    console.log('💡 Now run: pnpm payload migrate:create fresh-start')
    console.log('💡 Then run: pnpm db:migrate')
  } catch (error) {
    console.error('❌ Error resetting database:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

resetDatabase()
