const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadPdfSingle } = require('../middleware/pdf.upload.middleware');
const studyController = require('../controllers/study.controller');

/**
 * Multer error-catching wrapper for clean JSON error responses.
 */
const handlePdfUpload = (req, res, next) => {
  uploadPdfSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        const maxMB = parseInt(process.env.PDF_MAX_SIZE_MB, 10) || 20;
        return res.status(400).json({
          success: false,
          error: `File too large. Maximum allowed size is ${maxMB}MB.`,
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
        error: err.message || 'File upload failed.',
      });
    }
    next();
  });
};

/**
 * @route   POST /api/upload
 * @desc    Upload a PDF and trigger the full AI processing pipeline
 * @access  Public
 * @body    FormData { file: PDF, difficulty?: EASY|MEDIUM|HARD }
 * @returns { documentId, fileName, generatedFeatures }
 */
router.post('/upload', handlePdfUpload, studyController.uploadAndProcess);

/**
 * @route   GET /api/documents
 * @desc    Get all uploaded documents
 * @access  Public
 */
router.get('/documents', studyController.getDocuments);

/**
 * @route   GET /api/summary/:documentId
 * @desc    Get AI-generated summary (quickSummary, detailedSummary, examNotes)
 * @access  Public
 */
router.get('/summary/:documentId', studyController.getSummary);

/**
 * @route   GET /api/flashcards/:documentId
 * @desc    Get AI-generated flashcards array
 * @access  Public
 */
router.get('/flashcards/:documentId', studyController.getFlashcards);

/**
 * @route   GET /api/quiz/:documentId
 * @desc    Get AI-generated quiz { easy, medium, hard }
 * @access  Public
 */
router.get('/quiz/:documentId', studyController.getQuiz);

/**
 * @route   GET /api/definitions/:documentId
 * @desc    Get AI-extracted definitions / glossary
 * @access  Public
 */
router.get('/definitions/:documentId', studyController.getDefinitions);

/**
 * @route   GET /api/formulas/:documentId
 * @desc    Get AI-extracted formulas and equations
 * @access  Public
 */
router.get('/formulas/:documentId', studyController.getFormulas);

/**
 * @route   GET /api/chapters/:documentId
 * @desc    Get AI-extracted chapter breakdown
 * @access  Public
 */
router.get('/chapters/:documentId', studyController.getChapters);

/**
 * @route   GET /api/keypoints/:documentId
 * @desc    Get AI-extracted key points & core concepts
 * @access  Public
 */
router.get('/keypoints/:documentId', studyController.getKeyPoints);

module.exports = router;

