const gemini = require('./gemini.service');

/**
 * Quiz Service
 * Generates MCQ-style quizzes at three difficulty levels from PDF text.
 */
const quizService = {
  /**
   * Generate a quiz with easy, medium, and hard questions.
   * @param {string} pdfText - Cleaned, extracted PDF text
   * @returns {Promise<{ easy: QuizQuestion[], medium: QuizQuestion[], hard: QuizQuestion[] }>}
   */
  async generateQuiz(pdfText) {
    const prompt = `You are an expert academic exam designer. Based on the following study material, generate a comprehensive quiz with three difficulty levels.

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "easy": [
    {
      "question": "<direct recall or definition question>",
      "options": ["A. <option>", "B. <option>", "C. <option>", "D. <option>"],
      "answer": "<the full correct option text, e.g. A. option>",
      "explanation": "<brief 1-2 sentence explanation of why this is correct>"
    }
  ],
  "medium": [ ... ],
  "hard": [ ... ]
}

Rules:
- easy: 5 questions — direct definitions, simple recall, basic concepts
- medium: 5 questions — application, comparison, conceptual understanding
- hard: 5 questions — multi-step reasoning, edge cases, synthesis across topics
- All questions must be multiple-choice with exactly 4 options (A, B, C, D)
- Only ONE correct answer per question
- Explanations are mandatory and must be accurate
- Base questions strictly on the provided document

Study Material:
---
${pdfText}
---

Return only a valid JSON object. No preamble, no markdown code fences.`;

    const rawText = await gemini.generateContent(prompt);
    const parsed = gemini.parseJSON(rawText);

    const sanitizeQuestions = (arr = []) =>
      arr
        .filter((q) => q && q.question && q.answer)
        .map((q) => ({
          question: String(q.question).trim(),
          options: Array.isArray(q.options) ? q.options.map(String) : [],
          answer: String(q.answer).trim(),
          explanation: String(q.explanation || '').trim(),
        }));

    return {
      easy: sanitizeQuestions(parsed.easy),
      medium: sanitizeQuestions(parsed.medium),
      hard: sanitizeQuestions(parsed.hard),
    };
  },
};

module.exports = quizService;
