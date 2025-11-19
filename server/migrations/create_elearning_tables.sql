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
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_assignments_lesson ON assignments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_user ON assignment_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_user ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);

