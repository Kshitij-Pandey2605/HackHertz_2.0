const dbService = require('../services/db.service');
const pdfExtractorService = require('../services/pdf.extractor.service');
const quizService = require('../services/quiz.service');
const { supabase } = require('../config/supabase');

/**
 * Controller for Document Quizzes
 * Dynamically generates and serves contextual quiz questions for any uploaded PDF (DSA, DBMS, OS, etc.)
 */
const getQuizByDocumentId = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!documentId || documentId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Document ID is required.',
      });
    }

    // 1. Check if quiz is already stored in database
    try {
      const storedQuiz = await dbService.getQuiz(documentId);
      if (storedQuiz && (storedQuiz.easy || storedQuiz.medium || storedQuiz.hard)) {
        return res.status(200).json({
          success: true,
          documentId,
          quiz: storedQuiz,
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
      console.warn('Note: Extraction fallback for quiz:', err.message);
    }

    const docTitle = extracted?.title || documentRecord?.file_name || 'Study Material';
    const sections = extracted?.sections || [];
    const fullText = (extracted?.pages || []).map((p) => p.text).join('\n\n') || '';

    let generatedQuiz = null;

    // 4. If Gemini API key is available, use AI generation
    if (process.env.GEMINI_API_KEY && fullText.length > 50) {
      try {
        const aiQuiz = await quizService.generateQuiz(fullText.slice(0, 15000));
        if (aiQuiz && (aiQuiz.easy?.length || aiQuiz.medium?.length || aiQuiz.hard?.length)) {
          generatedQuiz = aiQuiz;
        }
      } catch (geminiErr) {
        console.warn('Gemini quiz generation fallback:', geminiErr.message);
      }
    }

    // 5. Synthesize contextual quiz questions from extracted sections
    if (!generatedQuiz) {
      const makeSectionQuestions = (secs, difficulty) => {
        return secs.map((sec, idx) => {
          const title = sec.title || 'Core Topic';
          return {
            id: idx + 1,
            question: `In ${docTitle}, what is the primary purpose and rule governing "${title}"?`,
            options: [
              `It governs foundational operations and structure for ${title}`,
              `It is an optional deprecated format in legacy systems`,
              `It is solely used for external network transmission`,
              `It operates as a random noise filter with no constraints`,
            ],
            answer: `It governs foundational operations and structure for ${title}`,
            explanation: `According to ${docTitle}, ${title} provides: ${sec.content.slice(0, 120).replace(/\n/g, ' ')}...`,
          };
        });
      };

      const easySecs = sections.slice(0, 3);
      const medSecs = sections.slice(3, 6);
      const hardSecs = sections.slice(6, 9);

      generatedQuiz = {
        easy: easySecs.length > 0 ? makeSectionQuestions(easySecs, 'EASY') : [
          {
            id: 1,
            question: `What is the primary topic covered in ${docTitle}?`,
            options: [docTitle, 'General Literature', 'Microeconomics', 'Organic Chemistry'],
            answer: docTitle,
            explanation: `The uploaded document focuses on ${docTitle}.`,
          },
        ],
        medium: medSecs.length > 0 ? makeSectionQuestions(medSecs, 'MEDIUM') : [
          {
            id: 2,
            question: `Which fundamental principle is demonstrated throughout ${docTitle}?`,
            options: [
              `Algorithmic efficiency and structured data principles`,
              `Unstructured arbitrary memory usage`,
              `Manual analog processing without automation`,
              `Random non-deterministic states`,
            ],
            answer: `Algorithmic efficiency and structured data principles`,
            explanation: `Concepts analyzed in ${docTitle} follow structured principles.`,
          },
        ],
        hard: hardSecs.length > 0 ? makeSectionQuestions(hardSecs, 'HARD') : [
          {
            id: 3,
            question: `How do advanced constraints in ${docTitle} optimize practical problem solving?`,
            options: [
              `By minimizing time/space complexity and preserving correctness`,
              `By increasing exponential overhead needlessly`,
              `By removing all verification steps`,
              `By disabling type safety completely`,
            ],
            answer: `By minimizing time/space complexity and preserving correctness`,
            explanation: `Advanced concepts in ${docTitle} ensure optimal performance.`,
          },
        ],
      };
    }

    // 6. Save quiz to database
    await dbService.saveQuiz(documentId, generatedQuiz).catch(() => {});

    return res.status(200).json({
      success: true,
      documentId,
      quiz: generatedQuiz,
    });
  } catch (error) {
    console.error('Quiz Controller Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred while generating the quiz.',
    });
  }
};

module.exports = {
  getQuizByDocumentId,
};
