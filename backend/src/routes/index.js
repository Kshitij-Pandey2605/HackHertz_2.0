const express = require('express');
const router = express.Router();
const uploadRoutes = require('./upload.routes');
const documentRoutes = require('./document.routes');
const summaryRoutes = require('./summary.routes');
const materialRoutes = require('./material.routes');

// Mount API routes
router.use('/upload', uploadRoutes);
router.use('/documents', documentRoutes);
router.use('/summary', summaryRoutes);
router.use('/materials', materialRoutes);

module.exports = router;
