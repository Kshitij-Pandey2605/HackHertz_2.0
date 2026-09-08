const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Public authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/google/config', authController.getGoogleAuthConfig);

// Protected routes requiring Supabase Bearer token
router.get('/me', requireAuth, authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;
