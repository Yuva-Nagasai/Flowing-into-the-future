# NanoFlows Academy - Database Schema

## Tables

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'instructor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### courses
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  thumbnail TEXT,
  promotional_video TEXT,
  instructor_name TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### videos
```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration TEXT DEFAULT '0:00',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### resources
```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### purchases
```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  razorpay_payment_id TEXT NOT NULL,
  razorpay_order_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'completed',
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
```

### progress (optional)
```sql
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  last_position INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);
```

### jobs
```sql
CREATE TABLE jobs (
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
```

### ai_tools
```sql
CREATE TABLE ai_tools (
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
```

## Indexes
```sql
CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_purchases_course ON purchases(course_id);
CREATE INDEX idx_videos_course ON videos(course_id);
CREATE INDEX idx_resources_course ON resources(course_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_jobs_active ON jobs(active);
CREATE INDEX idx_jobs_department ON jobs(department);
CREATE INDEX idx_ai_tools_active ON ai_tools(active);
CREATE INDEX idx_ai_tools_category ON ai_tools(category);
CREATE INDEX idx_ai_tools_pricing_type ON ai_tools(pricing_type);
```

## Initial Admin User
After creating the tables, insert an initial admin user:
```sql
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@nanoflows.com', '$2a$10$your_hashed_password', 'admin');
```

Note: Use bcryptjs to hash the password before inserting.
