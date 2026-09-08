const mongoose = require('mongoose');

/**
 * Quiz Question sub-schema (shared across difficulty levels).
 */
const quizQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], default: [] },
    answer: { type: String, required: true },
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

/**
 * Quiz Model
 * Stores easy, medium, and hard questions for a document.
 */
const quizSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    easy: {
      type: [quizQuestionSchema],
      default: [],
    },
    medium: {
      type: [quizQuestionSchema],
      default: [],
    },
    hard: {
      type: [quizQuestionSchema],
      default: [],
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
