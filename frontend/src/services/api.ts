import {
  Material,
  ProcessingJob,
  DashboardStats,
  DifficultyLevel,
  User,
  ApiResponse,
  QuickSummary,
  DeepSummary,
  ExamCram,
  Chapter,
  KeyPointsData,
  Formula,
  GlossaryTerm,
  Flashcard,
  FlashcardFeedback,
  StudyWorkspace,
  QuizQuestion,
  QuizSettings,
  QuizSession,
  GradedQuestion,
  QuizResult,
  ExportContent,
  QuestionType,
} from '../types';
import {
  mockMaterials,
  mockDashboardStats,
  mockUser,
  defaultProcessingSteps,
  mockQuickSummary,
  mockDeepSummary,
  mockExamCram,
  mockChapters,
  mockKeyPoints,
  mockFormulas,
  mockGlossary,
  mockFlashcards,
  mockQuizQuestions,
  mockExportData,
} from '../data/mockData';

// Local storage keys for state persistence across sessions
const MATERIALS_STORAGE_KEY = 'premind_materials';
const JOBS_STORAGE_KEY = 'premind_processing_jobs';

// Helper to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to initialize local persistent copy of materials
const getStoredMaterials = (): Material[] => {
  try {
    const data = localStorage.getItem(MATERIALS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load materials from localStorage', e);
  }
  return [...mockMaterials];
};

const saveMaterials = (materials: Material[]) => {
  try {
    localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(materials));
  } catch (e) {
    console.error('Failed to save materials to localStorage', e);
  }
};

