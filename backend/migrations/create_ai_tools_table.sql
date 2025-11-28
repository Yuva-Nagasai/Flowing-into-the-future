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

