const fs = require('fs');
const pdfService = require('../services/pdf.service');
const pdfSummarizerService = require('../services/pdf.summarizer.service');
const dbService = require('../services/db.service');

/**
 * PDF Summarization Controller
 * Handles direct PDF text extraction and Gemini-powered structured summarization.
 */
const pdfSummaryController = {
  /**
   * POST /api/pdf/summarize
   * Accepts a PDF file via multipart/form-data or raw text / documentId in JSON body.
   */
  async summarizePdf(req, res) {
    let tempFilePath = null;

    try {
      let extractedText = '';

      // 1. Check if a PDF file was uploaded via multipart/form-data
      if (req.file) {
        tempFilePath = req.file.path;

        // Validate MIME type & extension
        const isPdf =
          req.file.mimetype === 'application/pdf' ||
          (req.file.originalname && req.file.originalname.toLowerCase().endsWith('.pdf'));

        if (!isPdf) {
          if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
          return res.status(400).json({
            success: false,
            error: 'Invalid file format. Please upload a valid PDF document (.pdf).',
          });
        }

        try {
          extractedText = await pdfService.extractText(tempFilePath);
        } catch (extractErr) {
          if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
          return res.status(422).json({
            success: false,
            error: `PDF extraction failed: ${extractErr.message}`,
          });
        }
      } else if (req.body.text && typeof req.body.text === 'string' && req.body.text.trim().length > 0) {
        // Direct text payload support
        extractedText = req.body.text.trim();
      } else if (req.body.documentId) {
        // Retrieve document text from DB/extraction
        try {
          const docData = await dbService.getExtractedContent(req.body.documentId);
          if (docData && docData.sections) {
            extractedText = docData.sections.map((s) => `${s.title}\n${s.content}`).join('\n\n');
          }
        } catch {
          // ignore
        }
      }

      // 2. Validate extracted text presence
      if (!extractedText || extractedText.trim().length < 30) {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
        return res.status(400).json({
          success: false,
          error: 'No readable text content found. Please upload a valid PDF with readable text or provide extracted text.',
        });
      }

      // 3. Process summarization directly with Gemini API (No RAG, No Vector DB)
      const summary = await pdfSummarizerService.summarize(extractedText);

      // 4. Clean up temporary uploaded file
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
        } catch {
          // ignore cleanup error
        }
      }

      // 5. Return the exact specified response format
      return res.status(200).json({
        success: true,
        summary: {
          chapterOverview: summary.chapterOverview,
          keyConcepts: summary.keyConcepts,
          definitions: summary.definitions,
          importantPoints: summary.importantPoints,
          revisionNotes: summary.revisionNotes,
          examTopics: summary.examTopics,
          difficulty: summary.difficulty,
          estimatedReadingTime: summary.estimatedReadingTime,
        },
      });
    } catch (error) {
      console.error('PDF Summarization Controller Error:', error);

      // Clean up file on error
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
        } catch {
          // ignore cleanup error
        }
      }

      return res.status(500).json({
        success: false,
        error: error.message || 'An unexpected error occurred during PDF summarization.',
      });
    }
  },
};

module.exports = pdfSummaryController;
