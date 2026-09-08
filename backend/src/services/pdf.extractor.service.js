const fs = require('fs');
const path = require('path');
const pdfModule = require('pdf-parse');

/**
 * Advanced PDF Extractor Service
 * Extracts text, preserves hierarchy, separates chapters/sections,
 * cleans formatting noise, calculates reading metadata, and outputs structured JSON.
 */
class PdfExtractorService {
  /**
   * Main entry point to extract text and structure from a PDF source.
   * @param {string|Buffer} source - Local file path, remote Supabase URL, or Buffer
   * @param {Object} [options]
   * @param {string} [options.documentId] - Optional document identifier
   * @param {string} [options.fallbackTitle] - Optional fallback title (e.g. filename)
   * @returns {Promise<Object>} Structured extraction result
   */
  async extract(source, options = {}) {
    const documentId = options.documentId || `doc_${Date.now()}`;
    const fallbackTitle = options.fallbackTitle || 'Study Document';

    // 1. Ingest PDF into a Buffer
    const pdfBuffer = await this.loadBuffer(source);

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error('Provided PDF buffer is empty.');
    }

    // 2. Validate PDF signature (%PDF-)
    const signature = pdfBuffer.slice(0, 5).toString('ascii');
    if (!signature.startsWith('%PDF')) {
      throw new Error('Invalid file format. The file is not a valid PDF document.');
    }

    // 3. Extract raw page-wise and total text using pdf-parse
    const rawData = await this.parsePdfData(pdfBuffer);

    if (!rawData.text || rawData.text.trim().length === 0) {
      throw new Error('No readable text could be extracted from this PDF. It might be scanned or image-based.');
    }

    // 4. Clean text and remove noise while preserving formatting
    const cleanedText = this.cleanText(rawData.text);
    const cleanedPages = (rawData.pages || []).map((page) => ({
      pageNumber: page.pageNumber,
      wordCount: this.countWords(page.text),
      text: this.cleanText(page.text),
    }));

    // 5. Detect Document Title
    const detectedTitle = this.detectTitle(cleanedText, rawData.info?.Title, fallbackTitle);

    // 6. Detect and separate Chapters, Topics, and Sections
    const sections = this.extractSections(cleanedText, cleanedPages);

    // 7. Calculate Metadata
    const wordCount = this.countWords(cleanedText);
    const totalPages = rawData.totalPages || cleanedPages.length || 1;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const readingTime = `${readingTimeMinutes} min`;

