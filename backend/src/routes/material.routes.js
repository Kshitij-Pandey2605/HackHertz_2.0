const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { uploadMaterial, getMaterials } = require('../controllers/material.controller');

// Upload a document (PDF, PPT, DOCX, etc.)
router.post('/upload', upload.single('file'), uploadMaterial);

// Get all study materials
router.get('/', getMaterials);

module.exports = router;
