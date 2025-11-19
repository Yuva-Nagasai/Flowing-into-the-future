-- Add module_id to resources table for module-level resources
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE CASCADE;

-- Create index for module resources
CREATE INDEX IF NOT EXISTS idx_resources_module ON resources(module_id);

-- Add comment
COMMENT ON COLUMN resources.module_id IS 'If set, resource belongs to a specific module. If NULL, resource belongs to course (legacy)';

