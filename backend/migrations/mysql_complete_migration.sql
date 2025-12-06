-- ============================================================================
-- NanoFlows Academy - Complete MySQL/TiDB Cloud Migration
-- ============================================================================
-- This file contains all database migrations converted from PostgreSQL to MySQL
-- Run this file to set up all tables for a new MySQL/TiDB Cloud database.
-- All tables use IF NOT EXISTS, so it's safe to run multiple times.
-- ============================================================================

-- ============================================================================
-- 1. USERS TABLE (Base table - must be created first)
-- ============================================================================

SET @@SESSION.time_zone = '+00:00';

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'instructor') NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'instructor') NOT NULL DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================================================
-- 2. COURSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS courses ( 
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  category VARCHAR(100) NOT NULL,
  thumbnail TEXT,
  promotional_video TEXT,
  instructor_name VARCHAR(255) NOT NULL DEFAULT 'Admin',
  published BOOLEAN DEFAULT FALSE,
  free BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_published ON courses(published);
CREATE INDEX idx_courses_free ON courses(free);
CREATE INDEX idx_courses_category ON courses(category);

-- ============================================================================
-- 3. PURCHASES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS purchases (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  razorpay_payment_id VARCHAR(255) NOT NULL,
  razorpay_order_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_course (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_purchases_course ON purchases(course_id);
CREATE INDEX idx_purchases_status ON purchases(status);

-- ============================================================================
-- 4. VIDEOS TABLE (Legacy Support)
-- ============================================================================

CREATE TABLE IF NOT EXISTS videos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  course_id CHAR(36) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration VARCHAR(20) DEFAULT '0:00',
  order_index INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_videos_course ON videos(course_id);
CREATE INDEX idx_videos_order ON videos(course_id, order_index);

-- ============================================================================
-- 5. MODULES TABLE (Created before resources to allow foreign key)
-- ============================================================================
CREATE TABLE IF NOT EXISTS modules (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  course_id CHAR(36) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, order_index);

-- ============================================================================
-- 6. RESOURCES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS resources (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  course_id CHAR(36),
  module_id CHAR(36),
  title VARCHAR(500) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) DEFAULT 'pdf',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

CREATE INDEX idx_resources_course ON resources(course_id);
CREATE INDEX idx_resources_module ON resources(module_id);

-- ============================================================================
-- 7. LESSONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS lessons (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  module_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  video_url TEXT,
  video_duration VARCHAR(20) DEFAULT '0:00',
  content_type ENUM('video', 'quiz', 'assignment', 'text') DEFAULT 'video',
  order_index INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_order ON lessons(module_id, order_index);

-- ============================================================================
-- 8. USER PROGRESS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_progress (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  lesson_id CHAR(36) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completion_percentage INT DEFAULT 0,
  time_spent INT DEFAULT 0,
  last_position INT DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_lesson (user_id, lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_course ON user_progress(course_id);
CREATE INDEX idx_user_progress_lesson ON user_progress(lesson_id);

-- ============================================================================
-- 9. CERTIFICATES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS certificates (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  certificate_id VARCHAR(255) UNIQUE NOT NULL,
  certificate_url TEXT,
  issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_course ON certificates(course_id);
CREATE INDEX idx_certificates_cert_id ON certificates(certificate_id);

-- ============================================================================
-- 10. NOTES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  lesson_id CHAR(36) NOT NULL,
  content TEXT NOT NULL,
  timestamp INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE INDEX idx_notes_user ON notes(user_id);
CREATE INDEX idx_notes_lesson ON notes(lesson_id);
CREATE INDEX idx_notes_course ON notes(course_id);

-- ============================================================================
-- 11. DISCUSSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS discussions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  lesson_id CHAR(36) NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE INDEX idx_discussions_course ON discussions(course_id);
CREATE INDEX idx_discussions_lesson ON discussions(lesson_id);
CREATE INDEX idx_discussions_user ON discussions(user_id);

-- ============================================================================
-- 12. DISCUSSION REPLIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS discussion_replies (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  discussion_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_discussion_replies_discussion ON discussion_replies(discussion_id);
CREATE INDEX idx_discussion_replies_user ON discussion_replies(user_id);

-- ============================================================================
-- 13. QUIZZES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS quizzes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  lesson_id CHAR(36),
  module_id CHAR(36),
  course_id CHAR(36) NOT NULL,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  correct_answer INT NOT NULL,
  points INT DEFAULT 1,
  order_index INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_quizzes_lesson ON quizzes(lesson_id);
CREATE INDEX idx_quizzes_module ON quizzes(module_id);
CREATE INDEX idx_quizzes_course ON quizzes(course_id);

-- ============================================================================
-- 14. QUIZ ATTEMPTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  quiz_id CHAR(36) NOT NULL,
  lesson_id CHAR(36),
  course_id CHAR(36) NOT NULL,
  selected_answer INT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  score INT DEFAULT 0,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_course ON quiz_attempts(course_id);

-- ============================================================================
-- 15. ASSIGNMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS assignments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  lesson_id CHAR(36),
  module_id CHAR(36),
  course_id CHAR(36) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  due_date DATETIME,
  max_points INT DEFAULT 100,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_assignments_lesson ON assignments(lesson_id);
CREATE INDEX idx_assignments_module ON assignments(module_id);
CREATE INDEX idx_assignments_course ON assignments(course_id);

-- ============================================================================
-- 16. ASSIGNMENT SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  assignment_id CHAR(36) NOT NULL,
  lesson_id CHAR(36),
  course_id CHAR(36) NOT NULL,
  submission_text TEXT,
  submission_file_url TEXT,
  score INT,
  feedback TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  graded_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_assignment_submissions_user ON assignment_submissions(user_id);
CREATE INDEX idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_course ON assignment_submissions(course_id);

-- ============================================================================
-- 17. PAYMENT ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_orders (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status ENUM('pending', 'paid', 'failed', 'cancelled') DEFAULT 'pending',
  razorpay_payment_id VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_payment_orders_user ON payment_orders(user_id);
CREATE INDEX idx_payment_orders_status ON payment_orders(status);
CREATE INDEX idx_payment_orders_razorpay_id ON payment_orders(razorpay_order_id);

-- ============================================================================
-- 18. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  type ENUM('signup', 'payment_success', 'course_update', 'certificate_issued', 'assignment_graded') NOT NULL,
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, `read`);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ============================================================================
-- 19. JOBS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS jobs (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(500) NOT NULL,
  department VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  requirements JSON NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_active ON jobs(active);
CREATE INDEX idx_jobs_department ON jobs(department);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);

-- ============================================================================
-- 20. AI TOOLS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_tools (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  color VARCHAR(50) NOT NULL,
  features JSON NOT NULL,
  pricing_type ENUM('free', 'paid') NOT NULL,
  url TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_tools_active ON ai_tools(active);
CREATE INDEX idx_ai_tools_category ON ai_tools(category);
CREATE INDEX idx_ai_tools_pricing_type ON ai_tools(pricing_type);
CREATE INDEX idx_ai_tools_created_at ON ai_tools(created_at);

-- ============================================================================
-- 21b. HERO SLIDES TABLE (Homepage hero slider)
-- ============================================================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  variant ENUM('default', 'showcase', 'services') NOT NULL DEFAULT 'default',
  title VARCHAR(255),
  highlight VARCHAR(255),
  subtitle TEXT,
  button_text VARCHAR(255),
  pre_heading VARCHAR(255),
  heading VARCHAR(255),
  description TEXT,
  categories JSON,
  primary_cta_label VARCHAR(255),
  primary_cta_route VARCHAR(255),
  secondary_cta_label VARCHAR(255),
  secondary_cta_route VARCHAR(255),
  trust_badges JSON,
  background_image VARCHAR(512) NULL,
  background_overlay VARCHAR(128) NULL,
  services JSON NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- 21. ABOUT SECTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS about_sections (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  section_type ENUM('mission', 'team', 'vision', 'growth', 'clients') NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  icon_name VARCHAR(100),
  images JSON DEFAULT ('[]'),
  order_index INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_section_type (section_type)
);

CREATE INDEX idx_about_sections_type ON about_sections(section_type);
CREATE INDEX idx_about_sections_active ON about_sections(active);

-- ============================================================================
-- 22. ABOUT SECTION IMAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS about_section_images (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  section_id CHAR(36) NOT NULL,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  image_type ENUM('mission', 'team', 'vision', 'growth', 'clients'),
  order_index INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES about_sections(id) ON DELETE CASCADE
);

CREATE INDEX idx_about_section_images_section ON about_section_images(section_id);

-- ============================================================================
-- 23. ABOUT TEAM MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS about_team_members (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  section_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  portfolio_url TEXT,
  order_index INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES about_sections(id) ON DELETE CASCADE
);

CREATE INDEX idx_about_team_members_section ON about_team_members(section_id);

-- ============================================================================
-- 24. ABOUT COMPANY LOGOS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS about_company_logos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  section_id CHAR(36) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  industry VARCHAR(100),
  icon_name VARCHAR(100),
  order_index INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES about_sections(id) ON DELETE CASCADE
);

CREATE INDEX idx_about_company_logos_section ON about_company_logos(section_id);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All tables have been created successfully!
-- All tables use IF NOT EXISTS, so this script can be safely re-run.
-- ============================================================================

