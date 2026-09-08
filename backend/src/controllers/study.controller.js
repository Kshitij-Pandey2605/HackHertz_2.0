const path = require('path');
const fs = require('fs');

// Database Service (Supabase)
const dbService = require('../services/db.service');

// Services
const pdfService = require('../services/pdf.service');
const summaryService = require('../services/summary.service');
const flashcardService = require('../services/flashcard.service');
const quizService = require('../services/quiz.service');
const definitionService = require('../services/definition.service');
const formulaService = require('../services/formula.service');

// Utils
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Study Controller (Supabase)
 * Handles all study material API endpoints for the PreMindAI platform using Supabase PostgreSQL.
 */
const studyController = {
  /**
   * POST /api/upload
   * Upload a PDF, run the full AI pipeline, and save records to Supabase.
   * Pipeline: Save file → Extract text → Gemini AI × 5 → Store to Supabase → Respond
   */
  async uploadAndProcess(req, res) {
    let savedDoc = null;

    try {
      // 1. Validate file presence
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded. Please send a PDF using the "file" field.',
        });
      }

      const { difficulty = 'MEDIUM' } = req.body;
      const userId = req.user?.id || 'anonymous';

      // 2. Save Document metadata in Supabase
      savedDoc = await dbService.createDocument({
        userId,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        difficulty: ['EASY', 'MEDIUM', 'HARD'].includes(difficulty) ? difficulty : 'MEDIUM',
      });

      const documentId = savedDoc.id;

      // 3. Extract text from PDF
      let pdfText;
      try {
        pdfText = await pdfService.extractText(req.file.path);
        pdfText = pdfService.truncate(pdfText, 15000);
      } catch (extractErr) {
        await dbService.updateDocument(documentId, { status: 'failed' }).catch(() => {});
        return res.status(422).json({
          success: false,
          error: `PDF text extraction failed: ${extractErr.message}`,
        });
      }

      // 4. Run all AI generation tasks in parallel for speed
      const [summaryResult, flashcardsResult, quizResult, definitionsResult, formulasResult] =
        await Promise.allSettled([
          summaryService.generateSummary(pdfText),
          flashcardService.generateFlashcards(pdfText),
          quizService.generateQuiz(pdfText),
          definitionService.extractDefinitions(pdfText),
          formulaService.extractFormulas(pdfText),
        ]);

      // 5. Persist results to Supabase (log errors but don't fail the request)
      const savePromises = [];

      if (summaryResult.status === 'fulfilled') {
        savePromises.push(
          dbService.saveSummary(documentId, summaryResult.value)
        );
      } else {
        console.error(`[StudyController] Summary generation failed: ${summaryResult.reason?.message}`);
      }

      if (flashcardsResult.status === 'fulfilled') {
        savePromises.push(
          dbService.saveFlashcards(documentId, flashcardsResult.value)
        );
      } else {
        console.error(`[StudyController] Flashcard generation failed: ${flashcardsResult.reason?.message}`);
      }

      if (quizResult.status === 'fulfilled') {
        savePromises.push(
          dbService.saveQuiz(documentId, quizResult.value)
        );
      } else {
        console.error(`[StudyController] Quiz generation failed: ${quizResult.reason?.message}`);
      }

      if (definitionsResult.status === 'fulfilled') {
        savePromises.push(
          dbService.saveDefinitions(documentId, definitionsResult.value)
        );
      } else {
        console.error(`[StudyController] Definition extraction failed: ${definitionsResult.reason?.message}`);
      }

      if (formulasResult.status === 'fulfilled') {
        savePromises.push(
          dbService.saveFormulas(documentId, formulasResult.value)
        );
      } else {
        console.error(`[StudyController] Formula extraction failed: ${formulasResult.reason?.message}`);
      }

      await Promise.allSettled(savePromises);

      // 6. Update document status to completed in Supabase
      await dbService.updateDocument(documentId, { status: 'completed' });

      // 7. Return documentId for frontend
      return res.status(201).json({
        success: true,
        message: 'PDF processed successfully. Study materials generated.',
        documentId,
        fileName: savedDoc.original_name || savedDoc.fileName || req.file.originalname,
        generatedFeatures: {
          summary: summaryResult.status === 'fulfilled',
          flashcards: flashcardsResult.status === 'fulfilled',
          quiz: quizResult.status === 'fulfilled',
          definitions: definitionsResult.status === 'fulfilled',
          formulas: formulasResult.status === 'fulfilled',
        },
      });
    } catch (err) {
      console.error('[StudyController.uploadAndProcess] Unexpected error:', err);

      if (savedDoc && savedDoc.id) {
        await dbService.updateDocument(savedDoc.id, { status: 'failed' }).catch(() => {});
      }

      return res.status(500).json({
        success: false,
        error: err.message || 'An unexpected error occurred during processing.',
      });
    }
  },

  /**
   * GET /api/documents
   * Retrieve all uploaded documents from Supabase.
   */
  async getDocuments(req, res) {
    try {
      const documents = await dbService.getDocuments();
      return successResponse(res, documents, 'Documents retrieved successfully');
    } catch (err) {
      console.error('[StudyController.getDocuments]', err);
      return errorResponse(res, err.message, 500);
    }
  },

  /**
   * GET /api/summary/:documentId
   * Retrieve the AI-generated summary from Supabase.
   */
  async getSummary(req, res) {
    try {
      const { documentId } = req.params;
      const summary = await dbService.getSummary(documentId);

      if (!summary) {
        return res.status(404).json({
          success: false,
          error: `No summary found for document ID: ${documentId}`,
        });
      }

      return successResponse(res, summary, 'Summary retrieved successfully');
    } catch (err) {
      console.error('[StudyController.getSummary]', err);
      return errorResponse(res, err.message, 500);
    }
  },

  /**
   * GET /api/flashcards/:documentId
   * Retrieve AI-generated flashcards from Supabase.
   */
  async getFlashcards(req, res) {
    try {
      const { documentId } = req.params;
      const flashcards = await dbService.getFlashcards(documentId);

      if (!flashcards) {
        return res.status(404).json({
          success: false,
          error: `No flashcards found for document ID: ${documentId}`,
        });
      }

      return successResponse(res, flashcards, 'Flashcards retrieved successfully');
    } catch (err) {
      console.error('[StudyController.getFlashcards]', err);
      return errorResponse(res, err.message, 500);
    }
  },

  /**
   * GET /api/quiz/:documentId
   * Retrieve AI-generated quiz from Supabase.
   */
  async getQuiz(req, res) {
    try {
      const { documentId } = req.params;
      const quiz = await dbService.getQuiz(documentId);

      if (!quiz) {
        return res.status(404).json({
          success: false,
          error: `No quiz found for document ID: ${documentId}`,
        });
      }

      return successResponse(res, quiz, 'Quiz retrieved successfully');
    } catch (err) {
      console.error('[StudyController.getQuiz]', err);
      return errorResponse(res, err.message, 500);
    }
  },

  /**
   * GET /api/definitions/:documentId
   * Retrieve AI-extracted definitions from Supabase.
   */
  async getDefinitions(req, res) {
    try {
      const { documentId } = req.params;
      const definitions = await dbService.getDefinitions(documentId);

      if (!definitions) {
        return res.status(404).json({
          success: false,
          error: `No definitions found for document ID: ${documentId}`,
        });
      }

      return successResponse(res, definitions, 'Definitions retrieved successfully');
    } catch (err) {
      console.error('[StudyController.getDefinitions]', err);
      return errorResponse(res, err.message, 500);
    }
  },

  /**
   * GET /api/formulas/:documentId
   * Retrieve AI-extracted formulas from Supabase.
   */
  async getFormulas(req, res) {
    try {
      const { documentId } = req.params;
      const formulas = await dbService.getFormulas(documentId);

      if (!formulas) {
        return res.status(404).json({
          success: false,
          error: `No formulas found for document ID: ${documentId}`,
        });
      }

      return successResponse(res, formulas, 'Formulas retrieved successfully');
    } catch (err) {
      console.error('[StudyController.getFormulas]', err);
      return errorResponse(res, err.message, 500);
    }
  },

  /**
   * GET /api/chapters/:documentId
   * Retrieve AI-generated chapters from Supabase.
   */
  async getChapters(req, res) {
    try {
      const { documentId } = req.params;
      const summary = await dbService.getSummary(documentId);

      if (!summary || !summary.chapters) {
        return res.status(404).json({
          success: false,
          error: `No chapters found for document ID: ${documentId}`,
        });
      }

      return successResponse(res, summary.chapters, 'Chapters retrieved successfully');
    } catch (err) {
      console.error('[StudyController.getChapters]', err);
      return errorResponse(res, err.message, 500);
    }
  },

  /**
   * GET /api/keypoints/:documentId
   * Retrieve AI-generated key points from Supabase.
   */
  async getKeyPoints(req, res) {
    try {
      const { documentId } = req.params;
      const summary = await dbService.getSummary(documentId);

      if (!summary || !summary.keyPoints) {
        return res.status(404).json({
          success: false,
          error: `No key points found for document ID: ${documentId}`,
        });
      }

      return successResponse(res, summary.keyPoints, 'Key points retrieved successfully');
    } catch (err) {
      console.error('[StudyController.getKeyPoints]', err);
      return errorResponse(res, err.message, 500);
    }
  },
};

module.exports = studyController;
