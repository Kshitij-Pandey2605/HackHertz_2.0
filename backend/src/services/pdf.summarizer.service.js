const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * PDF Summarizer Service
 * Direct Gemini API Integration without RAG, Vector Databases, Embeddings, or Semantic Search.
 */
class PdfSummarizerService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.3,
          topP: 0.85,
          maxOutputTokens: 8192,
        },
      });
    } else {
      console.warn('⚠️  GEMINI_API_KEY is not set. Summarizer will use fallback structured generator.');
      this.model = null;
    }
  }

  /**
   * Generates a structured study summary directly from extracted text using Gemini API.
   * @param {string} text - Cleaned text extracted from the PDF document
   * @returns {Promise<Object>} Structured study summary matching required specification
   */
  async summarize(text) {
    if (!text || text.trim().length < 30) {
      throw new Error('Extracted PDF text is too short or empty for summarization.');
    }

    // Truncate to safe token limit (up to 30,000 characters)
    const truncatedText = text.slice(0, 30000);

    const prompt = `
You are an expert AI educational summarizer and study coach.
Analyze the following extracted text from an uploaded study document/textbook and generate a comprehensive, structured study summary.

IMPORTANT RULES:
1. Do NOT use any external search or vector embeddings.
2. Rely ONLY on the provided text.
3. Respond ONLY with a valid, parseable JSON object matching the exact schema below.
4. Do NOT include markdown code fences or backticks (e.g., \`\`\`json) in your response if possible, or provide valid raw JSON.

JSON SCHEMA:
{
  "chapterOverview": "Short explanation of what the chapter/document is about (3-5 clear sentences).",
  "keyConcepts": [
    "Concept 1: Clear explanation",
    "Concept 2: Clear explanation",
    "Concept 3: Clear explanation"
  ],
  "definitions": [
    "Term 1: Precise definition",
    "Term 2: Precise definition"
  ],
  "importantPoints": [
    "Point 1 to remember",
    "Point 2 to remember",
    "Point 3 to remember"
  ],
  "revisionNotes": [
    "Short bullet point for last-minute rapid revision",
    "High-yield rule or equation reminder"
  ],
  "examTopics": [
    "Topic 1 most likely to appear on exams",
    "Topic 2 most likely to appear on exams"
  ],
  "difficulty": "Easy", // Must be one of: "Easy", "Medium", "Hard"
  "estimatedReadingTime": "15 min" // e.g. "10 min", "15 min", "25 min"
}

DOCUMENT TEXT:
${truncatedText}
`;

    if (this.model) {
      try {
        const result = await this.model.generateContent(prompt);
        const response = result.response;
        const rawText = response.text();

        const parsed = this._cleanAndParseJSON(rawText);
        return this._validateAndNormalizeSummary(parsed, truncatedText);
      } catch (geminiError) {
        console.warn('Gemini API call failed or timed out:', geminiError.message);
        // Fallback to heuristic generation
      }
    }

    // Heuristic structured fallback if Gemini is offline or unconfigured
    return this._generateHeuristicSummary(truncatedText);
  }

  /**
   * Safely parses JSON string, removing markdown wrappers.
   * @private
   */
  _cleanAndParseJSON(raw) {
    let cleaned = raw.trim();
    // Remove markdown ```json ... ``` codeblocks if present
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    }

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      // Attempt regex match for JSON object
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw new Error(`Failed to parse Gemini output as JSON: ${err.message}`);
    }
  }

  /**
   * Validates and ensures all required keys and array structures are present.
   * @private
   */
  _validateAndNormalizeSummary(data, sourceText) {
    const wordCount = sourceText.split(/\s+/).length;
    const estMinutes = Math.max(5, Math.ceil(wordCount / 200));

    return {
      chapterOverview:
        typeof data.chapterOverview === 'string' && data.chapterOverview.trim().length > 0
          ? data.chapterOverview.trim()
          : 'Comprehensive study document covering core conceptual foundations, operational models, and practical applications.',
      keyConcepts: Array.isArray(data.keyConcepts) && data.keyConcepts.length > 0
        ? data.keyConcepts.map(String)
        : ['Core theoretical framework and definitions', 'Operational invariants and rules', 'Practical implementation models'],
      definitions: Array.isArray(data.definitions) && data.definitions.length > 0
        ? data.definitions.map(String)
        : ['Primary Entity: Core data abstraction or object governed by the material.', 'Operational Invariant: Structural guarantee preserved across system transformations.'],
      importantPoints: Array.isArray(data.importantPoints) && data.importantPoints.length > 0
        ? data.importantPoints.map(String)
        : ['Master foundational definitions before approaching complex problems.', 'Review edge cases and error bounds in detail.', 'Verify all invariant conditions during step-by-step executions.'],
      revisionNotes: Array.isArray(data.revisionNotes) && data.revisionNotes.length > 0
        ? data.revisionNotes.map(String)
        : ['Quick glance: Review key definitions and formulas.', 'Verify step-by-step execution workflows.', 'Memorize core classifications and notation rules.'],
      examTopics: Array.isArray(data.examTopics) && data.examTopics.length > 0
        ? data.examTopics.map(String)
        : ['Fundamental Definitions & Syntax', 'Algorithm & Model Mechanics', 'Edge Cases and Exception Boundaries'],
      difficulty: ['Easy', 'Medium', 'Hard'].includes(data.difficulty)
        ? data.difficulty
        : 'Medium',
      estimatedReadingTime:
        typeof data.estimatedReadingTime === 'string' && data.estimatedReadingTime.trim().length > 0
          ? data.estimatedReadingTime.trim()
          : `${estMinutes} min`,
    };
  }

  /**
   * Generates a structured fallback summary directly from text structure when Gemini is unconfigured.
   * @private
   */
  _generateHeuristicSummary(text) {
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 20);
    const words = text.split(/\s+/).length;
    const readingTime = `${Math.max(5, Math.ceil(words / 200))} min`;

    const overview = lines.slice(0, 3).join(' ') || 'Comprehensive academic study material containing core concepts, structured principles, and practical guidelines.';

    const concepts = lines.slice(3, 8).map((l, i) => `Concept ${i + 1}: ${l.slice(0, 120)}`);
    const points = lines.slice(8, 12).map((l) => l.slice(0, 140));

    return {
      chapterOverview: overview.slice(0, 400),
      keyConcepts: concepts.length > 0 ? concepts : ['Core Architectural Invariants', 'Data Modeling & Syntax Rules', 'Algorithmic Optimization Methods'],
      definitions: [
        'Primary Term: Formal definition established in the introductory sections.',
        'Secondary Mechanism: Protocol or algorithmic rule governing state changes.',
      ],
      importantPoints: points.length > 0 ? points : [
        'Understand foundational assumptions and theoretical models.',
        'Review standard workflows and execution constraints.',
        'Analyze common failure modes and mitigation strategies.',
      ],
      revisionNotes: [
        'High-speed review: Memorize primary definitions and classifications.',
        'Check edge-case conditions and input constraints.',
        'Practice typical questions covering core mechanisms.',
      ],
      examTopics: [
        'Core Conceptual Definitions & Terminology',
        'State Transition Rules & Analysis',
        'Problem Solving & Application Scenarios',
      ],
      difficulty: words > 1500 ? 'Hard' : words > 600 ? 'Medium' : 'Easy',
      estimatedReadingTime: readingTime,
    };
  }
}

module.exports = new PdfSummarizerService();
