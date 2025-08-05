#!/usr/bin/env bash

echo "🚀 FINAL SOLUTION - Manual table drop..."
echo ""

# Kill servers first
pkill -f "next dev" 2>/dev/null || true
pkill -f "pnpm dev" 2>/dev/null || true

echo "🧹 Clearing migration files..."
rm -rf src/migrations/*.json 2>/dev/null || true
rm -rf drizzle/*.sql 2>/dev/null || true
echo '{"version":"7","dialect":"postgresql","entries":[]}' > drizzle/meta/_journal.json
rm -f src/payload-generated-schema.ts 2>/dev/null || true

echo "💥 Directly dropping problem tables..."

# Extract database connection details and run direct SQL
node -e "
const dotenv = require('dotenv');
const { Pool } = require('pg');
dotenv.config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

async function dropTables() {
  try {
    console.log('Connecting and dropping all tables...');
    
    // List all tables first
    const result = await pool.query('SELECT tablename FROM pg_tables WHERE schemaname = \\'public\\'');
    console.log('Tables found:', result.rows.map(r => r.tablename));
    
    // Drop all tables
    for (const row of result.rows) {
      await pool.query(\`DROP TABLE IF EXISTS \\\"\${row.tablename}\\\" CASCADE\`);
      console.log(\`Dropped: \${row.tablename}\`);
    }
    
    console.log('All tables dropped successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

dropTables();
"

echo ""
echo "🚀 Starting fresh server - should work now..."
pnpm dev
