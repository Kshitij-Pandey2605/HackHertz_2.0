const express = require('express');
const router = express.Router();
const studyRoutes = require('./study.routes');
const uploadRoutes = require('./upload.routes');
const documentRoutes = require('./document.routes');
const summaryRoutes = require('./summary.routes');
const flashcardRoutes = require('./flashcard.routes');
const quizRoutes = require('./quiz.routes');
const materialRoutes = require('./material.routes');

// Mount API routes
router.use('/upload', uploadRoutes);
router.use('/documents', documentRoutes);
router.use('/summary', summaryRoutes);
router.use('/flashcards', flashcardRoutes);
router.use('/quiz', quizRoutes);
router.use('/materials', materialRoutes);
router.use('/legacy-upload', uploadRoutes);

module.exports = router;
