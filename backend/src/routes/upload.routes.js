const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/upload.middleware');
const { uploadPdf, uploadMultiplePdfs } = require('../controllers/upload.controller');

// Middleware to catch Multer-specific errors cleanly for any uploaded field
const handleMulterUpload = (req, res, next) => {
  const uploadHandler = upload.any();

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size limit exceeded. Maximum allowed size is 50MB per file.',
        });
      }
      return res.status(400).json({
        success: false,
        error: `Multer upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'Error occurred while processing file upload.',
      });
    }
    next();
  });
};

/**
 * @route   POST /api/upload
 * @desc    Upload single or multiple PDF study materials
 * @access  Public
 */
router.post('/', handleMulterUpload, uploadPdf);

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple PDF study materials in bulk
 * @access  Public
 */
router.post('/multiple', handleMulterUpload, uploadMultiplePdfs);

module.exports = router;
