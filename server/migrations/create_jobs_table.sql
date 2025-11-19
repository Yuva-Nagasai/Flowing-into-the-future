-- Create jobs table for career postings
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(active);
CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- Add some sample data (optional)
INSERT INTO jobs (title, department, location, type, description, requirements, active) VALUES
  ('Full Stack Developer', 'Engineering', 'Remote', 'Full-time', 'Build scalable web applications using React, Node.js, and modern technologies.', ARRAY['3+ years experience', 'React & Node.js', 'Database management', 'RESTful APIs'], true),
  ('UI/UX Designer', 'Design', 'Hybrid', 'Full-time', 'Create beautiful, intuitive user experiences for our platform and academy.', ARRAY['2+ years experience', 'Figma proficiency', 'User research', 'Responsive design'], true),
  ('Course Instructor - AI/ML', 'Education', 'Remote', 'Part-time', 'Teach AI and Machine Learning courses on NanoFlows Academy platform.', ARRAY['Expert in AI/ML', 'Teaching experience', 'Strong communication', 'Course development'], true)
ON CONFLICT DO NOTHING;

