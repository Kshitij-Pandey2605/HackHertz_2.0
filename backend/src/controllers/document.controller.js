const { supabase } = require('../config/supabase');

/**
 * @desc    Get all documents from Supabase ordered by uploaded_at desc
 * @route   GET /api/documents
 * @access  Public
 */
const getDocuments = async (req, res) => {
  try {
    // Query all records from 'documents' table ordered by uploaded_at descending
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Supabase Error fetching documents:', error);
      return res.status(500).json({
        success: false,
        error: `Failed to retrieve documents: ${error.message}`,
      });
    }

    // Return response with count and documents array
    return res.status(200).json({
      success: true,
      count: data ? data.length : 0,
      documents: data || [],
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

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Document not found.',
      });
    }

    return res.status(200).json({
      success: true,
      document: data,
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
