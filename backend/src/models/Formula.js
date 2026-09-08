const mongoose = require('mongoose');

/**
 * Formula Model
 * Stores extracted formulas and equations for a document.
 */
const formulaSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    formulas: {
      type: [String],
      default: [],
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Formula', formulaSchema);
