const gemini = require('./gemini.service');

/**
 * Definition Service
 * Extracts key terms and their definitions from PDF text.
 */
const definitionService = {
  /**
   * Extract all important terms and definitions from the given PDF text.
   * @param {string} pdfText - Cleaned, extracted PDF text
   * @returns {Promise<Array<{ term: string, definition: string, category: string }>>}
   */
  async extractDefinitions(pdfText) {
    const prompt = `You are an expert academic glossary builder. Extract all important technical terms, concepts, and key vocabulary from the following study material.

Return ONLY a valid JSON array (no markdown, no explanation). Each item must have:
{
  "term": "<the technical term or concept>",
  "definition": "<clear, student-friendly definition in 1-3 sentences>",
  "category": "<broad category or chapter this term belongs to>"
}

Rules:
- Extract between 15 and 40 terms depending on document density
- Focus on: technical terms, proper nouns, specialized vocabulary, named theorems/laws/rules
- Definitions must be accurate and derived from the document text
- Do NOT include common English words — only subject-specific terminology
- Alphabetical order is preferred but not required

Study Material:
---
${pdfText}
---

Return only a valid JSON array. No preamble, no markdown code fences.`;

    const rawText = await gemini.generateContent(prompt);
    const parsed = gemini.parseJSON(rawText);

    if (!Array.isArray(parsed)) {
      throw new Error('Gemini definition response is not a JSON array.');
    }

    return parsed
      .filter((d) => d && d.term && d.definition)
      .map((d) => ({
        term: String(d.term).trim(),
        definition: String(d.definition).trim(),
        category: String(d.category || 'General').trim(),
      }));
  },
};

module.exports = definitionService;
