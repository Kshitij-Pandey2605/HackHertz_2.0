const { GoogleGenerativeAI } = require('@google/generative-ai');

// Timeout wrapper – rejects after N milliseconds
const withTimeout = (promise, ms = 60000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Gemini request timed out after ${ms / 1000}s`)), ms)
    ),
  ]);
};

/**
 * Gemini Service
 * Centralizes all Gemini API interaction.
 * Provides a single reusable `generateContent(prompt)` function.
 */
class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('⚠️  GEMINI_API_KEY not set – AI generation will throw errors.');
      this.client = null;
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        maxOutputTokens: 8192,
      },
    });
  }

  /**
   * Send a prompt to Gemini and return the text response.
   * @param {string} prompt - Full prompt string
   * @param {number} [timeoutMs=90000] - Optional timeout in ms
   * @returns {Promise<string>} Raw text response from the model
   */
  async generateContent(prompt, timeoutMs = 90000) {
    if (!this.model) {
      throw new Error('Gemini client not initialized. Please set GEMINI_API_KEY in your .env file.');
    }

    try {
      const result = await withTimeout(this.model.generateContent(prompt), timeoutMs);
      const response = result.response;

      if (!response) {
        throw new Error('Gemini returned an empty response object.');
      }

      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Gemini returned an empty text response.');
      }

      return text;
    } catch (err) {
      // Re-wrap with useful context
      const message = err.message || 'Unknown Gemini API error';
      throw new Error(`GeminiService.generateContent failed: ${message}`);
    }
  }

  /**
   * Parse a JSON response from Gemini safely.
   * Strips markdown code fences if Gemini wraps the response.
   * @param {string} rawText
   * @returns {any} Parsed JSON
   */
  parseJSON(rawText) {
    try {
      // Strip ```json ... ``` fences that Gemini sometimes adds
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      return JSON.parse(cleaned);
    } catch (err) {
      throw new Error(`Failed to parse Gemini JSON response: ${err.message}\n\nRaw text:\n${rawText.substring(0, 500)}`);
    }
  }
}

// Export singleton
module.exports = new GeminiService();
