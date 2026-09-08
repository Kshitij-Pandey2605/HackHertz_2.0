const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * Service to interact with Supabase Database and Storage
 */
class SupabaseService {
  /**
   * Upload a file to Supabase Storage bucket
   */
  static async uploadFile(bucket, path, fileBuffer, contentType) {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) throw error;
    return data;
  }

  /**
   * Get public URL for a file in Supabase Storage
   */
  static getPublicUrl(bucket, path) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl;
  }

  /**
   * Generic query helper on Supabase tables
   */
  static table(tableName) {
    return supabase.from(tableName);
  }
}

module.exports = SupabaseService;
