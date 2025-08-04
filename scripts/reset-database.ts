import { Pool } from 'pg'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function resetDatabase() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  })

  try {
    console.log('🔄 Connecting to database...')

    // Get all table names
    const tablesResult = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `)

    const tables = tablesResult.rows.map((row) => row.tablename)

    if (tables.length === 0) {
      console.log('✅ No tables found - database is already clean')
      return
    }

    console.log(`📋 Found ${tables.length} tables:`, tables)
    console.log('🗑️  Dropping all tables...')

    // Drop all tables with CASCADE to handle foreign key constraints
    for (const table of tables) {
      await pool.query(`DROP TABLE IF EXISTS "${table}" CASCADE`)
      console.log(`   ✓ Dropped table: ${table}`)
    }

    console.log('✅ Database reset complete!')
    console.log('💡 Run your application to let Payload recreate the schema automatically')
  } catch (error) {
    console.error('❌ Error resetting database:', error)
  } finally {
    await pool.end()
  }
}

resetDatabase()
