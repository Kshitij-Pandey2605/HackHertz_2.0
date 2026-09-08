const dbService = require('../services/db.service');
const pdfExtractorService = require('../services/pdf.extractor.service');
const summaryService = require('../services/summary.service');
const { supabase } = require('../config/supabase');
const fs = require('fs');
const path = require('path');

/**
 * Controller for Document Summaries
 * Dynamically generates and serves contextual summaries for any uploaded PDF (DSA, DBMS, OS, etc.)
 */
const getSummaryByDocumentId = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!documentId || documentId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Document ID is required.',
      });
    }

    // 1. Check if summary is already stored in database
    try {
      const storedSummary = await dbService.getSummary(documentId);
      if (storedSummary && (storedSummary.quickSummary || storedSummary.detailedSummary)) {
        return res.status(200).json({
          success: true,
          documentId,
          summary: {
            quickSummary: storedSummary.quickSummary,
            detailedSummary: storedSummary.detailedSummary,
            examNotes: Array.isArray(storedSummary.examNotes)
              ? storedSummary.examNotes
              : (storedSummary.examNotes || '').split('\n').map((s) => s.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean),
            keyPoints: storedSummary.keyPoints || [],
            chapters: storedSummary.chapters || [],
          },
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

    // 3. Extract text & sections from the uploaded PDF
    let extracted = null;
    try {
      const source = documentRecord?.file_path || documentRecord?.file_url || documentId;
      extracted = await pdfExtractorService.extract(source, {
        documentId,
        fallbackTitle: documentRecord?.file_name || 'Study Document',
      });
    } catch (err) {
      console.warn('Note: Extraction fallback for summary:', err.message);
    }

    const docTitle = extracted?.title || documentRecord?.file_name || 'Study Material';
    const sections = extracted?.sections || [];
    const fullText = (extracted?.pages || []).map((p) => p.text).join('\n\n') || '';

    let generatedSummary = null;

    // 4. If Gemini API key is available, use AI generation
    if (process.env.GEMINI_API_KEY && fullText.length > 50) {
      try {
        generatedSummary = await summaryService.generateSummary(fullText.slice(0, 15000));
      } catch (geminiErr) {
        console.warn('Gemini summary generation fallback:', geminiErr.message);
      }
    }

    // 5. If no Gemini or fallback needed, synthesize contextual summary from extracted sections
    if (!generatedSummary) {
      const sectionSummaries = sections.map((sec) => `${sec.title}:\n${sec.content.slice(0, 300)}...`);
      const examBullets = sections.map((sec) => `Core concepts and rules of ${sec.title}: Review definitions and algorithm steps.`);

      const detailedParagraphs = sections.map((sec) => 
        `### ${sec.title}\n${sec.content.length > 500 ? sec.content.slice(0, 500) + '...' : sec.content}`
      ).join('\n\n');

      generatedSummary = {
        quickSummary: `This study material covers ${docTitle}. It details ${sections.length} core sections covering ${sections.slice(0, 4).map(s => s.title).join(', ')}.`,
        detailedSummary: detailedParagraphs || `Detailed analysis and comprehensive coverage of ${docTitle}.`,
        examNotes: examBullets.length > 0 ? examBullets : [
          `Review core principles of ${docTitle}`,
          `Master key algorithm steps and problem patterns`,
          `Pay special attention to edge cases and time complexity`,
        ],
        keyPoints: sections.map((sec, idx) => ({
          id: `kp_${idx + 1}`,
          concept: sec.title,
          priority: idx === 0 ? 'CORE' : 'HIGH',
          explanation: sec.content.slice(0, 120).replace(/\n/g, ' ') + '...',
        })),
        chapters: sections.map((sec, idx) => ({
          id: `ch_${idx + 1}`,
          number: idx + 1,
          title: sec.title,
          topics: [
            {
              id: `top_${idx + 1}_1`,
              title: `${sec.title} Fundamentals`,
              points: [sec.content.slice(0, 100).replace(/\n/g, ' ') || 'Key learning concept.'],
            },
          ],
        })),
      };
    }

    // 6. Save summary for future requests
    await dbService.saveSummary(documentId, generatedSummary).catch(() => {});

    return res.status(200).json({
      success: true,
      documentId,
      summary: {
        quickSummary: generatedSummary.quickSummary,
        detailedSummary: generatedSummary.detailedSummary,
        examNotes: Array.isArray(generatedSummary.examNotes)
          ? generatedSummary.examNotes
          : (generatedSummary.examNotes || '').split('\n').map((s) => s.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean),
        keyPoints: generatedSummary.keyPoints || [],
        chapters: generatedSummary.chapters || [],
      },
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
