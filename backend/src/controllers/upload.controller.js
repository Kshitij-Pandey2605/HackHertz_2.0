const path = require('path');
const fs = require('fs');
const { supabase } = require('../config/supabase');

// Shared in-memory documents store for seamless fallback
if (!global._localDocuments) {
  global._localDocuments = [];
}

/**
 * Helper to process and persist a single file buffer
 */
const processSingleFile = async (file, req) => {
  const { originalname, buffer, mimetype } = file;

  // Generate unique sanitized filename
  const fileExt = path.extname(originalname) || '.pdf';
  const baseName = path.basename(originalname, fileExt).replace(/[^a-zA-Z0-9_-]/g, '_');
  const timestamp = Date.now() + Math.floor(Math.random() * 1000);
  const uniqueFileName = `${timestamp}_${baseName}${fileExt}`;

  // Always save locally to uploads/pdfs as a local backup
  const uploadsDir = path.resolve(process.cwd(), 'uploads', 'pdfs');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const localFilePath = path.join(uploadsDir, uniqueFileName);
  fs.writeFileSync(localFilePath, buffer);

  const port = process.env.PORT || 5000;
  let fileUrl = `${req.protocol}://${req.get('host') || `localhost:${port}`}/uploads/pdfs/${uniqueFileName}`;
  let documentId = `doc_${timestamp}`;
  const uploadedAt = new Date().toISOString();

  // Attempt to upload to Supabase Storage if configured
  if (supabase) {
    try {
      const bucketName = 'study-materials';
      const { data: storageData, error: storageError } = await supabase.storage
        .from(bucketName)
        .upload(uniqueFileName, buffer, {
          contentType: mimetype || 'application/pdf',
          upsert: true,
        });

      if (!storageError && storageData) {
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(uniqueFileName);

        if (urlData?.publicUrl) {
          fileUrl = urlData.publicUrl;
        }
      }
    } catch (storageErr) {
      console.warn('Note: Supabase storage upload failed, using local file storage:', storageErr.message);
    }

    // Attempt to insert document record into Supabase 'documents' table
    try {
      const { data: docData, error: dbError } = await supabase
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

      if (!dbError && docData) {
        documentId = docData.id;
        fileUrl = docData.file_url || fileUrl;
      }
    } catch (dbErr) {
      console.warn('Note: Supabase document insert fallback to local registry:', dbErr.message);
    }
  }

  // Record in local registry for instant query availability
  const documentRecord = {
    id: documentId,
    file_name: originalname,
    file_url: fileUrl,
    file_path: localFilePath,
    uploaded_at: uploadedAt,
  };

  global._localDocuments.unshift(documentRecord);

  return {
    documentId,
    fileName: originalname,
    fileUrl,
    uploadedAt,
  };
};

/**
 * Controller to handle single or multiple PDF file uploads
 */
const uploadPdf = async (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded. Please upload one or more PDF files using the "files" or "file" field.',
      });
    }

    // Process all files
    const results = [];
    for (const file of files) {
      const doc = await processSingleFile(file, req);
      results.push(doc);
    }

    // If single file uploaded, maintain standard response structure + extra array metadata
    if (results.length === 1) {
      return res.status(201).json({
        success: true,
        documentId: results[0].documentId,
        fileName: results[0].fileName,
        fileUrl: results[0].fileUrl,
        documents: results,
      });
    }

    // If multiple files uploaded
    return res.status(201).json({
      success: true,
      count: results.length,
      documents: results,
      documentId: results[0].documentId,
      fileName: results[0].fileName,
      fileUrl: results[0].fileUrl,
    });
  } catch (error) {
    console.error('Upload Controller Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred during PDF upload.',
    });
  }
};

/**
 * Controller specifically for multiple PDF uploads
 */
const uploadMultiplePdfs = async (req, res) => {
  return uploadPdf(req, res);
};

module.exports = {
  uploadPdf,
  uploadMultiplePdfs,
};
