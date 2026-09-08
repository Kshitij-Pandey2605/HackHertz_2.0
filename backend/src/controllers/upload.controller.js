const path = require('path');
const { supabase } = require('../config/supabase');

/**
 * Controller to handle PDF file uploads to Supabase Storage and database
 */
const uploadPdf = async (req, res, next) => {
  try {
    // 1. Check if file was provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Please upload a PDF file using the "file" field.',
      });
    }

    const { originalname, buffer, mimetype } = req.file;

    // 2. Generate a sanitized unique filename to prevent collisions
    const fileExt = path.extname(originalname);
    const baseName = path.basename(originalname, fileExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${baseName}${fileExt}`;
    const storagePath = uniqueFileName;
    const bucketName = 'study-materials';

    // 3. Upload file to Supabase Storage bucket
    const { data: storageData, error: storageError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, buffer, {
        contentType: mimetype || 'application/pdf',
        upsert: false,
      });

    if (storageError) {
      console.error('Supabase Storage Error:', storageError);
      return res.status(500).json({
        success: false,
        error: `Failed to upload file to Supabase Storage: ${storageError.message}`,
      });
    }

    // 4. Retrieve public URL for uploaded file
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    const fileUrl = urlData?.publicUrl;

    if (!fileUrl) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate public URL for uploaded file.',
      });
    }

    // 5. Save document metadata into Supabase 'documents' table
    const uploadedAt = new Date().toISOString();
    const { data: documentData, error: dbError } = await supabase
      .from('documents')
      .insert([
        {
          file_name: originalname,
          file_url: fileUrl,
          uploaded_at: uploadedAt,
        },
      ])
      .select('id, file_name, file_url, uploaded_at')
      .single();

    if (dbError) {
      console.error('Supabase Database Error:', dbError);
      return res.status(500).json({
        success: false,
        error: `File uploaded to storage, but failed to save document metadata: ${dbError.message}`,
      });
    }

    // 6. Return standard formatted response
    return res.status(201).json({
      success: true,
      documentId: documentData.id,
      fileName: documentData.file_name,
      fileUrl: documentData.file_url,
    });
  } catch (error) {
    console.error('Upload Controller Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred during PDF upload.',
    });
  }
};

module.exports = {
  uploadPdf,
};
