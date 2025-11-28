require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

async function runMigration() {
  let client;
  try {
    console.log('🔄 Running videos and resources tables migration...\n');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'migrations', 'create_videos_table.sql');
    console.log(`📖 Reading migration file: ${sqlFilePath}`);
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`Migration file not found: ${sqlFilePath}`);
    }
    
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('✅ Migration file loaded\n');
    
    // Get a client from the pool for transaction
    client = await pool.connect();
    console.log('📊 Database connection established\n');
    
    // Start transaction
    await client.query('BEGIN');
    console.log('🔄 Starting transaction...\n');
    
    // Execute SQL
    await client.query(sql);
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');
    
    // Verify tables were created
    console.log('🔍 Verifying created tables...\n');
    const tables = ['videos', 'resources'];
    
    for (const table of tables) {
      const result = await client.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );`,
        [table]
      );
      
      if (result.rows[0].exists) {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table};`);
        const count = parseInt(countResult.rows[0].count);
        console.log(`  ✅ ${table} - exists (${count} rows)`);
      } else {
        console.log(`  ⚠️  ${table} - not found`);
      }
    }
    
    console.log('\n✅ Migration completed successfully!\n');
    
    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    if (client) {
      try {
        await client.query('ROLLBACK');
        console.log('\n🔄 Transaction rolled back');
      } catch (rollbackError) {
        console.error('Error rolling back:', rollbackError);
      }
      client.release();
    }
    
    console.error('\n❌ Migration failed:', error.message);
    if (error.code === '42P07' || error.code === '42710') {
      console.log('ℹ️  Tables/indexes already exist. This is okay.');
    } else {
      console.error('Full error:', error);
    }
    
    await pool.end();
    process.exit(1);
  }
}

runMigration();

