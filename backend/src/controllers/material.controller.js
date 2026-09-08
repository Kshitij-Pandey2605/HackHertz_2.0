const { supabase } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Controller for study material operations
 */
const uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const { title } = req.body;
    const userId = req.user?.id || null;

    // Insert record into Supabase 'materials' table
    const { data, error } = await supabase
      .from('materials')
      .insert([
        {
          user_id: userId,
          title: title || req.file.originalname,
          original_filename: req.file.originalname,
          file_path: req.file.path,
          file_type: req.file.mimetype,
          file_size: req.file.size,
          status: 'uploaded',
        }
      ])
      .select()
      .single();

    if (error) {
      return errorResponse(res, error.message, 500);
    }

    return successResponse(res, data, 'Material uploaded successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getMaterials = async (req, res) => {
  try {
    const userId = req.user?.id;
    let query = supabase.from('materials').select('*').order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      return errorResponse(res, error.message, 500);
    }

    return successResponse(res, data, 'Materials fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = {
  uploadMaterial,
  getMaterials,
};
