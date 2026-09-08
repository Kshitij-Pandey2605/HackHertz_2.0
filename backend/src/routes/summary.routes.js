const express = require('express');
const router = express.Router();
const { getSummaryByDocumentId } = require('../controllers/summary.controller');

/**
 * @route   GET /api/summary/:documentId
 * @desc    Get summary for a document by its ID
 * @access  Public
 */
router.get('/:documentId', getSummaryByDocumentId);

module.exports = router;
