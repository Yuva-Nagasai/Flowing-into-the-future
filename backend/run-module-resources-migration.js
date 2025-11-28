require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

async function runMigration() {
  let client;
  try {
    console.log('🔄 Running module resources migration (module_id column)...\n');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'migrations', 'add_module_resources.sql');
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
    const statements = cleanSql
      .split(';')
      .map(s => s.trim().replace(/\n+/g, ' ').replace(/\s+/g, ' '))
      .filter(s => s.length > 0);
    
    console.log(`📝 Found ${statements.length} SQL statements\n`);
    
    // Execute each statement
    console.log('📦 Executing migration statements...\n');
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        // Identify statement type
        const upperStatement = statement.toUpperCase();
        let statementType = 'Unknown';
        let statementName = '';
        
        if (upperStatement.includes('ALTER TABLE')) {
          statementType = 'ALTER TABLE';
          const match = statement.match(/ALTER TABLE\s+(\w+)/i);
          statementName = match ? match[1] : 'unknown';
          
          // Check what column is being added
          const columnMatch = statement.match(/ADD COLUMN IF NOT EXISTS (\w+)/i);
          if (columnMatch) {
            console.log(`  📝 Adding column: ${statementName}.${columnMatch[1]}...`);
          } else {
            console.log(`  📝 Altering table: ${statementName}...`);
          }
        } else if (upperStatement.includes('CREATE INDEX')) {
          statementType = 'CREATE INDEX';
          const match = statement.match(/CREATE INDEX IF NOT EXISTS (\w+)/i);
          statementName = match ? match[1] : 'unknown';
          console.log(`  📊 Creating index: ${statementName}...`);
        } else if (upperStatement.includes('COMMENT')) {
          statementType = 'COMMENT';
          console.log(`  💬 Adding comment...`);
        }
        
        await client.query(statement + ';');
        
        if (statementType === 'ALTER TABLE' && statement.includes('ADD COLUMN')) {
          const columnMatch = statement.match(/ADD COLUMN IF NOT EXISTS (\w+)/i);
          if (columnMatch) {
            console.log(`  ✅ Column ${statementName}.${columnMatch[1]} added successfully`);
          } else {
            console.log(`  ✅ Table ${statementName} altered successfully`);
          }
        } else if (statementType === 'CREATE INDEX') {
          console.log(`  ✅ Index ${statementName} created successfully`);
        } else if (statementType === 'COMMENT') {
          console.log(`  ✅ Comment added successfully`);
        }
      } catch (error) {
        // Ignore "already exists" errors for columns and indexes
        if (error.code === '42710' || error.code === '42P07' || error.code === '42701') {
          if (error.code === '42701') {
            console.log(`  ℹ️  Column already exists. Skipping...`);
          } else {
            console.log(`  ℹ️  Object already exists. Skipping...`);
          }
        } else {
          console.error(`  ❌ Error executing statement:`, error.message);
          throw error;
        }
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');
    
    // Verify column was added
    console.log('🔍 Verifying column was added...\n');
    
    const columnsCheck = await client.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'resources'
      AND column_name = 'module_id'
      ORDER BY column_name;
    `);
    
    if (columnsCheck.rows.length > 0) {
      console.log('  ✅ Column found in resources table:');
      columnsCheck.rows.forEach(row => {
        console.log(`    - ${row.column_name} (${row.data_type}, nullable: ${row.is_nullable})`);
      });
    } else {
      console.log('  ⚠️  Column not found in resources table');
    }
    
    // Check index
    const indexCheck = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'resources' 
      AND indexname = 'idx_resources_module';
    `);
    
    if (indexCheck.rows.length > 0) {
      console.log('\n  ✅ Index idx_resources_module exists');
    } else {
      console.log('\n  ⚠️  Index idx_resources_module not found');
    }
    
    // Count module resources
    const moduleResourcesCount = await client.query('SELECT COUNT(*) as count FROM resources WHERE module_id IS NOT NULL;');
    const moduleCount = parseInt(moduleResourcesCount.rows[0]?.count || 0);
    console.log(`\n  📊 Total module-level resources: ${moduleCount}`);
    
    // Count course-level resources (legacy)
    const courseResourcesCount = await client.query('SELECT COUNT(*) as count FROM resources WHERE module_id IS NULL;');
    const courseCount = parseInt(courseResourcesCount.rows[0]?.count || 0);
    console.log(`  📊 Total course-level resources (legacy): ${courseCount}`);
    
    console.log('\n✅ Migration completed successfully!\n');
    console.log('🎉 Resources table now supports module-level resources!\n');
    
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
    
    if (error.code === '42701') {
      console.log('ℹ️  Column already exists. This is okay if you\'re re-running the migration.');
    } else if (error.code === '42P07' || error.code === '42710') {
      console.log('ℹ️  Some objects already exist. This is okay if you\'re re-running the migration.');
    } else {
      console.error('Full error:', error);
    }
    
    await pool.end();
    process.exit(1);
  }
}

runMigration();

