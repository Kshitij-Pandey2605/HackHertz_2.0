const gemini = require('./gemini.service');

/**
 * Formula Service
 * Extracts all mathematical formulas, equations, and rules from PDF text.
 */
const formulaService = {
  /**
   * Extract formulas from the given PDF text.
   * @param {string} pdfText - Cleaned, extracted PDF text
   * @returns {Promise<string[]>} Array of formula strings
   */
  async extractFormulas(pdfText) {
    const prompt = `You are an expert academic assistant specializing in extracting mathematical and scientific formulas.

Analyze the following study material and extract ALL formulas, equations, laws, rules, and theorems.

Return ONLY a valid JSON array of strings (no markdown, no explanation). Each item should be a self-contained formula string, for example:
["F = ma", "E = mc²", "PV = nRT", "a² + b² = c²", "V = IR"]

Rules:
- Include: mathematical equations, physics/chemistry/CS formulas, named laws, theorems, rules
- If the document has no formulas, return an empty array: []
- Format each formula cleanly with proper notation (use ^ for exponents, * for multiplication if needed)
- If a formula has a common name, prepend it: "Newton's Second Law: F = ma"
- Include rules stated as "If X then Y" or "A implies B" format if they are fundamental

Study Material:
---
${pdfText}
---

Return only a valid JSON array of strings. No preamble, no markdown code fences.`;

    const rawText = await gemini.generateContent(prompt);
    const parsed = gemini.parseJSON(rawText);

    if (!Array.isArray(parsed)) {
      throw new Error('Gemini formula response is not a JSON array.');
    }

    return parsed
      .filter((f) => typeof f === 'string' && f.trim().length > 0)
      .map((f) => f.trim());
  },
};

module.exports = formulaService;
