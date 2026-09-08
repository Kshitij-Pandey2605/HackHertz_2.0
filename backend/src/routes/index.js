const express = require('express');
const router = express.Router();
const uploadRoutes = require('./upload.routes');
const materialRoutes = require('./material.routes');

// Mount routes
router.use('/upload', uploadRoutes);
router.use('/materials', materialRoutes);

module.exports = router;
