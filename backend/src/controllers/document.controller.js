const { supabase } = require('../config/supabase');

/**
 * @desc    Get all documents from Supabase and local registry
 * @route   GET /api/documents
 * @access  Public
 */
const getDocuments = async (req, res) => {
  try {
    let supabaseDocs = [];

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('uploaded_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          supabaseDocs = data;
        }
      } catch (err) {
        console.warn('Note: Could not query Supabase documents table:', err.message);
      }
    }

    const localDocs = global._localDocuments || [];
    const mergedMap = new Map();

    supabaseDocs.forEach((d) => mergedMap.set(d.id, d));
    localDocs.forEach((d) => {
      if (!mergedMap.has(d.id)) {
        mergedMap.set(d.id, d);
      }
    });

    const documents = Array.from(mergedMap.values());

    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error('Document Controller Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred while fetching documents.',
    });
  }
};

/**
 * @desc    Get single document by ID
 * @route   GET /api/documents/:id
 * @access  Public
 */
const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return res.status(200).json({
            success: true,
            document: data,
          });
        }
      } catch {
        // Fallback to local
      }
    }

    const localDocs = global._localDocuments || [];
    const found = localDocs.find((d) => d.id === id);

    if (found) {
      return res.status(200).json({
        success: true,
        document: found,
      });
    }

    return res.status(404).json({
      success: false,
      error: 'Document not found.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred.',
    });
  }
};

module.exports = {
  getDocuments,
  getDocumentById,
};
