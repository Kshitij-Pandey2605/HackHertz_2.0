const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Retrieve Supabase environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  ((supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here') ||
   (supabaseServiceRoleKey && supabaseServiceRoleKey !== 'your_supabase_service_role_key_here'))
);

let supabase = null;
let supabaseAdmin = null;

if (isConfigured) {
  try {
    const keyToUse = supabaseServiceRoleKey || supabaseAnonKey;
    supabase = createClient(supabaseUrl, keyToUse, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Dedicated admin client with service role key if provided
    if (supabaseServiceRoleKey && supabaseServiceRoleKey !== 'your_supabase_service_role_key_here') {
      supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } else {
      supabaseAdmin = supabase;
    }

    console.log('✅ Supabase client initialized successfully');
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
  }
} else {
  console.warn('⚠️  Supabase not configured in .env. Please provide valid SUPABASE_URL and SUPABASE_KEY / SUPABASE_SERVICE_ROLE_KEY.');
}

module.exports = {
  supabase,
  supabaseAdmin,
  isSupabaseConfigured: () => Boolean(supabase),
};
