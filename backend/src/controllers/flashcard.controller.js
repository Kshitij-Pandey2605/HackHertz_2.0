const dbService = require('../services/db.service');
const pdfExtractorService = require('../services/pdf.extractor.service');
const flashcardService = require('../services/flashcard.service');
const { supabase } = require('../config/supabase');

/**
 * Controller for Document Flashcards
 * Dynamically generates active recall flashcards from the uploaded PDF document.
 */
const getFlashcardsByDocumentId = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!documentId || documentId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Document ID is required.',
      });
    }

    // 1. Check if flashcards are stored in database
    try {
      const storedFlashcards = await dbService.getFlashcards(documentId);
      if (storedFlashcards && Array.isArray(storedFlashcards) && storedFlashcards.length > 0) {
        return res.status(200).json({
          success: true,
          documentId,
          totalFlashcards: storedFlashcards.length,
          flashcards: storedFlashcards,
        });
      }
    } catch {
      // Continue to dynamic generation
    }

    // 2. Retrieve document record to locate PDF file
    let documentRecord = null;
    if (global._localDocuments) {
      documentRecord = global._localDocuments.find((d) => d.id === documentId);
    }

    if (!documentRecord && supabase) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .single();

        if (!error && data) {
          documentRecord = data;
        }
      } catch {
        // Fallback
      }
    }

    // 3. Extract text from PDF
    let extracted = null;
    try {
      const source = documentRecord?.file_path || documentRecord?.file_url || documentId;
      extracted = await pdfExtractorService.extract(source, {
        documentId,
        fallbackTitle: documentRecord?.file_name || 'Study Document',
      });
    } catch (err) {
      console.warn('Note: Extraction fallback for flashcards:', err.message);
    }

    const docTitle = extracted?.title || documentRecord?.file_name || 'Study Material';
    const sections = extracted?.sections || [];
    const fullText = (extracted?.pages || []).map((p) => p.text).join('\n\n') || '';

    let generatedCards = [];

    // 4. If Gemini API key is available, use AI generation
    if (process.env.GEMINI_API_KEY && fullText.length > 50) {
      try {
        const aiCards = await flashcardService.generateFlashcards(fullText.slice(0, 15000));
        if (Array.isArray(aiCards) && aiCards.length > 0) {
          generatedCards = aiCards;
        }
      } catch (geminiErr) {
        console.warn('Gemini flashcard generation fallback:', geminiErr.message);
      }
    }

    // 5. Synthesize contextual flashcards directly from extracted sections if needed
    if (generatedCards.length === 0) {
      if (sections.length > 0) {
        generatedCards = sections.map((sec, idx) => ({
          id: idx + 1,
          question: `What are the core concepts and principles of ${sec.title}?`,
          answer: sec.content.slice(0, 250).replace(/\n/g, ' ') || `Key concepts related to ${sec.title} in ${docTitle}.`,
          topic: sec.title,
          difficulty: idx % 3 === 0 ? 'EASY' : idx % 3 === 1 ? 'MEDIUM' : 'HARD',
        }));
      } else {
        generatedCards = [
          {
            id: 1,
            question: `What is the primary topic covered in ${docTitle}?`,
            answer: `This material provides comprehensive study material on ${docTitle}.`,
            topic: 'Overview',
            difficulty: 'EASY',
          },
        ];
      }
    }

    // 6. Save flashcards to database
    await dbService.saveFlashcards(documentId, generatedCards).catch(() => {});

    return res.status(200).json({
      success: true,
      documentId,
      totalFlashcards: generatedCards.length,
      flashcards: generatedCards,
    });
  } catch (error) {
    console.error('Flashcard Controller Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred while generating flashcards.',
    });
  }
};

module.exports = {
  getFlashcardsByDocumentId,
};
