const express = require('express');
const router = express.Router();
const materialRoutes = require('./material.routes');

// Mount routes
router.use('/materials', materialRoutes);

module.exports = router;
