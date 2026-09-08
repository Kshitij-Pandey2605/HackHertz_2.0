const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Warning: SUPABASE_URL or SUPABASE_KEY is missing from environment variables.');
}

// Standard client (subject to Row Level Security / user context)
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Admin client (bypasses RLS using service role key, if provided)
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl || '', process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

module.exports = {
  supabase,
  supabaseAdmin,
};
