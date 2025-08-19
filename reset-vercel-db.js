const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

async function resetVercelDatabase() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    console.log('🗂️  Connecting to Vercel Postgres database...')

    // Get all tables in the public schema
    const result = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `)

    if (result.rows.length === 0) {
      console.log('✅ No tables found - database is already clean')
      return
    }

    console.log(`📋 Found ${result.rows.length} tables to drop:`)
    result.rows.forEach((row) => console.log(`   - ${row.tablename}`))

    // Drop all tables with CASCADE to handle dependencies
    for (const row of result.rows) {
      console.log(`🗑️  Dropping table: ${row.tablename}`)
      await pool.query(`DROP TABLE IF EXISTS "${row.tablename}" CASCADE`)
    }

    console.log('✅ All tables dropped successfully!')
    console.log('🔄 Database is now ready for fresh migration with UUID support')
  } catch (error) {
    console.error('❌ Error resetting database:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

resetVercelDatabase()
