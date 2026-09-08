const express = require('express');
const router = express.Router();
const studyRoutes = require('./study.routes');
const uploadRoutes = require('./upload.routes');
const materialRoutes = require('./material.routes');

// Study Material AI routes — primary pipeline:
//   POST   /api/upload          (PDF upload + full AI pipeline)
//   GET    /api/documents       (List all documents)
//   GET    /api/summary/:id     (Quick, Detailed, Exam notes)
//   GET    /api/flashcards/:id  (Q&A Flashcards)
//   GET    /api/quiz/:id        (Easy, Medium, Hard MCQs)
//   GET    /api/definitions/:id (Terms & Glossary)
//   GET    /api/formulas/:id    (Formulas & Equations)
router.use('/', studyRoutes);

// Existing / Backward-compatible routes
router.use('/materials', materialRoutes);
router.use('/legacy-upload', uploadRoutes);

module.exports = router;
