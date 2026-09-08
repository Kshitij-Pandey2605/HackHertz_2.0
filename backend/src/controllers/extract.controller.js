const path = require('path');
const fs = require('fs');
const pdfExtractorService = require('../services/pdf.extractor.service');
const dbService = require('../services/db.service');
const { supabase } = require('../config/supabase');

/**
 * PDF Extraction Controller
 * Handles structural extraction, page parsing, metadata calculation, and section splitting.
 */
const extractController = {
  /**
   * POST /api/extract/:documentId
   * Extracts text, structure, sections, and metadata from an existing document.
   */
  async extractDocumentById(req, res) {
    try {
      const { documentId } = req.params;

      if (!documentId) {
        return res.status(400).json({
          success: false,
          error: 'Document ID is required.',
        });
      }

      // 1. Retrieve document metadata from database
      let documentRecord = null;
      try {
        documentRecord = await dbService.getDocumentById(documentId);
      } catch {
        // Continue to check directly with supabase
      }

      if (!documentRecord && supabase) {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .single();

        if (!error && data) {
          documentRecord = data;
        }
      }

      if (!documentRecord && global._localDocuments) {
        documentRecord = global._localDocuments.find((d) => d.id === documentId);
      }

      if (!documentRecord) {
        return res.status(404).json({
          success: false,
          error: `Document with ID "${documentId}" was not found.`,
        });
      }

      // 2. Resolve PDF source (Supabase Storage URL or Local File Path)
      const fileUrl = documentRecord.file_url || documentRecord.fileUrl;
      const filePath = documentRecord.file_path || documentRecord.filePath;
      const originalName = documentRecord.file_name || documentRecord.original_name || 'Document.pdf';

      let source = null;

      if (fileUrl && (fileUrl.startsWith('http://') || fileUrl.startsWith('https://'))) {
        source = fileUrl;
      } else if (filePath && fs.existsSync(filePath)) {
        source = filePath;
      } else if (filePath && fs.existsSync(path.resolve(process.cwd(), filePath))) {
        source = path.resolve(process.cwd(), filePath);
      } else if (filePath && fs.existsSync(path.resolve(process.cwd(), 'uploads', path.basename(filePath)))) {
        source = path.resolve(process.cwd(), 'uploads', path.basename(filePath));
      } else if (fileUrl) {
        source = fileUrl;
      }

      if (!source) {
        return res.status(422).json({
          success: false,
          error: 'Could not resolve a valid file path or storage URL for this document.',
        });
      }

      // 3. Execute extraction pipeline
      const extractedData = await pdfExtractorService.extract(source, {
        documentId,
        fallbackTitle: originalName,
      });

      // 4. Persist extracted content in database
      await dbService.saveExtractedContent(documentId, extractedData).catch((err) => {
        console.warn('Note: Could not persist extraction to database table:', err.message);
      });

      // 5. Return structured response conforming to specification
      return res.status(200).json({
        success: true,
        documentId: extractedData.documentId,
        title: extractedData.title,
        totalPages: extractedData.totalPages,
        wordCount: extractedData.wordCount,
        readingTime: extractedData.readingTime,
        sections: extractedData.sections,
        pages: extractedData.pages,
        metadata: extractedData.metadata,
      });
    } catch (error) {
      console.error('PDF Extraction Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'An unexpected error occurred during PDF extraction.',
      });
    }
  },

  /**
   * GET /api/extract/:documentId
   * Retrieves previously extracted document structure or extracts on the fly.
   */
  async getExtractedDocument(req, res) {
    try {
      const { documentId } = req.params;

      if (!documentId) {
        return res.status(400).json({
          success: false,
          error: 'Document ID is required.',
        });
      }

      // Check for saved extraction
      const saved = await dbService.getExtractedContent(documentId);
      if (saved) {
        return res.status(200).json({
          success: true,
          documentId: saved.documentId || documentId,
          title: saved.title,
          totalPages: saved.totalPages,
          wordCount: saved.wordCount,
          readingTime: saved.readingTime,
          sections: saved.sections || [],
          pages: saved.pages || [],
          metadata: saved.metadata || {},
        });
      }

      // If not yet extracted, trigger extraction
      return extractController.extractDocumentById(req, res);
    } catch (error) {
      console.error('Get Extracted Document Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to retrieve extracted document content.',
      });
    }
  },

  /**
   * POST /api/extract
   * Direct PDF extraction from multipart file upload.
   */
  async extractUploadedFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No PDF file uploaded. Please provide a PDF file in the "file" field.',
        });
      }

      const buffer = req.file.buffer || (req.file.path ? fs.readFileSync(req.file.path) : null);

      if (!buffer) {
        return res.status(400).json({
          success: false,
          error: 'Uploaded file buffer is empty or could not be read.',
        });
      }

      const generatedDocId = `doc_${Date.now()}`;
      const originalName = req.file.originalname || 'Uploaded Document.pdf';

      const extractedData = await pdfExtractorService.extract(buffer, {
        documentId: generatedDocId,
        fallbackTitle: originalName,
      });

      return res.status(200).json({
        success: true,
        documentId: extractedData.documentId,
        title: extractedData.title,
        totalPages: extractedData.totalPages,
        wordCount: extractedData.wordCount,
        readingTime: extractedData.readingTime,
        sections: extractedData.sections,
        pages: extractedData.pages,
        metadata: extractedData.metadata,
      });
    } catch (error) {
      console.error('Direct PDF Upload Extraction Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to extract text from uploaded PDF file.',
      });
    }
  },
};

module.exports = extractController;
