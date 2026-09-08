const express = require('express');
const router = express.Router();
const { getQuizByDocumentId } = require('../controllers/quiz.controller');

/**
 * @route   GET /api/quiz/:documentId
 * @desc    Get quiz questions for a document by its ID
 * @access  Public
 */
router.get('/:documentId', getQuizByDocumentId);

module.exports = router;
