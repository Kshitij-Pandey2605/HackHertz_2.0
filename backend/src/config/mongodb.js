/**
 * NOTE: The project database has been transitioned to Supabase PostgreSQL.
 * See:
 * - src/config/supabase.js (Supabase client configuration)
 * - src/database/schema.sql (Supabase database tables & SQL schema)
 * - src/services/db.service.js (Supabase database CRUD service)
 */
module.exports = {
  connectMongoDB: async () => {
    console.log('ℹ️  Project is configured with Supabase PostgreSQL. MongoDB connection skipped.');
  },
};
