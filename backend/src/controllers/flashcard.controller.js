/**
 * Controller for Document Flashcards
 * Provides mock flashcard data for UI development before AI model integration
 */

/**
 * @desc    Get flashcards for a specific document
 * @route   GET /api/flashcards/:documentId
 * @access  Public
 */
const getFlashcardsByDocumentId = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Validate that documentId is provided in URL parameters
    if (!documentId || documentId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Document ID is required.',
      });
    }

    // Hardcoded dummy flashcard data for frontend UI integration
    const flashcards = [
      {
        id: 1,
        question: 'What is an Operating System?',
        answer: 'An Operating System is system software that manages computer hardware and software resources.',
      },
      {
        id: 2,
        question: 'What is a Process?',
        answer: 'A Process is a program in execution.',
      },
      {
        id: 3,
        question: 'What is Deadlock?',
        answer: 'A situation where multiple processes wait indefinitely for resources held by each other.',
      },
      {
        id: 4,
        question: 'What is Paging?',
        answer: 'Paging is a memory management technique that divides memory into fixed-size pages.',
      },
      {
        id: 5,
        question: 'What is CPU Scheduling?',
        answer: 'CPU Scheduling determines which process gets CPU time for execution.',
      },
    ];

    // Return response with 200 OK
    return res.status(200).json({
      success: true,
      documentId: documentId,
      totalFlashcards: flashcards.length,
      flashcards: flashcards,
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
