const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in environment variables.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

module.exports = supabase;
