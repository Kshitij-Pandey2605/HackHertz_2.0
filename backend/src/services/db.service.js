const { supabase, isSupabaseConfigured } = require('../config/supabase');

/**
 * Database Service for Supabase
 * Handles all database operations on Supabase PostgreSQL tables.
 */
class DbService {
  /**
   * Helper to verify Supabase is configured
   */
  _checkConfig() {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error(
        'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_KEY in your .env file.'
      );
    }
  }

  // ==========================================
  // Document Operations
  // ==========================================

  async createDocument(data) {
    this._checkConfig();
    const { data: document, error } = await supabase
      .from('documents')
      .insert([
        {
          file_name: data.fileName,
          original_name: data.originalName,
          file_path: data.filePath,
          file_url: data.fileUrl || '',
          file_size: data.fileSize,
          mime_type: data.mimeType,
          difficulty: data.difficulty || 'MEDIUM',
          status: 'processing',
          user_id: data.userId || 'anonymous',
        },
      ])
      .select()
      .single();

    if (error) throw new Error(`Supabase createDocument error: ${error.message}`);
    return document;
  }

  async updateDocument(documentId, updates) {
    this._checkConfig();
    const updatePayload = { ...updates, updated_at: new Date().toISOString() };
    const { data, error } = await supabase
      .from('documents')
      .update(updatePayload)
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw new Error(`Supabase updateDocument error: ${error.message}`);
    return data;
  }

  async getDocuments() {
    this._checkConfig();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Supabase getDocuments error: ${error.message}`);
    return data || [];
  }

  async getDocumentById(documentId) {
    this._checkConfig();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Supabase getDocumentById error: ${error.message}`);
    }
    return data || null;
  }

  // ==========================================
  // Summary Operations
  // ==========================================

  async saveSummary(documentId, summaryData) {
    this._checkConfig();
    const { data, error } = await supabase
      .from('summaries')
      .insert([
        {
          document_id: documentId,
          quick_summary: summaryData.quickSummary || '',
          detailed_summary: summaryData.detailedSummary || '',
          exam_notes: summaryData.examNotes || '',
          key_points: summaryData.keyPoints || [],
          chapters: summaryData.chapters || [],
        },
      ])
      .select()
      .single();

    if (error) throw new Error(`Supabase saveSummary error: ${error.message}`);
    return data;
  }

  async getSummary(documentId) {
    this._checkConfig();
    const { data, error } = await supabase
      .from('summaries')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Supabase getSummary error: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      documentId: data.document_id,
      quickSummary: data.quick_summary,
      detailedSummary: data.detailed_summary,
      examNotes: data.exam_notes,
      keyPoints: data.key_points,
      chapters: data.chapters,
      createdAt: data.created_at,
    };
  }

  // ==========================================
  // Flashcards Operations
  // ==========================================

  async saveFlashcards(documentId, flashcards) {
    this._checkConfig();
    const { data, error } = await supabase
      .from('flashcards')
      .insert([
        {
          document_id: documentId,
          flashcards: flashcards || [],
        },
      ])
      .select()
      .single();

    if (error) throw new Error(`Supabase saveFlashcards error: ${error.message}`);
    return data;
  }

  async getFlashcards(documentId) {
    this._checkConfig();
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Supabase getFlashcards error: ${error.message}`);
    }

    return data?.flashcards || null;
  }

  // ==========================================
  // Quiz Operations
  // ==========================================

  async saveQuiz(documentId, quizData) {
    this._checkConfig();
    const { data, error } = await supabase
      .from('quizzes')
      .insert([
        {
          document_id: documentId,
          easy: quizData.easy || [],
          medium: quizData.medium || [],
          hard: quizData.hard || [],
        },
      ])
      .select()
      .single();

    if (error) throw new Error(`Supabase saveQuiz error: ${error.message}`);
    return data;
  }

  async getQuiz(documentId) {
    this._checkConfig();
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Supabase getQuiz error: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      documentId: data.document_id,
      easy: data.easy || [],
      medium: data.medium || [],
      hard: data.hard || [],
      createdAt: data.created_at,
    };
  }

  // ==========================================
  // Definitions Operations
  // ==========================================

  async saveDefinitions(documentId, definitions) {
    this._checkConfig();
    const { data, error } = await supabase
      .from('definitions')
      .insert([
        {
          document_id: documentId,
          definitions: definitions || [],
        },
      ])
      .select()
      .single();

    if (error) throw new Error(`Supabase saveDefinitions error: ${error.message}`);
    return data;
  }

  async getDefinitions(documentId) {
    this._checkConfig();
    const { data, error } = await supabase
      .from('definitions')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Supabase getDefinitions error: ${error.message}`);
    }

    return data?.definitions || null;
  }

  // ==========================================
  // Formulas Operations
  // ==========================================

  async saveFormulas(documentId, formulas) {
    this._checkConfig();
    const { data, error } = await supabase
      .from('formulas')
      .insert([
        {
          document_id: documentId,
          formulas: formulas || [],
        },
      ])
      .select()
      .single();

    if (error) throw new Error(`Supabase saveFormulas error: ${error.message}`);
    return data;
  }

  async getFormulas(documentId) {
    this._checkConfig();
    const { data, error } = await supabase
      .from('formulas')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Supabase getFormulas error: ${error.message}`);
    }

    return data?.formulas || null;
  }
}

module.exports = new DbService();
