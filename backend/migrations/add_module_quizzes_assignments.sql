-- Add module_id to quizzes table for module-level quizzes
ALTER TABLE quizzes 
ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE CASCADE;

-- Add module_id to assignments table for module-level assignments
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE CASCADE;

-- Create indexes for module-level queries
CREATE INDEX IF NOT EXISTS idx_quizzes_module ON quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_assignments_module ON assignments(module_id);

-- Add comments
COMMENT ON COLUMN quizzes.module_id IS 'If set, quiz belongs to a specific module. If NULL, quiz belongs to lesson (legacy)';
COMMENT ON COLUMN assignments.module_id IS 'If set, assignment belongs to a specific module. If NULL, assignment belongs to lesson (legacy)';

