-- ============================================================================
-- NanoFlows Academy - Complete Database Migration
-- ============================================================================
-- This file contains all database migrations in one place.
-- Run this file to set up all tables for a new database.
-- All tables use IF NOT EXISTS, so it's safe to run multiple times.
-- 
-- Prerequisites: 'users' and 'courses' tables must already exist.
-- ============================================================================

-- ============================================================================
-- 1. AI TOOLS TABLES
-- ============================================================================
-- Create ai_tools table for AI tools showcase
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_tools_active ON ai_tools(active);
CREATE INDEX IF NOT EXISTS idx_ai_tools_category ON ai_tools(category);
CREATE INDEX IF NOT EXISTS idx_ai_tools_pricing_type ON ai_tools(pricing_type);
CREATE INDEX IF NOT EXISTS idx_ai_tools_created_at ON ai_tools(created_at DESC);


-- ============================================================================
-- 2. JOBS TABLES
-- ============================================================================
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


-- ============================================================================
-- 3. ABOUT SECTIONS TABLES
-- ============================================================================
-- Create about_sections table for dynamic About page content
CREATE TABLE IF NOT EXISTS about_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type TEXT NOT NULL CHECK (section_type IN ('mission', 'team', 'vision', 'growth', 'clients')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  icon_name TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section_type)
);

-- Create about_section_images table for managing images separately
CREATE TABLE IF NOT EXISTS about_section_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES about_sections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  image_type TEXT CHECK (image_type IN ('mission', 'team', 'vision', 'growth', 'clients')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create about_team_members table for team section
CREATE TABLE IF NOT EXISTS about_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES about_sections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT NOT NULL,
  portfolio_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create about_company_logos table for clients section
CREATE TABLE IF NOT EXISTS about_company_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES about_sections(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT,
  icon_name TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_about_sections_type ON about_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_about_sections_active ON about_sections(active);
CREATE INDEX IF NOT EXISTS idx_about_section_images_section ON about_section_images(section_id);
CREATE INDEX IF NOT EXISTS idx_about_team_members_section ON about_team_members(section_id);
CREATE INDEX IF NOT EXISTS idx_about_company_logos_section ON about_company_logos(section_id);


-- ============================================================================
-- 4. VIDEOS AND RESOURCES TABLES (Legacy Support)
-- ============================================================================
-- Create videos table for backward compatibility
-- Note: New structure uses lessons table, but videos table is kept for legacy support
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration TEXT DEFAULT '0:00',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create resources table if it doesn't exist
-- Note: resources can belong to either a course (course_id) or a module (module_id)
-- module_id is added later via ALTER TABLE after modules table is created
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_videos_course ON videos(course_id);
CREATE INDEX IF NOT EXISTS idx_resources_course ON resources(course_id);


-- ============================================================================
-- 5. E-LEARNING TABLES (Modules, Lessons, Progress, etc.)
-- ============================================================================
-- Create modules table (course → modules → lessons)
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lessons table (modules → lessons → videos)
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  video_duration TEXT DEFAULT '0:00',
  content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video', 'quiz', 'assignment', 'text')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create progress tracking table (enhanced)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completion_percentage INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  last_position INTEGER DEFAULT 0, -- video position in seconds
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  certificate_id TEXT UNIQUE NOT NULL,
  certificate_url TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp INTEGER DEFAULT 0, -- video timestamp in seconds
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create discussion forum table
CREATE TABLE IF NOT EXISTS discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create discussion replies table
CREATE TABLE IF NOT EXISTS discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quizzes table
-- Note: quizzes can belong to either a lesson (lesson_id) or a module (module_id)
-- module_id is added later via ALTER TABLE for module-level quizzes
-- For backward compatibility, lesson_id is still supported, but new quizzes should use module_id
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  points INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create assignments table
-- Note: assignments can belong to either a lesson (lesson_id) or a module (module_id)
-- module_id is added later via ALTER TABLE for module-level assignments
-- For backward compatibility, lesson_id is still supported, but new assignments should use module_id
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMPTZ,
  max_points INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create assignment submissions table
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  submission_text TEXT,
  submission_file_url TEXT,
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ
);

-- Create payment orders table (for Razorpay)
CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  razorpay_order_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('signup', 'payment_success', 'course_update', 'certificate_issued', 'assignment_graded')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_lesson ON notes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_discussions_course ON discussions(course_id);
CREATE INDEX IF NOT EXISTS idx_discussions_lesson ON discussions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion ON discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson ON quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_module ON quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_assignments_lesson ON assignments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_assignments_module ON assignments(module_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_user ON assignment_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_user ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);


-- ============================================================================
-- 6. COURSE ENHANCEMENTS (Free Course Support)
-- ============================================================================
-- Add free and short_description fields to courses table
-- Note: courses table should already exist (prerequisite)

-- Add free field (default to false for existing courses)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS free BOOLEAN DEFAULT FALSE;

-- Add short_description field (nullable)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Update existing courses: if price is 0, set free to true
UPDATE courses 
SET free = TRUE 
WHERE (price = 0 OR price IS NULL) AND (free IS NULL OR free = FALSE);

-- Create index for free courses (for faster queries)
CREATE INDEX IF NOT EXISTS idx_courses_free ON courses(free) WHERE free = TRUE;

-- Add comments to explain the fields
COMMENT ON COLUMN courses.free IS 'If true, course can be accessed without purchase';
COMMENT ON COLUMN courses.short_description IS 'Brief description shown in course listings (typically 100-200 characters)';


-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All tables have been created successfully!
-- All tables use IF NOT EXISTS, so this script can be safely re-run.
-- ============================================================================

-- ============================================================================
-- 7. MODULE-LEVEL RESOURCES
-- ============================================================================
-- Add module_id to resources table for module-level resources
-- This allows resources to be associated with specific modules

ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE CASCADE;

-- Create index for module resources
CREATE INDEX IF NOT EXISTS idx_resources_module ON resources(module_id);

-- Add comment
COMMENT ON COLUMN resources.module_id IS 'If set, resource belongs to a specific module. If NULL, resource belongs to course (legacy)';


-- ============================================================================
-- 8. MODULE-LEVEL QUIZZES AND ASSIGNMENTS
-- ============================================================================
-- Add module_id to quizzes and assignments tables for module-level content
-- This allows quizzes and assignments to be associated with specific modules
-- instead of individual lessons

-- Add module_id to quizzes table
ALTER TABLE quizzes 
ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE CASCADE;

-- Add module_id to assignments table
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE CASCADE;

-- Create indexes for module-level queries
CREATE INDEX IF NOT EXISTS idx_quizzes_module ON quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_assignments_module ON assignments(module_id);

-- Add comments to explain the fields
COMMENT ON COLUMN quizzes.module_id IS 'If set, quiz belongs to a specific module. If NULL, quiz belongs to lesson (legacy)';
COMMENT ON COLUMN assignments.module_id IS 'If set, assignment belongs to a specific module. If NULL, assignment belongs to lesson (legacy)';


-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All tables and columns have been created successfully!
-- All statements use IF NOT EXISTS / ADD COLUMN IF NOT EXISTS, 
-- so this script can be safely re-run.
-- ============================================================================