const getStoredJobs = (): Record<string, ProcessingJob> => {
  try {
    const data = localStorage.getItem(JOBS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load processing jobs from localStorage', e);
  }
  return {};
};

const saveJobs = (jobs: Record<string, ProcessingJob>) => {
  try {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.error('Failed to save processing jobs to localStorage', e);
  }
};

export const api = {
  // Authentication services
  auth: {
    login: async (email: string, _password: string): Promise<ApiResponse<User>> => {
      await delay(600);
      if (!email || !email.includes('@')) {
        throw new Error('Please provide a valid email address.');
      }
      return {
        success: true,
        data: {
          ...mockUser,
          email,
        },
        message: 'Logged in successfully.',
      };
    },

    signup: async (name: string, email: string, _password: string): Promise<ApiResponse<User>> => {
      await delay(750);
      if (!name.trim()) throw new Error('Full name is required.');
      if (!email.includes('@')) throw new Error('Please provide a valid email address.');
      
      return {
        success: true,
        data: {
          id: `user_${Date.now()}`,
          name,
          email,
        },
        message: 'Account created successfully.',
      };
    },

    forgotPassword: async (email: string): Promise<ApiResponse<{ sent: boolean }>> => {
      await delay(600);
      if (!email || !email.includes('@')) {
        throw new Error('Please provide a valid email address.');
      }
      return {
        success: true,
        data: { sent: true },
        message: 'Password reset link has been dispatched to your email.',
      };
    },
  },

  // Dashboard statistics
  dashboard: {
    getStats: async (): Promise<ApiResponse<DashboardStats>> => {
      await delay(400);
      const materials = getStoredMaterials();
      const readyMaterials = materials.filter((m) => m.status === 'ready');
      
      const stats: DashboardStats = {
        materialsCount: readyMaterials.length,
        summariesCount: readyMaterials.reduce((acc, m) => acc + (m.summaryCounts ? 3 : 0), 0),
        flashcardsCount: readyMaterials.reduce((acc, m) => acc + m.flashcardCount, 0),
        quizzesCount: readyMaterials.reduce((acc, m) => acc + m.quizCount, 0),
      };
      
      return {
        success: true,
        data: stats,
      };
    },
  },

  // Study materials services
  materials: {
    getAll: async (): Promise<ApiResponse<Material[]>> => {
      await delay(450);
      const materials = getStoredMaterials();
      return {
        success: true,
        data: materials,
      };
    },

    getById: async (id: string): Promise<ApiResponse<Material>> => {
      await delay(350);
      const materials = getStoredMaterials();
      const material = materials.find((m) => m.id === id);
      if (!material) {
        throw new Error(`Material with ID "${id}" was not found.`);
      }
      return {
        success: true,
        data: material,
      };
    },

    uploadMaterial: async (
      file: File,
      difficulty: DifficultyLevel
    ): Promise<ApiResponse<{ material: Material; job: ProcessingJob }>> => {
      await delay(800); // Simulate upload latency

      const materialId = `mat_${Date.now()}`;
      const jobId = `job_${Date.now()}`;

      // Approximate page count estimation from file size
      const estimatedPages = Math.max(8, Math.min(120, Math.round(file.size / (1024 * 75))));

      const extension = file.name.split('.').pop()?.toUpperCase() || 'PDF';

      const newMaterial: Material = {
        id: materialId,
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
        subject: 'General Studies',
        pages: estimatedPages,
        uploadDate: new Date().toISOString(),
        lastStudied: 'Just now',
        difficulty,
        status: 'processing',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: extension,
        originalFilename: file.name,
        summaryCounts: {
          quickGlance: true,
          deepSummary: true,
          examCram: true,
        },
        chapterCount: 4,
        formulaCount: 12,
        glossaryCount: 20,
        flashcardCount: 25,
        quizCount: 15,
      };

      const newJob: ProcessingJob = {
        id: jobId,
        materialId,
        fileName: file.name,
        pageCount: estimatedPages,
        difficulty,
        progress: 10,
        currentStepIndex: 0,
        steps: defaultProcessingSteps.map((s, idx) => ({
          ...s,
          status: idx === 0 ? 'in_progress' : 'pending',
        })),
        status: 'processing',
      };

      // Store in memory / storage
      const materials = getStoredMaterials();
      saveMaterials([newMaterial, ...materials]);

      const jobs = getStoredJobs();
      jobs[jobId] = newJob;
      saveJobs(jobs);

      return {
        success: true,
        data: {
          material: newMaterial,
          job: newJob,
        },
        message: 'Material uploaded and processing queued.',
      };
    },
  },

  // AI Processing status services
  processing: {
    getStatus: async (jobId: string): Promise<ApiResponse<ProcessingJob>> => {
      await delay(250);
      const jobs = getStoredJobs();
      let job = jobs[jobId];

      if (!job) {
        // Fallback for direct URL access or mock presentation
        job = {
          id: jobId,
          materialId: 'mat_dbms_01',
          fileName: 'Database_Systems_Module3.pdf',
          pageCount: 48,
          difficulty: 'MEDIUM',
          progress: 15,
          currentStepIndex: 0,
          steps: defaultProcessingSteps.map((s, idx) => ({
            ...s,
            status: idx === 0 ? 'in_progress' : 'pending',
          })),
          status: 'processing',
        };
      }

      return {
        success: true,
        data: job,
      };
    },

    updateJobStep: async (
      jobId: string,
      stepIndex: number,
      isFinished: boolean = false
    ): Promise<ApiResponse<ProcessingJob>> => {
      const jobs = getStoredJobs();
      const job = jobs[jobId] || {
        id: jobId,
        materialId: 'mat_dbms_01',
        fileName: 'Database_Systems_Module3.pdf',
        pageCount: 48,
        difficulty: 'MEDIUM',
        progress: 0,
        currentStepIndex: 0,
        steps: [...defaultProcessingSteps],
        status: 'processing',
      };

      const updatedSteps = job.steps.map((step, idx) => {
        if (idx < stepIndex) {
          return { ...step, status: 'completed' as const };
        } else if (idx === stepIndex) {
          return { ...step, status: isFinished ? ('completed' as const) : ('in_progress' as const) };
        } else {
          return { ...step, status: 'pending' as const };
        }
      });

      const totalSteps = updatedSteps.length;
      const progress = isFinished
        ? 100
        : Math.min(95, Math.round(((stepIndex + 0.5) / totalSteps) * 100));

      const updatedJob: ProcessingJob = {
        ...job,
        steps: updatedSteps,
        currentStepIndex: stepIndex,
        progress,
        status: isFinished ? 'completed' : 'processing',
      };

      jobs[jobId] = updatedJob;
      saveJobs(jobs);

      // If completed, update corresponding material status to 'ready'
      if (isFinished) {
        const materials = getStoredMaterials();
        const updatedMaterials = materials.map((m) =>
          m.id === job.materialId ? { ...m, status: 'ready' as const } : m
        );
        saveMaterials(updatedMaterials);
      }

      return {
        success: true,
        data: updatedJob,
      };
    },
  },

  // Phase 2 Study Workspace API Services
  workspace: {
    getStudyWorkspace: async (id: string): Promise<ApiResponse<StudyWorkspace>> => {
      await delay(300);
      const materials = getStoredMaterials();
      const material = materials.find((m) => m.id === id) || mockMaterials[0];

      return {
        success: true,
        data: {
          material,
          quickSummary: mockQuickSummary,
          deepSummary: mockDeepSummary,
          examCram: mockExamCram,
          chapters: mockChapters,
          keyPoints: mockKeyPoints,
          formulas: mockFormulas,
          glossary: mockGlossary,
          flashcards: mockFlashcards,
        },
      };
    },

    getQuickSummary: async (_id: string): Promise<ApiResponse<QuickSummary>> => {
      await delay(250);
      return { success: true, data: mockQuickSummary };
    },

    getDeepSummary: async (_id: string): Promise<ApiResponse<DeepSummary>> => {
      await delay(300);
      return { success: true, data: mockDeepSummary };
    },

    getExamCram: async (_id: string): Promise<ApiResponse<ExamCram>> => {
      await delay(250);
      return { success: true, data: mockExamCram };
    },

    getChapters: async (_id: string): Promise<ApiResponse<Chapter[]>> => {
      await delay(200);
      return { success: true, data: mockChapters };
    },

    getKeyPoints: async (_id: string): Promise<ApiResponse<KeyPointsData>> => {
      await delay(200);
      return { success: true, data: mockKeyPoints };
    },

    getFormulas: async (_id: string): Promise<ApiResponse<Formula[]>> => {
      await delay(200);
      return { success: true, data: mockFormulas };
    },

    getGlossary: async (_id: string): Promise<ApiResponse<GlossaryTerm[]>> => {
      await delay(200);
      return { success: true, data: mockGlossary };
    },

    getFlashcards: async (
      _id: string,
      filters?: { topic?: string; difficulty?: DifficultyLevel }
    ): Promise<ApiResponse<Flashcard[]>> => {
      await delay(250);
      let cards = [...mockFlashcards];

      if (filters?.topic && filters.topic !== 'ALL') {
        cards = cards.filter(
          (c) => c.topic.toLowerCase() === filters.topic!.toLowerCase()
        );
      }

      if (filters?.difficulty) {
        cards = cards.filter((c) => c.difficulty === filters.difficulty);
      }

      return { success: true, data: cards };
    },

    submitFlashcardFeedback: async (
      _id: string,
      feedback: FlashcardFeedback
    ): Promise<ApiResponse<{ recorded: boolean; nextReview: string }>> => {
      await delay(150);
      let nextReview = 'In 1 day';
      if (feedback.rating === 'AGAIN') nextReview = 'Later today';
      if (feedback.rating === 'EASY') nextReview = 'In 3 days';

      return {
        success: true,
        data: { recorded: true, nextReview },
        message: `Flashcard rating saved. Suggested review: ${nextReview}`,
      };
    },
  },

  // Quiz Assessment Services (Phase 3)
  quiz: {
    getQuizSetup: async (materialId: string): Promise<ApiResponse<{
      material: Material;
      availableCounts: number[];
      availableTypes: { id: QuestionType; label: string; description: string }[];
      topics: string[];
    }>> => {
      await delay(200);
      const materials = getStoredMaterials();
      const material = materials.find((m) => m.id === materialId) || materials[0];

      return {
        success: true,
        data: {
          material,
          availableCounts: [5, 10, 15, 20],
          availableTypes: [
            {
              id: 'MCQ',
              label: 'Multiple Choice',
              description: 'Standard 4-option conceptual and exam-grade questions',
            },
            {
              id: 'TRUE_FALSE',
              label: 'True / False',
              description: 'Binary rapid-check verification questions',
            },
            {
              id: 'FILL_BLANK',
              label: 'Fill in the Blank',
              description: 'Precision vocabulary and rule completion items',
            },
            {
              id: 'SHORT_ANSWER',
              label: 'Short Answer',
              description: 'Conceptual explanations and comparison questions',
            },
          ],
          topics: [
            'Normalization',
            'Functional Dependencies',
            'Candidate Keys',
            'Lossless Join',
            'Armstrong Axioms',
          ],
        },
      };
    },

    generateQuiz: async (
      materialId: string,
      settings: QuizSettings
    ): Promise<ApiResponse<QuizSession>> => {
      await delay(450); // Professional loading simulation
      const materials = getStoredMaterials();
      const material = materials.find((m) => m.id === materialId) || materials[0];

      // Filter questions by difficulty and selected types
      let pool = mockQuizQuestions.filter(
        (q) =>
          (q.difficulty === settings.difficulty || settings.difficulty === 'MEDIUM') &&
          settings.questionTypes.includes(q.type)
      );

      // If pool is smaller than requested, add from other difficulties as fallback
      if (pool.length < settings.questionCount) {
        const remaining = mockQuizQuestions.filter(
          (q) => settings.questionTypes.includes(q.type) && !pool.some((p) => p.id === q.id)
        );
        pool = [...pool, ...remaining];
      }

      // If still fewer, add any question matching types
      if (pool.length === 0) {
        pool = [...mockQuizQuestions];
      }

      // Cap to available or selected
      const selectedQuestions = pool.slice(0, Math.min(settings.questionCount, pool.length));

      const session: QuizSession = {
        id: `quiz_${Date.now()}`,
        materialId,
        materialTitle: material.title,
        difficulty: settings.difficulty,
        questionCount: selectedQuestions.length,
        questionTypes: settings.questionTypes,
        questions: selectedQuestions,
        startedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(`premind_active_quiz_${materialId}`, JSON.stringify(session));
      } catch (e) {
        console.error('Failed to save active quiz session', e);
      }

      return {
        success: true,
        data: session,
        message: 'Practice quiz generated successfully.',
      };
    },

    getQuizSession: async (materialId: string): Promise<ApiResponse<QuizSession>> => {
      await delay(150);
      try {
        const saved = localStorage.getItem(`premind_active_quiz_${materialId}`);
        if (saved) {
          return { success: true, data: JSON.parse(saved) };
        }
      } catch (e) {
        console.error('Failed to parse quiz session', e);
      }

      // Fallback default quiz session
      const materials = getStoredMaterials();
      const material = materials.find((m) => m.id === materialId) || materials[0];
      const fallbackQuestions = mockQuizQuestions.slice(0, 10);
      const fallbackSession: QuizSession = {
        id: `quiz_${Date.now()}`,
        materialId,
        materialTitle: material.title,
        difficulty: 'MEDIUM',
        questionCount: fallbackQuestions.length,
        questionTypes: ['MCQ', 'TRUE_FALSE', 'FILL_BLANK', 'SHORT_ANSWER'],
        questions: fallbackQuestions,
        startedAt: new Date().toISOString(),
      };

      return { success: true, data: fallbackSession };
    },

    submitQuiz: async (
      materialId: string,
      answers: Record<string, string>
    ): Promise<ApiResponse<QuizResult>> => {
      await delay(700); // Polished grading state simulation
      const sessionRes = await api.quiz.getQuizSession(materialId);
      const session = sessionRes.data;

      let correctCount = 0;
      let incorrectCount = 0;
      let unansweredCount = 0;

      const gradedQuestions: GradedQuestion[] = session.questions.map((q) => {
        const rawAnswer = (answers[q.id] || '').trim();
        const hasAnswered = rawAnswer.length > 0;

        if (!hasAnswered) {
          unansweredCount += 1;
          return {
            questionId: q.id,
            question: q.question,
            type: q.type,
            userAnswer: '(Unanswered)',
            correctAnswer: q.correctAnswer,
            isCorrect: false,
            explanation: q.explanation,
            topic: q.topic,
            chapter: q.chapter,
            targetSection: q.targetSection || 'deep-summary',
          };
        }

        let isCorrect = false;

        if (q.type === 'MCQ') {
          isCorrect = rawAnswer.toLowerCase() === q.correctAnswer.trim().toLowerCase();
        } else if (q.type === 'TRUE_FALSE') {
          isCorrect = rawAnswer.toUpperCase() === q.correctAnswer.trim().toUpperCase();
        } else if (q.type === 'FILL_BLANK') {
          const acceptable = (q.acceptableAnswers || [q.correctAnswer]).map((a) =>
            a.trim().toLowerCase()
          );
          isCorrect = acceptable.includes(rawAnswer.toLowerCase());
        } else if (q.type === 'SHORT_ANSWER') {
          // Deterministic heuristic: non-empty answers above 10 chars with relevant keywords are marked correct/credit
          const lower = rawAnswer.toLowerCase();
          const hasLength = rawAnswer.length >= 10;
          const keyTerms = ['key', 'superkey', '3nf', 'bcnf', 'dependency', 'redundancy', 'normal', 'prime', 'attribute', 'anomaly', 'closure'];
          const matchedKeywords = keyTerms.filter((term) => lower.includes(term));
          isCorrect = hasLength && (matchedKeywords.length >= 1 || rawAnswer.length > 25);
        }

        if (isCorrect) {
          correctCount += 1;
        } else {
          incorrectCount += 1;
        }

        return {
          questionId: q.id,
          question: q.question,
          type: q.type,
          userAnswer: rawAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect,
          explanation: q.explanation,
          topic: q.topic,
          chapter: q.chapter,
          targetSection: q.targetSection || 'deep-summary',
        };
      });

      const totalQuestions = session.questions.length;
      const score = correctCount;
      const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

      let summaryMessage = 'Review a few concepts before your next attempt.';
      if (percentage >= 80) {
        summaryMessage = 'Strong understanding of the core concepts! Excellent grasp of normal forms and dependencies.';
      } else if (percentage >= 60) {
        summaryMessage = 'Good overall retention. Strengthen edge cases like BCNF trade-offs and lossless joins.';
      } else {
        summaryMessage = 'Foundational concepts need revision. Use the Deep Summary and Flashcards before retrying.';
      }

      const result: QuizResult = {
        id: `result_${Date.now()}`,
        quizId: session.id,
        materialId,
        materialTitle: session.materialTitle,
        difficulty: session.difficulty,
        totalQuestions,
        correctCount,
        incorrectCount,
        unansweredCount,
        score,
        percentage,
        summaryMessage,
        gradedQuestions,
        completedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(`premind_quiz_result_${materialId}`, JSON.stringify(result));
      } catch (e) {
        console.error('Failed to save quiz result', e);
      }

      return {
        success: true,
        data: result,
        message: 'Quiz evaluated successfully.',
      };
    },

    getQuizResult: async (materialId: string): Promise<ApiResponse<QuizResult>> => {
      await delay(200);
      try {
        const saved = localStorage.getItem(`premind_quiz_result_${materialId}`);
        if (saved) {
          return { success: true, data: JSON.parse(saved) };
        }
      } catch (e) {
        console.error('Failed to load quiz result', e);
      }

      // Default mock result if visited directly
      const mockDefaultResult: QuizResult = {
        id: `res_default`,
        quizId: `quiz_default`,
        materialId,
        materialTitle: 'Database Management Systems — Normalization & Functional Dependencies',
        difficulty: 'MEDIUM',
        totalQuestions: 15,
        correctCount: 12,
        incorrectCount: 2,
        unansweredCount: 1,
        score: 12,
        percentage: 80,
        summaryMessage: 'Strong understanding of the core concepts! Review a few edge cases before your final exam.',
        gradedQuestions: [
          {
            questionId: 'q-med-2',
            question: 'Which normal form permits a non-superkey determinant X in X → A, provided that A is a prime attribute?',
            type: 'MCQ',
            userAnswer: '2NF',
            correctAnswer: 'Third Normal Form (3NF)',
            isCorrect: false,
            explanation: '3NF removes transitive dependencies involving non-prime attributes, allowing prime attributes on the RHS.',
            topic: 'Normalization',
            chapter: 'Chapter 3',
            targetSection: 'deep-summary',
          },
          {
            questionId: 'q-hard-2',
            question: 'What is the primary theoretical trade-off when decomposing a relation into BCNF instead of 3NF?',
            type: 'MCQ',
            userAnswer: 'Functional dependency preservation cannot always be guaranteed in BCNF',
            correctAnswer: 'Functional dependency preservation cannot always be guaranteed in BCNF',
            isCorrect: true,
            explanation: 'BCNF guarantees lossless join and zero FD redundancy, but may sacrifice dependency preservation.',
            topic: 'Normalization',
            chapter: 'Chapter 3',
            targetSection: 'exam-cram',
          },
          {
            questionId: 'q-med-4',
            question: 'In 3NF, for every non-trivial FD X → A, either X is a superkey or A is a ______ attribute.',
            type: 'FILL_BLANK',
            userAnswer: '(Unanswered)',
            correctAnswer: 'prime',
            isCorrect: false,
            explanation: 'This relaxation in 3NF allows prime attributes to preserve dependencies without creating transitive anomalies.',
            topic: 'Normalization',
            chapter: 'Chapter 3',
            targetSection: 'deep-summary',
          },
        ],
        completedAt: new Date().toISOString(),
      };

      return { success: true, data: mockDefaultResult };
    },

    retryQuiz: async (
      materialId: string,
      settings?: QuizSettings
    ): Promise<ApiResponse<QuizSession>> => {
      // Clear saved result and generate fresh session
      try {
        localStorage.removeItem(`premind_active_quiz_${materialId}`);
        localStorage.removeItem(`premind_quiz_result_${materialId}`);
      } catch (e) {
        console.error('Failed to clear quiz keys', e);
      }

      const effectiveSettings: QuizSettings = settings || {
        difficulty: 'MEDIUM',
        questionCount: 15,
        questionTypes: ['MCQ', 'TRUE_FALSE', 'FILL_BLANK', 'SHORT_ANSWER'],
      };

      return api.quiz.generateQuiz(materialId, effectiveSettings);
    },
  },

  // Export Services (Phase 3)
  export: {
    getExportData: async (materialId: string): Promise<ApiResponse<ExportContent>> => {
      await delay(250);
      const materials = getStoredMaterials();
      const material = materials.find((m) => m.id === materialId);

      const data: ExportContent = {
        ...mockExportData,
        materialTitle: material?.title || mockExportData.materialTitle,
        subject: material?.subject || mockExportData.subject,
      };

      return {
        success: true,
        data,
      };
    },

    generateMarkdownContent: (content: ExportContent): string => {
      const lines: string[] = [];
      lines.push(`# ${content.materialTitle}`);
      lines.push(`**Subject**: ${content.subject} | **Date**: ${content.date}`);
      lines.push('');
      lines.push('---');
      lines.push('');
      lines.push('## 1. Quick Glance Summary');
      lines.push(content.quickGlance);
      lines.push('');
      lines.push('## 2. Key Concepts');
      content.keyConcepts.forEach((c) => lines.push(`- ${c}`));
      lines.push('');
      lines.push('## 3. Deep Summary');
      lines.push(content.deepSummary);
      lines.push('');
      lines.push('## 4. Formulas & Core Rules');
      content.formulas.forEach((f) => {
        lines.push(`### ${f.name}`);
        lines.push(`\`\`\`text\n${f.formula}\n\`\`\``);
        lines.push(`*Explanation*: ${f.explanation}`);
        lines.push('');
      });
      lines.push('## 5. Glossary of Definitions');
      content.glossary.forEach((g) => {
        lines.push(`- **${g.term}**: ${g.definition}`);
      });
      lines.push('');
      lines.push('## 6. Exam Cram Sheet');
      content.examCram.forEach((ec) => lines.push(`- [ ] ${ec}`));
      lines.push('');
      lines.push('---');
      lines.push('*Generated by PreMind AI — Smart Study Material Summarizer*');

      return lines.join('\n');
    },

    downloadMarkdown: async (materialId: string): Promise<ApiResponse<{ filename: string }>> => {
      await delay(350);
      const res = await api.export.getExportData(materialId);
      const md = api.export.generateMarkdownContent(res.data);
      const filename = `${res.data.materialTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_StudyNotes.md`;

      // Trigger actual browser client-side download
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        success: true,
        data: { filename },
        message: `Successfully generated and downloaded ${filename}`,
      };
    },

    downloadPdf: async (materialId: string): Promise<ApiResponse<{ filename: string }>> => {
      await delay(500); // Polished preparation
      const res = await api.export.getExportData(materialId);
      const filename = `${res.data.materialTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_StudyNotes.pdf`;

      // Open clean browser print dialogue that allows "Save as PDF"
      window.print();

      return {
        success: true,
        data: { filename },
        message: 'Printer dialog opened. Choose "Save as PDF" for print-ready layout.',
      };
    },
  },
};


