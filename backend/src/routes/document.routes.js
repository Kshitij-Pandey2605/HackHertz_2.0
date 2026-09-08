const express = require('express');
const router = express.Router();
const { getDocuments, getDocumentById } = require('../controllers/document.controller');

/**
 * @route   GET /api/documents
 * @desc    Fetch all uploaded documents
 * @access  Public
 */
router.get('/', getDocuments);

/**
 * @route   GET /api/documents/:id
 * @desc    Fetch single document by ID
 * @access  Public
 */
router.get('/:id', getDocumentById);

module.exports = router;
