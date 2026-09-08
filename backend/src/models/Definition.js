const mongoose = require('mongoose');

/**
 * Definition Model
 * Stores extracted term/definition pairs for a document.
 */
const definitionItemSchema = new mongoose.Schema(
  {
    term: { type: String, required: true },
    definition: { type: String, required: true },
    category: { type: String, default: 'General' },
  },
  { _id: false }
);

const definitionSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    definitions: {
      type: [definitionItemSchema],
      default: [],
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Definition', definitionSchema);
