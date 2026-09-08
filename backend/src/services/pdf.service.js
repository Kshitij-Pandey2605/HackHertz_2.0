const fs = require('fs');
const path = require('path');
const pdfModule = require('pdf-parse');

/**
 * PDF Service
 * Extracts and cleans text content from PDF files stored on disk.
 * Supports both legacy function signature and modern PDFParse class.
 */
const pdfService = {
  /**
   * Extract text from a PDF file at the given absolute file path.
   * @param {string} filePath - Absolute path to the PDF file
   * @returns {Promise<string>} Cleaned extracted text
   */
  async extractText(filePath) {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`PDF file not found at path: ${absolutePath}`);
    }

    const fileBuffer = fs.readFileSync(absolutePath);

    try {
      let rawText = '';

      if (typeof pdfModule === 'function') {
        // Legacy pdf-parse (v1.x)
        const data = await pdfModule(fileBuffer);
        rawText = data?.text || '';
      } else if (pdfModule && pdfModule.PDFParse) {
        // Modern pdf-parse (v2.x)
        const parser = new pdfModule.PDFParse({ data: fileBuffer });
        try {
          const result = await parser.getText();
          rawText = result?.text || '';
        } finally {
          if (typeof parser.destroy === 'function') {
            await parser.destroy();
          }
        }
      } else if (typeof pdfModule.default === 'function') {
        const data = await pdfModule.default(fileBuffer);
        rawText = data?.text || '';
      } else {
        throw new Error('Unsupported pdf-parse library structure.');
      }

      if (!rawText || !rawText.trim()) {
        throw new Error('PDF extraction returned no text content.');
      }

      const cleaned = this._cleanText(rawText);

      if (cleaned.length < 50) {
        throw new Error(
          'Extracted text is too short (< 50 chars). The PDF may be image-based, scanned, or empty.'
        );
      }

      return cleaned;
    } catch (err) {
      if (err.message.startsWith('PDF file not found') || err.message.includes('too short')) {
        throw err;
      }
      throw new Error(`Failed to extract text from PDF: ${err.message}`);
    }
  },

  /**
   * Remove excess whitespace and non-printable characters from extracted text.
   * @param {string} raw - Raw text from pdf-parse
   * @returns {string} Cleaned text
   * @private
   */
  _cleanText(raw) {
    return raw
      .replace(/\r\n/g, '\n')           // normalize line endings
      .replace(/\r/g, '\n')             // normalize CR
      .replace(/\n{3,}/g, '\n\n')       // collapse 3+ blank lines to 2
      .replace(/[ \t]{2,}/g, ' ')       // collapse multiple spaces/tabs
      .replace(/[^\x20-\x7E\n\u00A0-\uFFFF]/g, '') // strip non-printable chars
      .trim();
  },

  /**
   * Truncate text to a safe token-friendly length for Gemini.
   * Gemini 1.5 Flash supports ~1M tokens; we cap at ~15,000 chars for reliability.
   * @param {string} text
   * @param {number} [maxChars=15000]
   * @returns {string}
   */
  truncate(text, maxChars = 15000) {
    if (text.length <= maxChars) return text;
    return text.substring(0, maxChars) + '\n\n[... Document truncated for processing ...]';
  },
};

module.exports = pdfService;
