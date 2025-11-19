require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

async function runMigration() {
  let client;
  try {
    console.log('🔄 Running eLearning tables migration...\n');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'migrations', 'create_elearning_tables.sql');
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
    
    // Split SQL by semicolons, but preserve multi-line statements
    // Remove comments first
    const cleanSql = sql
      .split('\n')
      .map(line => {
        // Remove inline comments
        const commentIndex = line.indexOf('--');
        return commentIndex >= 0 ? line.substring(0, commentIndex) : line;
      })
      .join('\n');
    
    // Split by semicolon, but keep multi-line statements together
    const rawStatements = cleanSql
      .split(';')
      .map(s => s.trim().replace(/\n+/g, ' ').replace(/\s+/g, ' '))
      .filter(s => s.length > 0);
    
    const tableStatements = rawStatements.filter(s => s.toUpperCase().includes('CREATE TABLE'));
    const indexStatements = rawStatements.filter(s => s.toUpperCase().includes('CREATE INDEX'));
    
    console.log(`📝 Found ${tableStatements.length} table statements and ${indexStatements.length} index statements\n`);
    
    // First, create all tables
    console.log('📦 Creating tables...\n');
    for (let i = 0; i < tableStatements.length; i++) {
      const statement = tableStatements[i];
      
      try {
        const match = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
        const tableName = match ? match[1] : 'unknown';
        
        if (tableName !== 'unknown') {
          console.log(`  📦 Creating table: ${tableName}...`);
        }
        
        await client.query(statement + ';');
        
        if (tableName !== 'unknown') {
          console.log(`  ✅ ${tableName} created successfully`);
        }
      } catch (error) {
        // Ignore "already exists" errors
        if (error.code === '42P07') {
          const match = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
          const tableName = match ? match[1] : 'unknown';
          console.log(`  ℹ️  Table ${tableName} already exists. Skipping...`);
        } else {
          console.error(`  ❌ Error creating table:`, error.message);
          throw error;
        }
      }
    }
    
    // Then, create all indexes
    console.log('\n📊 Creating indexes...\n');
    for (let i = 0; i < indexStatements.length; i++) {
      const statement = indexStatements[i];
      
      try {
        const match = statement.match(/CREATE INDEX IF NOT EXISTS (\w+)/i);
        const indexName = match ? match[1] : 'unknown';
        
        if (indexName !== 'unknown') {
          console.log(`  📊 Creating index: ${indexName}...`);
        }
        
        await client.query(statement + ';');
        
        if (indexName !== 'unknown') {
          console.log(`  ✅ ${indexName} created successfully`);
        }
      } catch (error) {
        // Ignore "already exists" errors
        if (error.code === '42710' || error.code === '42P07') {
          const match = statement.match(/CREATE INDEX IF NOT EXISTS (\w+)/i);
          const indexName = match ? match[1] : 'unknown';
          console.log(`  ℹ️  Index ${indexName} already exists. Skipping...`);
        } else {
          console.error(`  ❌ Error creating index:`, error.message);
          throw error;
        }
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');
    
    // Verify tables were created
    console.log('🔍 Verifying created tables...\n');
    const tables = [
      'modules', 'lessons', 'user_progress', 'certificates',
      'notes', 'discussions', 'discussion_replies',
      'quizzes', 'quiz_attempts', 'assignments', 'assignment_submissions',
      'payment_orders', 'notifications'
    ];
    
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
        // Count rows if table exists
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table};`);
        const count = parseInt(countResult.rows[0].count);
        console.log(`  ✅ ${table} - exists (${count} rows)`);
      } else {
        console.log(`  ⚠️  ${table} - not found`);
      }
    }
    
    console.log('\n✅ Migration completed successfully!\n');
    console.log('📚 All eLearning tables are ready to use!\n');
    
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
    console.error('Error code:', error.code);
    
    if (error.code === '42P07') {
      console.log('ℹ️  Some tables already exist. This is okay if you\'re re-running the migration.');
    } else if (error.code === '42710') {
      console.log('ℹ️  Some indexes already exist. This is okay if you\'re re-running the migration.');
    } else {
      console.error('Full error:', error);
    }
    
    await pool.end();
    process.exit(1);
  }
}

runMigration();

