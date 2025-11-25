// Simple migration runner - outputs everything immediately
console.log('=== MIGRATION START ===');
console.log('');

const fs = require('fs');
const path = require('path');

console.log('Step 1: Reading SQL file...');
const sqlFile = path.join(__dirname, 'migrations', 'mysql_complete_migration.sql');

if (!fs.existsSync(sqlFile)) {
  console.error('ERROR: SQL file not found:', sqlFile);
  process.exit(1);
}

console.log('✅ SQL file found');
console.log('');

console.log('Step 2: Loading environment...');
require('dotenv').config();
console.log('✅ Environment loaded');
console.log('');

console.log('Step 3: Loading mysql2...');
const mysql = require('mysql2/promise');
console.log('✅ mysql2 loaded');
console.log('');

console.log('Step 4: Setting up connection...');
const config = {
  host: process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT) || 3306,
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'test',
  connectTimeout: 10000
};

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mysql://')) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    config.host = url.hostname;
    config.port = parseInt(url.port) || 3306;
    config.user = url.username;
    config.password = url.password;
    config.database = url.pathname.slice(1);
  } catch (err) {
    console.error('Error parsing DATABASE_URL');
  }
}

console.log(`Connecting to: ${config.user}@${config.host}:${config.port}/${config.database}`);
console.log('');

(async () => {
  let connection;
  try {
    console.log('Step 5: Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected!');
    console.log('');

    console.log('Step 6: Reading SQL file...');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log('✅ SQL file read');
    console.log('');

    console.log('Step 7: Executing SQL statements...');
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 10 && !s.startsWith('--') && !s.match(/^={3,}$/));

    console.log(`Found ${statements.length} statements to execute`);
    console.log('');

    let success = 0;
    let errors = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await connection.execute(stmt + ';');
        success++;
        if (stmt.toUpperCase().startsWith('CREATE TABLE')) {
          const match = stmt.match(/CREATE TABLE.*?`?(\w+)`?/i);
          if (match) console.log(`  ✅ Table: ${match[1]}`);
        }
      } catch (err) {
        if (err.code !== 'ER_TABLE_EXISTS_ERROR' && err.code !== 'ER_DUP_KEYNAME') {
          errors++;
          console.error(`  ❌ Error: ${err.message.substring(0, 50)}`);
        } else {
          success++;
        }
      }
    }

    console.log('');
    console.log('=== MIGRATION COMPLETE ===');
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Errors: ${errors}`);
    console.log('');

    await connection.end();
    process.exit(errors > 0 ? 1 : 0);

  } catch (error) {
    console.error('');
    console.error('=== CONNECTION ERROR ===');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('');
    console.error('💡 The database connection failed.');
    console.error('   Please use TiDB Cloud Web Console to run the SQL file manually.');
    console.error('');
    if (connection) await connection.end();
    process.exit(1);
  }
})();

