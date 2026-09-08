const gemini = require('./gemini.service');

/**
 * Flashcard Service
 * Generates educational question/answer flashcard pairs from PDF text.
 */
const flashcardService = {
  /**
   * Generate flashcards from the given PDF text.
   * @param {string} pdfText - Cleaned, extracted PDF text
   * @returns {Promise<Array<{ question: string, answer: string, topic: string, difficulty: string }>>}
   */
  async generateFlashcards(pdfText) {
    const prompt = `You are an expert academic tutor. Based on the following study material, create educational flashcards that test deep understanding.

Return ONLY a valid JSON array (no markdown, no explanation outside JSON). Each item must have:
{
  "question": "<specific, exam-style question testing a concept, definition, or application>",
  "answer": "<clear, concise answer — 1-3 sentences>",
  "topic": "<main topic or chapter this card belongs to>",
  "difficulty": "<EASY | MEDIUM | HARD>"
}

Rules:
- Generate between 15 and 30 flashcards depending on document length
- Mix conceptual questions, definition questions, and application/example questions
- Vary difficulty: roughly 30% EASY, 50% MEDIUM, 20% HARD
- Do NOT generate duplicate questions
- Questions must be specific to the document content, not generic

Study Material:
---
${pdfText}
---

Return only a valid JSON array. No preamble, no markdown code fences.`;

    const rawText = await gemini.generateContent(prompt);
    const parsed = gemini.parseJSON(rawText);

    if (!Array.isArray(parsed)) {
      throw new Error('Gemini flashcard response is not a JSON array.');
    }

    // Sanitize each card
    return parsed.map((card) => ({
      question: String(card.question || '').trim(),
      answer: String(card.answer || '').trim(),
      topic: String(card.topic || 'General').trim(),
      difficulty: ['EASY', 'MEDIUM', 'HARD'].includes(card.difficulty) ? card.difficulty : 'MEDIUM',
    })).filter((c) => c.question && c.answer);
  },
};

module.exports = flashcardService;
