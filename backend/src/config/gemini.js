const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Gemini AI Configuration and Client Factory
 */
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

module.exports = {
  getGeminiClient,
  DEFAULT_MODEL: 'gemini-1.5-flash',
  MAX_OUTPUT_TOKENS: 8192,
  TEMPERATURE: 0.4,
};
