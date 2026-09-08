import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hjxzpkzhjhbqfsxfpbaj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeHpwa3poamhicWZzeGZwYmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NDU0ODYsImV4cCI6MjEwNDQyMTQ4Nn0.niWviT1oGHzHiGuKtyu4nDY6Fw3k_ebK7_6ak3B7Kiw';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your_supabase_anon_key_here'
);

/**
 * Supabase client instance with auto session detection & refresh
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

export default supabase;
