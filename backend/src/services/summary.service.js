const gemini = require('./gemini.service');

/**
 * Summary Service
 * Generates Quick Summary, Detailed Summary, Exam Cram Notes,
 * Key Points, and Chapter Breakdowns from the extracted PDF text using Gemini.
 */
const summaryService = {
  /**
   * Generate all summary types for the given PDF text.
   * @param {string} pdfText - Cleaned, extracted PDF text
   * @returns {Promise<{ quickSummary: string, detailedSummary: string, examNotes: string, keyPoints: Array, chapters: Array }>}
   */
  async generateSummary(pdfText) {
    const prompt = `You are an expert academic tutor and study material creator. Analyze the following study material and generate structured summaries and chapter breakdowns.

Return ONLY a valid JSON object with exactly these fields:
{
  "quickSummary": "<2-3 sentence high-impact overview of the document's core concepts and key takeaway>",
  "detailedSummary": "<comprehensive 6-10 paragraph explanation covering all major topics, concepts, theorems, algorithms, and practical examples>",
  "examNotes": "<bullet-point exam cram notes. Include: key definitions, formulas, must-remember rules, exam pitfalls. Use newlines with • prefix>",
  "keyPoints": [
    {
      "id": "kp_1",
      "concept": "<Core concept name>",
      "priority": "CORE",
      "explanation": "<Brief explanation of why this concept matters for tests/understanding>"
    }
  ],
  "chapters": [
    {
      "id": "ch_1",
      "number": 1,
      "title": "<Chapter or Major Topic Title>",
      "topics": [
        {
          "id": "top_1",
          "title": "<Subtopic Title>",
          "points": ["<Key learning point 1>", "<Key learning point 2>"]
        }
      ]
    }
  ]
}

Study Material:
---
${pdfText}
---

Return only valid JSON. No markdown code fences, no extra commentary outside JSON.`;

    const rawText = await gemini.generateContent(prompt);
    const parsed = gemini.parseJSON(rawText);

    return {
      quickSummary: parsed.quickSummary || '',
      detailedSummary: parsed.detailedSummary || '',
      examNotes: parsed.examNotes || '',
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      chapters: Array.isArray(parsed.chapters) ? parsed.chapters : [],
    };
  },
};

module.exports = summaryService;
