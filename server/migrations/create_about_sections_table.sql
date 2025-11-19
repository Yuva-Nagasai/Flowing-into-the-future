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

