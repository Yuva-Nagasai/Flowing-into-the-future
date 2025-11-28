-- ============================================================================
-- Migration: Add free and short_description fields to courses table
-- ============================================================================
-- This migration adds:
-- 1. 'free' (BOOLEAN) - If true, course can be accessed without purchase
-- 2. 'short_description' (TEXT) - Brief description for course listings
-- ============================================================================

-- Add free field (default to false for existing courses)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS free BOOLEAN DEFAULT FALSE;

-- Add short_description field (nullable)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Update existing courses: if price is 0, set free to true
UPDATE courses 
SET free = TRUE 
WHERE price = 0 OR price IS NULL;

-- Create index for free courses (for faster queries)
CREATE INDEX IF NOT EXISTS idx_courses_free ON courses(free) WHERE free = TRUE;

-- Add comment to explain the fields
COMMENT ON COLUMN courses.free IS 'If true, course can be accessed without purchase';
COMMENT ON COLUMN courses.short_description IS 'Brief description shown in course listings (typically 100-200 characters)';

