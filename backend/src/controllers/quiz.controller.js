/**
 * Controller for Document Quizzes
 * Provides mock quiz data segmented by difficulty level (easy, medium, hard) for UI development
 */

/**
 * @desc    Get quiz questions for a specific document
 * @route   GET /api/quiz/:documentId
 * @access  Public
 */
const getQuizByDocumentId = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Validate that documentId is provided in URL parameters
    if (!documentId || documentId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Document ID is required.',
      });
    }

    // Hardcoded dummy quiz data categorized by difficulty
    const quiz = {
      easy: [
        {
          id: 1,
          question: 'What is an Operating System?',
          options: [
            'System Software',
            'Hardware',
            'Database',
            'Network',
          ],
          answer: 'System Software',
        },
        {
          id: 2,
          question: 'Which manages computer resources?',
          options: [
            'Operating System',
            'Compiler',
            'Browser',
            'Editor',
          ],
          answer: 'Operating System',
        },
      ],
      medium: [
        {
          id: 3,
          question: 'What is Deadlock?',
          options: [
            'Memory Leak',
            'CPU Scheduling',
            'Processes waiting indefinitely',
            'File Corruption',
          ],
          answer: 'Processes waiting indefinitely',
        },
        {
          id: 4,
          question: 'What is Paging?',
          options: [
            'CPU Technique',
            'Memory Management Technique',
            'Disk Scheduling',
            'File System',
          ],
          answer: 'Memory Management Technique',
        },
      ],
      hard: [
        {
          id: 5,
          question: 'Which scheduling algorithm may cause starvation?',
          options: [
            'Round Robin',
            'FCFS',
            'Priority Scheduling',
            'FIFO',
          ],
          answer: 'Priority Scheduling',
        },
      ],
    };

    // Return response with 200 OK
    return res.status(200).json({
      success: true,
      documentId: documentId,
      quiz: quiz,
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
