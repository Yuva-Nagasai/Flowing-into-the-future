require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

async function runMigration() {
  try {
    console.log('🔄 Running about_sections table migration...\n');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'migrations', 'create_about_sections_table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Execute the SQL
    console.log('📝 Creating about_sections tables...');
    await pool.query(sql);
    console.log('✅ About sections tables created');
    
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

runMigration();

