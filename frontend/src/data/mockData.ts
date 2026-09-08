import { Material, ProcessingStep, DashboardStats, User } from '../types';

export const mockUser: User = {
  id: 'user_pm_01',
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const mockMaterials: Material[] = [
  {
    id: 'mat_dbms_01',
    title: 'Database Management Systems — Normalization & Functional Dependencies',
    subject: 'Computer Science',
    pages: 48,
    uploadDate: '2026-03-01T10:30:00Z',
    lastStudied: '2 hours ago',
    difficulty: 'MEDIUM',
    status: 'ready',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    originalFilename: 'DBMS_Unit3_Normalization_LectureNotes.pdf',
    summaryCounts: {
      quickGlance: true,
      deepSummary: true,
      examCram: true,
    },
    chapterCount: 5,
    formulaCount: 14,
    glossaryCount: 32,
    flashcardCount: 42,
    quizCount: 25,
  },
  {
    id: 'mat_os_02',
    title: 'Operating Systems — Process Synchronization & Deadlocks',
    subject: 'Computer Science',
    pages: 62,
    uploadDate: '2026-02-28T16:15:00Z',
    lastStudied: 'Yesterday',
    difficulty: 'HARD',
    status: 'ready',
    fileSize: '6.8 MB',
    fileType: 'PPTX',
    originalFilename: 'OS_Module4_Synchronization_Semaphores.pptx',
    summaryCounts: {
      quickGlance: true,
      deepSummary: true,
      examCram: true,
    },
    chapterCount: 6,
    formulaCount: 8,
    glossaryCount: 28,
    flashcardCount: 36,
    quizCount: 20,
  },
  {
    id: 'mat_cn_03',
    title: 'Computer Networks — Transport Layer Protocols (TCP/UDP) & Congestion Control',
    subject: 'Information Technology',
    pages: 35,
    uploadDate: '2026-02-26T09:00:00Z',
    lastStudied: '3 days ago',
    difficulty: 'MEDIUM',
    status: 'ready',
    fileSize: '3.1 MB',
    fileType: 'PDF',
    originalFilename: 'CN_Lecture_12_TransportLayer.pdf',
    summaryCounts: {
      quickGlance: true,
      deepSummary: true,
      examCram: true,
    },
    chapterCount: 4,
    formulaCount: 11,
    glossaryCount: 24,
    flashcardCount: 30,
    quizCount: 15,
  },
];

export const defaultProcessingSteps: ProcessingStep[] = [
  {
    id: 'step_read',
    label: 'Reading your document',
    description: 'Parsing document structure, layout, diagrams, and section metadata',
    status: 'pending',
  },
  {
    id: 'step_extract',
    label: 'Extracting important content',
    description: 'Identifying core principles, key definitions, and hierarchy',
    status: 'pending',
  },
  {
    id: 'step_summarize',
    label: 'Creating summaries',
    description: 'Drafting Quick Glance, Deep Summary, and Exam Cram modules',
    status: 'pending',
  },
  {
    id: 'step_formulas',
    label: 'Extracting formulas',
    description: 'Isolating mathematical proofs, schemas, equations, and rules',
    status: 'pending',
  },
  {
    id: 'step_flashcards',
    label: 'Generating flashcards',
    description: 'Formulating spaced-repetition Q&A cards with difficulty tags',
    status: 'pending',
  },
  {
    id: 'step_quiz',
    label: 'Creating quiz',
    description: 'Constructing conceptual, scenario, and exam-grade assessment questions',
    status: 'pending',
  },
];

export const mockDashboardStats: DashboardStats = {
  materialsCount: 3,
  summariesCount: 9,
  flashcardsCount: 108,
  quizzesCount: 60,
};
