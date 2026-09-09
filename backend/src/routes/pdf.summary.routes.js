const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadPdfSingle } = require('../middleware/pdf.upload.middleware');
const pdfSummaryController = require('../controllers/pdf.summary.controller');

/**
 * Multer error-handling middleware wrapper for clean JSON responses.
 */
const handleUpload = (req, res, next) => {
  uploadPdfSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        const maxMB = parseInt(process.env.PDF_MAX_SIZE_MB, 10) || 20;
        return res.status(400).json({
          success: false,
          error: `File size exceeds the limit of ${maxMB}MB. Please upload a smaller PDF.`,
        });
      }
      return res.status(400).json({
        success: false,
        error: `Upload error: ${err.message}`,
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'Invalid upload request.',
      });
    }

    next();
  });
};

/**
 * @route   POST /api/pdf/summarize
 * @desc    Upload a PDF document and generate structured study summary via Gemini API
 * @access  Public
 */
router.post('/summarize', handleUpload, pdfSummaryController.summarizePdf);

module.exports = router;
