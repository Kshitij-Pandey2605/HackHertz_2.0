const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Retrieve Supabase environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

// Validation: Ensure required environment variables are present
if (!supabaseUrl) {
  throw new Error('❌ Missing required environment variable: SUPABASE_URL. Please check your .env file.');
}

if (!supabaseServiceRoleKey) {
  throw new Error('❌ Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY. Please check your .env file.');
}

/**
 * Production-ready Supabase Client for Node.js / Express backend
 * 
 * - auth.persistSession: false (prevents storing tokens in memory/localStorage in a server environment)
 * - auth.autoRefreshToken: false (server requests are stateless and don't need token refreshes)
 */
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Export the Supabase client using CommonJS syntax
module.exports = supabase;

// Support named destructuring: const { supabase } = require('./config/supabase')
module.exports.supabase = supabase;
