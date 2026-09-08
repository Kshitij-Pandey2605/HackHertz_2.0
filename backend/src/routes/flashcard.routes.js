const express = require('express');
const router = express.Router();
const { getFlashcardsByDocumentId } = require('../controllers/flashcard.controller');

/**
 * @route   GET /api/flashcards/:documentId
 * @desc    Get flashcards for a document by its ID
 * @access  Public
 */
router.get('/:documentId', getFlashcardsByDocumentId);

module.exports = router;
