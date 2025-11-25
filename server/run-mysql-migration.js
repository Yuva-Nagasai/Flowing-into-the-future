require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Show immediate output
console.log('🔄 Starting MySQL/TiDB Cloud Migration...\n');
console.log('📊 Loading database configuration...');

// Import db config (this might take a moment)
const pool = require('./src/config/db');

async function runMigration() {
  let connection;
  try {
    console.log('📊 Attempting to connect to database...');
    
    // Add timeout for connection
    const connectionPromise = pool.getConnection();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout after 30 seconds')), 30000)
    );
    
    connection = await Promise.race([connectionPromise, timeoutPromise]);
    console.log('✅ Connected to MySQL/TiDB Cloud database\n');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'migrations', 'mysql_complete_migration.sql');
    console.log(`📖 Reading migration file: ${migrationPath}`);
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }
    
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split SQL into individual statements
    // Remove comments and empty lines, then split by semicolons
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => 
        stmt.length > 0 && 
        !stmt.startsWith('--') && 
        !stmt.startsWith('/*') &&
        stmt !== '='
      );
    
    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
    
    // Execute each statement
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip if it's just a separator or comment
      if (statement.length < 10 || statement.match(/^={3,}$/)) {
        continue;
      }
      
      try {
        // Add semicolon back for execution
        await connection.execute(statement + ';');
        successCount++;
        
        // Show progress for important operations
        if (statement.toUpperCase().startsWith('CREATE TABLE')) {
          const tableMatch = statement.match(/CREATE TABLE.*?`?(\w+)`?/i);
          const tableName = tableMatch ? tableMatch[1] : 'unknown';
          console.log(`  ✅ Created table: ${tableName}`);
        } else if (statement.toUpperCase().startsWith('CREATE INDEX')) {
          const indexMatch = statement.match(/CREATE INDEX.*?`?(\w+)`?/i);
          const indexName = indexMatch ? indexMatch[1] : 'unknown';
          console.log(`  ✅ Created index: ${indexName}`);
        }
      } catch (error) {
        // Ignore "table already exists" errors (IF NOT EXISTS should handle this, but just in case)
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
            error.code === 'ER_DUP_KEYNAME' ||
            error.message.includes('already exists')) {
          successCount++;
          continue;
        }
        
        errorCount++;
        console.error(`  ❌ Error executing statement ${i + 1}:`, error.message);
        console.error(`  Statement: ${statement.substring(0, 100)}...`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log(`  ✅ Successful: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log('='.repeat(60) + '\n');
    
    if (errorCount === 0) {
      console.log('✅ Migration completed successfully!');
      console.log('🎉 All tables have been created in your MySQL/TiDB Cloud database.\n');
      
      // Show table count
      try {
        const [tables] = await connection.execute(
          "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE()"
        );
        console.log(`📊 Total tables in database: ${tables[0].count}\n`);
      } catch (err) {
        // Ignore if we can't get table count
      }
    } else {
      console.log('⚠️  Migration completed with some errors.');
      console.log('   Please review the errors above and fix any issues.\n');
    }
    
    connection.release();
    process.exit(errorCount > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    
    if (error.message.includes('timeout')) {
      console.error('\n💡 Connection timeout - The database connection is taking too long.');
      console.error('   This usually means:');
      console.error('   1. Database server is not reachable');
      console.error('   2. Firewall is blocking the connection');
      console.error('   3. TiDB Cloud endpoint is disabled');
      console.error('   4. Network issues\n');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      console.error('\n💡 Connection Error - Cannot reach the database server.');
      console.error('   Troubleshooting:');
      console.error('   1. Check your DATABASE_URL in server/.env file');
      console.error('   2. Verify your TiDB Cloud endpoint is enabled');
      console.error('   3. Check firewall/network settings');
      console.error('   4. Ensure mysql2 package is installed: npm install mysql2\n');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.message.includes('Access denied')) {
      console.error('\n💡 Authentication Error - Wrong username or password.');
      console.error('   Check your MySQL credentials in server/.env file\n');
    } else {
      console.error('Full error details:', error);
    }
    
    if (connection) {
      try {
        connection.release();
      } catch (e) {
        // Ignore release errors
      }
    }
    process.exit(1);
  }
}

// Run migration with error handling
runMigration().catch(error => {
  console.error('\n❌ Unhandled error:', error);
  process.exit(1);
});