    // 8. Return structured output conforming to expected schema
    return {
      documentId,
      title: detectedTitle,
      totalPages,
      wordCount,
      readingTime,
      sections,
      pages: cleanedPages,
      metadata: {
        characterCount: cleanedText.length,
        readingTimeMinutes,
        author: rawData.info?.Author || null,
        producer: rawData.info?.Producer || null,
        creationDate: rawData.info?.CreationDate || null,
      },
    };
  }

  /**
   * Load PDF Buffer from local path, remote HTTP/HTTPS URL, or existing Buffer.
   * @param {string|Buffer} source
   * @returns {Promise<Buffer>}
   */
  async loadBuffer(source) {
    if (Buffer.isBuffer(source)) {
      return source;
    }

    if (typeof source !== 'string') {
      throw new Error('PDF source must be a file path, URL string, or Buffer.');
    }

    // Remote Supabase or HTTP URL
    if (source.startsWith('http://') || source.startsWith('https://')) {
      try {
        const response = await fetch(source, {
          headers: {
            'User-Agent': 'PreMindAI-PDFExtractor/1.0',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      } catch (err) {
        throw new Error(`Failed to download PDF from storage URL: ${err.message}`);
      }
    }

    // Local file path
    const resolvedPath = path.isAbsolute(source) ? source : path.resolve(process.cwd(), source);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`PDF file does not exist at local path: ${resolvedPath}`);
    }

    return fs.readFileSync(resolvedPath);
  }

  /**
   * Parse PDF buffer using pdf-parse (v2 PDFParse class or v1 function)
   * @param {Buffer} buffer
   * @returns {Promise<{ text: string, totalPages: number, pages: Array, info: Object }>}
   */
  async parsePdfData(buffer) {
    // 1. Try pdf-parse v2 (PDFParse class)
    if (pdfModule && pdfModule.PDFParse) {
      const parser = new pdfModule.PDFParse({ data: buffer });
      try {
        let textResult;
        let infoResult;

        try {
          textResult = await parser.getText();
        } catch {
          // Fallback if getText throws
        }

        try {
          infoResult = await parser.getInfo();
        } catch {
          infoResult = {};
        }

        const totalPages = infoResult?.pages?.length || infoResult?.numPages || 1;
        const pages = [];

        // Attempt page-by-page extraction if supported
        if (typeof parser.getPageText === 'function') {
          for (let p = 1; p <= totalPages; p++) {
            try {
              const pText = await parser.getPageText(p);
              if (pText && pText.text) {
                pages.push({ pageNumber: p, text: pText.text });
              }
            } catch {
              // Ignore single page error
            }
          }
        }

        const fullText = textResult?.text || pages.map((p) => p.text).join('\n\n') || '';

        // If pages array is still empty, split by form-feed or page markers
        if (pages.length === 0 && fullText) {
          const splitPages = fullText.split(/\f|\n(?=Page\s+\d+)/i);
          splitPages.forEach((t, i) => {
            if (t.trim()) {
              pages.push({ pageNumber: i + 1, text: t.trim() });
            }
          });
        }

        return {
          text: fullText,
          totalPages: pages.length > 0 ? pages.length : totalPages,
          pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: fullText }],
          info: infoResult?.info || {},
        };
      } finally {
        if (typeof parser.destroy === 'function') {
          await parser.destroy().catch(() => {});
        }
      }
    }

    // 2. Legacy pdf-parse (v1 function)
    if (typeof pdfModule === 'function' || typeof pdfModule.default === 'function') {
      const parseFn = typeof pdfModule === 'function' ? pdfModule : pdfModule.default;
      const data = await parseFn(buffer);
      const text = data?.text || '';
      const totalPages = data?.numpages || 1;

      const splitPages = text.split(/\f/);
      const pages = splitPages.map((pt, idx) => ({
        pageNumber: idx + 1,
        text: pt.trim(),
      })).filter((p) => p.text.length > 0);

      return {
        text,
        totalPages: pages.length > 0 ? pages.length : totalPages,
        pages: pages.length > 0 ? pages : [{ pageNumber: 1, text }],
        info: data?.info || {},
      };
    }

    throw new Error('No compatible PDF parser could be initialized.');
  }

  /**
   * Clean text, remove noise, dehyphenate line breaks, normalize lists & whitespace.
   * @param {string} raw
   * @returns {string} Cleaned structured text
   */
  cleanText(raw) {
    if (!raw) return '';

    let text = raw;

    // 1. Normalize line endings
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 2. Dehyphenate words broken across line breaks (e.g. "rela-\ntional" -> "relational")
    text = text.replace(/([a-zA-Z]{2,})[-–—]\s*\n\s*([a-zA-Z]{2,})/g, '$1$2');

    // 3. Remove running page header/footer noise (e.g. "Page 12 of 45", "12 | PreMind Notes")
    text = text.replace(/^(?:page\s+\d+(?:\s+of\s+\d+)?|\d+\s*\|\s*.*|.*\|\s*\d+)$/gim, '');

    // 4. Remove unprintable control chars while preserving newlines & unicode equations
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // 5. Standardize bullet characters to clean bullet symbols
    text = text.replace(/^[ \t]*[•●▪◆➢]\s*/gm, '• ');
    text = text.replace(/^[ \t]*[-*–—]\s+(?=[A-Za-z0-9])/gm, '• ');

    // 6. Clean multiple inline spaces while preserving indentations and line breaks
    text = text
      .split('\n')
      .map((line) => line.replace(/[ \t]{2,}/g, ' ').trim())
      .join('\n');

    // 7. Collapse excessive blank lines (more than 2 consecutive newlines -> 2 newlines)
    text = text.replace(/\n{3,}/g, '\n\n').trim();

    return text;
  }

  /**
   * Detect Document Title from metadata or first lines of text.
   * @param {string} text
   * @param {string} [metaTitle]
   * @param {string} [fallbackTitle]
   * @returns {string}
   */
  detectTitle(text, metaTitle, fallbackTitle) {
    if (metaTitle && metaTitle.trim().length > 3 && !metaTitle.toLowerCase().startsWith('untitled')) {
      return metaTitle.trim();
    }

    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    for (const line of lines.slice(0, 5)) {
      // Look for a reasonable title line (length between 4 and 90 chars, no sentence punctuation at end)
      if (line.length >= 4 && line.length <= 90 && !line.endsWith('.') && !line.startsWith('•')) {
        return line;
      }
    }

    if (fallbackTitle) {
      return fallbackTitle.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').trim();
    }

    return 'Study Material';
  }

  /**
   * Detect and separate document content into logical Sections and Chapters.
   * Preserves hierarchy, headings, subheadings, paragraphs, and list structures.
   * @param {string} fullText
   * @param {Array} pages
   * @returns {Array<{ title: string, content: string }>}
   */
  extractSections(fullText, pages = []) {
    const lines = fullText.split('\n');
    const sections = [];
    let currentTitle = 'Introduction';
    let currentContentLines = [];

    // Heading patterns
    const headingPatterns = [
      // Chapter 1: Introduction / Unit 2 - Normalization / Module 3: Storage
      /^(?:chapter|unit|module|lecture|lesson|part)\s+[0-9IVXLCDM]+[:.\-–—]?\s*(.*)$/i,
      // 1. Introduction / 1.1 Key Concepts / 2.3.1 Relational Schema / 1) Normalization
      /^(?:[0-9]+(?:\.[0-9]+)*[:.)\-–—]?)\s+([A-Z0-9][A-Za-z0-9\s,:&()/\-–—]{2,80})$/,
      // Section I: Overview / Section 2. Normal Forms
      /^(?:section)\s+[0-9IVXLCDM]+(?:\.[0-9]+)*[:.\-–—]?\s*(.*)$/i,
      // Common standalone academic headers
      /^(?:abstract|introduction|overview|background|architecture|system model|methodology|key concepts|core principles|formulas and equations|analysis|discussion|summary|conclusion|glossary|references|practice questions|exam notes)$/i,
      // All uppercase lines with reasonable length (e.g. DATABASE NORMALIZATION CONCEPTS)
      /^[A-Z0-9\s,:&()/\-–—]{4,60}$/,
    ];

    const isHeading = (line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 3 || trimmed.length > 90) return false;
      if (trimmed.startsWith('•') || trimmed.endsWith(';') || trimmed.endsWith(',')) {
        return false;
      }

      return headingPatterns.some((pattern) => pattern.test(trimmed));
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (isHeading(line)) {
        // If we already accumulated content for previous section, push it
        if (currentContentLines.length > 0) {
          const sectionBody = currentContentLines.join('\n').trim();
          if (sectionBody.length > 0) {
            sections.push({
              title: currentTitle,
              content: sectionBody,
            });
          }
          currentContentLines = [];
        }

        currentTitle = line;
      } else {
        if (line.length > 0) {
          currentContentLines.push(line);
        } else if (currentContentLines.length > 0 && currentContentLines[currentContentLines.length - 1] !== '') {
          currentContentLines.push(''); // Preserve paragraph gap
        }
      }
    }

    // Push the final remaining section
    if (currentContentLines.length > 0) {
      const sectionBody = currentContentLines.join('\n').trim();
      if (sectionBody.length > 0) {
        sections.push({
          title: currentTitle,
          content: sectionBody,
        });
      }
    }

    // Fallback: If no distinct headings were identified, divide by pages or topic blocks
    if (sections.length <= 1 && pages.length > 1) {
      return pages.map((page, index) => ({
        title: index === 0 ? 'Introduction' : `Section ${index + 1}`,
        content: page.text,
      }));
    }

    // Fallback: If only 1 section with large content, create Introduction and Core Content
    if (sections.length === 0 && fullText.trim().length > 0) {
      sections.push({
        title: 'Introduction',
        content: fullText.trim(),
      });
    }

    return sections;
  }

  /**
   * Helper to count words accurately in a text string.
   * @param {string} text
   * @returns {number}
   */
  countWords(text) {
    if (!text || typeof text !== 'string') return 0;
    const matches = text.trim().match(/[\w'-]+/g);
    return matches ? matches.length : 0;
  }
}

module.exports = new PdfExtractorService();
