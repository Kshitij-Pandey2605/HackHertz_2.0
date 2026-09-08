const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/upload.middleware');
const { uploadPdf } = require('../controllers/upload.controller');

// Middleware to catch Multer-specific errors cleanly
const handleMulterUpload = (req, res, next) => {
  const uploadSingle = upload.single('file');

  uploadSingle(req, res, (err) => {
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
        error: err.message || 'Error occurred while processing file upload.',
      });
    }
    next();
  });
};

/**
 * @route   POST /api/upload
 * @desc    Upload PDF study material to Supabase Storage & save document record
 * @access  Public
 */
router.post('/', handleMulterUpload, uploadPdf);

module.exports = router;
