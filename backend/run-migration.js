require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

async function runMigration() {
  try {
    console.log('🔄 Running jobs table migration...\n');
    
    // Create table
    console.log('📝 Creating jobs table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        department TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT[] NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ Jobs table created');
    
    // Create indexes
    console.log('📝 Creating indexes...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(active);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);');
    console.log('✅ Indexes created');
    
    // Insert sample data (only if table is empty)
    console.log('📝 Checking for existing data...');
    const countResult = await pool.query('SELECT COUNT(*) as count FROM jobs;');
    const count = parseInt(countResult.rows[0].count);
    
    if (count === 0) {
      console.log('📝 Inserting sample data...');
      await pool.query(`
        INSERT INTO jobs (title, department, location, type, description, requirements, active) VALUES
          ('Full Stack Developer', 'Engineering', 'Remote', 'Full-time', 'Build scalable web applications using React, Node.js, and modern technologies.', ARRAY['3+ years experience', 'React & Node.js', 'Database management', 'RESTful APIs'], true),
          ('UI/UX Designer', 'Design', 'Hybrid', 'Full-time', 'Create beautiful, intuitive user experiences for our platform and academy.', ARRAY['2+ years experience', 'Figma proficiency', 'User research', 'Responsive design'], true),
          ('Course Instructor - AI/ML', 'Education', 'Remote', 'Part-time', 'Teach AI and Machine Learning courses on NanoFlows Academy platform.', ARRAY['Expert in AI/ML', 'Teaching experience', 'Strong communication', 'Course development'], true);
      `);
      console.log('✅ Sample data inserted');
    } else {
      console.log(`ℹ️  Table already has ${count} jobs. Skipping sample data.`);
    }
    
    console.log('\n✅ Migration completed successfully!');
    console.log(`📊 Total jobs in database: ${count === 0 ? 3 : count}\n`);
    
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

