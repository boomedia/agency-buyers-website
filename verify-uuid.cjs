const { Pool } = require('pg')
require('dotenv').config({ path: '.env' })
require('dotenv').config({ path: '.env.local', override: true })

async function verifyUUIDSetup() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  })

  try {
    console.log('🔍 Checking database schema for UUID implementation...\n')

    // Check if properties table exists and get its structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'properties' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `)

    if (tableInfo.rows.length === 0) {
      console.log('❌ Properties table not found')
      return
    }

    console.log('📋 Properties table structure:')
    tableInfo.rows.forEach((row) => {
      const isIdColumn = row.column_name === 'id'
      const prefix = isIdColumn ? '🔑' : '  '
      console.log(
        `${prefix} ${row.column_name}: ${row.data_type}${row.column_default ? ` (default: ${row.column_default})` : ''}`,
      )
    })

    // Check if there are any properties and show their IDs
    const properties = await pool.query('SELECT id, name FROM properties LIMIT 5')

    if (properties.rows.length > 0) {
      console.log('\n📄 Sample property IDs:')
      properties.rows.forEach((prop) => {
        console.log(`  - ${prop.id} (${prop.name || 'Untitled'})`)
      })
    } else {
      console.log('\n📄 No properties found yet')
    }

    // Check ID format
    const idColumn = tableInfo.rows.find((row) => row.column_name === 'id')
    const isUUID = idColumn && idColumn.data_type === 'uuid'

    console.log(`\n✅ UUID Configuration: ${isUUID ? 'ENABLED' : 'DISABLED'}`)
    console.log(`   ID Column Type: ${idColumn ? idColumn.data_type : 'Not found'}`)

    if (isUUID) {
      console.log(
        '🎉 Success! Properties collection is now using UUIDs instead of sequential numeric IDs.',
      )
      console.log(
        '   This provides better security by hiding predictable ID patterns in URLs and APIs.',
      )
    }
  } catch (error) {
    console.error('❌ Error checking database:', error.message)
  } finally {
    await pool.end()
  }
}

verifyUUIDSetup()
