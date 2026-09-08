/**
 * Controller for Document Summaries
 * Provides mock summary data for UI development before AI model integration
 */

/**
 * @desc    Get summary for a specific document
 * @route   GET /api/summary/:documentId
 * @access  Public
 */
const getSummaryByDocumentId = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Validate that documentId is provided in URL parameters
    if (!documentId || documentId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Document ID is required.',
      });
    }

    // Hardcoded dummy summary data for frontend UI integration
    const summary = {
      quickSummary: 'Operating System manages computer hardware and software resources.',
      detailedSummary:
        'An operating system acts as an intermediary between users and computer hardware. It manages memory, processes, files, and devices while providing a user-friendly environment for executing applications.',
      examNotes: [
        'Process Management',
        'Memory Management',
        'Deadlock',
        'Paging',
        'Scheduling Algorithms',
      ],
    };

    // Return response with 200 OK
    return res.status(200).json({
      success: true,
      documentId: documentId,
      summary: summary,
    });
  } catch (error) {
    console.error('Summary Controller Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred while generating the summary.',
    });
  }
};

module.exports = {
  getSummaryByDocumentId,
};
