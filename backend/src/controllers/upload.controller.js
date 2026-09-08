const path = require('path');
const fs = require('fs');
const { supabase } = require('../config/supabase');

// Shared in-memory documents store for seamless fallback
if (!global._localDocuments) {
  global._localDocuments = [];
}

/**
 * Controller to handle PDF file uploads with Supabase Storage & local disk fallback
 */
const uploadPdf = async (req, res) => {
  try {
    // 1. Validate file presence
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Please upload a PDF file using the "file" field.',
      });
    }

    const { originalname, buffer, mimetype } = req.file;

    // 2. Generate unique sanitized filename
    const fileExt = path.extname(originalname) || '.pdf';
    const baseName = path.basename(originalname, fileExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${baseName}${fileExt}`;

    // 3. Always save locally to uploads/pdfs as a local backup
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

    // 4. Attempt to upload to Supabase Storage if configured
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

      // 5. Attempt to insert document record into Supabase 'documents' table
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

    // 6. Record in local registry for instant query availability
    const documentRecord = {
      id: documentId,
      file_name: originalname,
      file_url: fileUrl,
      file_path: localFilePath,
      uploaded_at: uploadedAt,
    };

    global._localDocuments.unshift(documentRecord);

    // 7. Return standard 201 Created response
    return res.status(201).json({
      success: true,
      documentId,
      fileName: originalname,
      fileUrl,
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
