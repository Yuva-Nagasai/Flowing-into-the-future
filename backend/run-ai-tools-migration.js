require('dotenv').config();
const pool = require('./src/config/db');

async function runMigration() {
  try {
    console.log('🔄 Running AI tools table migration...\n');
    
    // Create table
    console.log('📝 Creating ai_tools table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_tools (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        color TEXT NOT NULL,
        features TEXT[] NOT NULL,
        pricing_type TEXT NOT NULL CHECK (pricing_type IN ('free', 'paid')),
        url TEXT NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ AI tools table created');
    
    // Create indexes
    console.log('📝 Creating indexes...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_ai_tools_active ON ai_tools(active);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_ai_tools_category ON ai_tools(category);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_ai_tools_pricing_type ON ai_tools(pricing_type);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_ai_tools_created_at ON ai_tools(created_at DESC);');
    console.log('✅ Indexes created');
    
    // Check if table is empty
    console.log('📝 Checking for existing data...');
    const countResult = await pool.query('SELECT COUNT(*) as count FROM ai_tools;');
    const count = parseInt(countResult.rows[0].count);
    
    if (count === 0) {
      console.log('📝 Inserting sample data...');
      await pool.query(`
        INSERT INTO ai_tools (name, description, category, color, features, pricing_type, url, active) VALUES
          ('AI Text Generator', 'Generate high-quality content, articles, and creative writing with advanced AI language models.', 'text', 'from-blue-500 to-cyan-500', ARRAY['Content Creation', 'Article Writing', 'Creative Stories'], 'free', 'https://chat.openai.com', true),
          ('Smart Chatbot', 'Engage in natural conversations, get answers, and receive personalized assistance instantly.', 'text', 'from-purple-500 to-pink-500', ARRAY['24/7 Support', 'Multi-language', 'Context Awareness'], 'free', 'https://chat.openai.com', true),
          ('Image Creator', 'Transform your ideas into stunning visuals with AI-powered image generation technology.', 'image', 'from-orange-500 to-red-500', ARRAY['Text-to-Image', 'Style Transfer', 'High Resolution'], 'free', 'https://www.midjourney.com', true);
      `);
      console.log('✅ Sample data inserted');
    } else {
      console.log(`ℹ️  Table already has ${count} tools. Skipping sample data.`);
    }
    
    console.log('\n✅ Migration completed successfully!');
    console.log(`📊 Total AI tools in database: ${count === 0 ? 3 : count}\n`);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.code === '42P07') {
      console.log('ℹ️  Table already exists. This is okay!');
    } else {
      console.error('Full error:', error);
    }
    await pool.end();
    process.exit(1);
  }
}

runMigration();

