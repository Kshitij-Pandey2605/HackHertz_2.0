const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/upload.middleware');
const extractController = require('../controllers/extract.controller');

// Middleware to handle multer upload errors cleanly
const handleMulter = (req, res, next) => {
  const single = upload.single('file');
  single(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size limit exceeded. Maximum allowed size is 50MB.',
        });
      }
      return res.status(400).json({
        success: false,
        error: `Multer upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'Error occurred while receiving PDF file.',
      });
    }
    next();
  });
};

/**
 * @route   POST /api/extract/:documentId
 * @desc    Extract text, structure, sections, and metadata from a document by ID
 * @access  Public
 */
router.post('/:documentId', extractController.extractDocumentById);

/**
 * @route   GET /api/extract/:documentId
 * @desc    Get extracted structured content for a document ID
 * @access  Public
 */
router.get('/:documentId', extractController.getExtractedDocument);

/**
 * @route   POST /api/extract
 * @desc    Direct PDF extraction from multipart file upload
 * @access  Public
 */
router.post('/', handleMulter, extractController.extractUploadedFile);

module.exports = router;
