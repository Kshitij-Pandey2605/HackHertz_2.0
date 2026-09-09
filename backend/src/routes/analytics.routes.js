const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

router.get('/mastery-dashboard', analyticsController.getMasteryDashboard);
router.post('/calculate-mastery', analyticsController.calculateMastery);

module.exports = router;
