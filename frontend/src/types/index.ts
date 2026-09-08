export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type MaterialStatus = 'processing' | 'ready' | 'failed';

export interface Material {
  id: string;
  title: string;
  subject: string;
  pages: number;
  uploadDate: string;
  lastStudied: string;
  difficulty: DifficultyLevel;
  status: MaterialStatus;
  fileSize: string;
  fileType: string;
  originalFilename: string;
  summaryCounts: {
    quickGlance: boolean;
    deepSummary: boolean;
    examCram: boolean;
  };
  chapterCount: number;
  formulaCount: number;
  glossaryCount: number;
  flashcardCount: number;
  quizCount: number;
}

export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface ProcessingStep {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
}

export interface ProcessingJob {
  id: string;
  materialId: string;
  fileName: string;
  pageCount?: number;
  difficulty: DifficultyLevel;
  progress: number;
  currentStepIndex: number;
  steps: ProcessingStep[];
  status: 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DashboardStats {
  materialsCount: number;
  summariesCount: number;
  flashcardsCount: number;
  quizzesCount: number;
}

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  to: string;
  isAvailable: boolean;
  badge?: string;
}

export interface QuickSummary {
  coreIdea: string;
  whatMattersMost: string[];
  mustKnowDefinitions: { term: string; definition: string }[];
  essentialRules: string[];
  rememberThis: string;
  readingTimeMinutes: number;
}

export interface DeepSummarySection {
  id: string;
  number: number;
  title: string;
  explanation: string;
  example?: {
    title: string;
    codeOrText: string;
  };
  whyItMatters?: string;
  requirements?: string[];
  keyDifferences?: string;
  callout?: {
    type: 'DEFINITION' | 'CONCEPT' | 'EXAMPLE' | 'IMPORTANT' | 'EXAM NOTE';
    text: string;
  };
}

export interface DeepSummary {
  overview: string;
  sections: DeepSummarySection[];
}

export interface ExamCram {
  mustRemember: string[];
  criticalDefinitions: { term: string; definition: string }[];
  ruleSheet: { title: string; rule: string }[];
  comparisons: {
    headers: string[];
    rows: string[][];
  };
  commonTraps: { trap: string; explanation: string }[];
  lastMinuteChecklist: { id: string; label: string; checked?: boolean }[];
}

export interface ChapterTopic {
  id: string;
  title: string;
  points: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  topics: ChapterTopic[];
}

export interface KeyPointConcept {
  id: string;
  title: string;
  priority: 'CORE' | 'IMPORTANT' | 'EXAM FOCUS';
  explanation: string;
  iconName?: string;
}

export interface KeyPointTakeaway {
  id: string;
  statement: string;
}

export interface KeyPointTopic {
  id: string;
  topic: string;
  importance: string;
  oneLiner: string;
}

export interface KeyPointsData {
  concepts: KeyPointConcept[];
  takeaways: KeyPointTakeaway[];
  topics: KeyPointTopic[];
}

export interface Formula {
  id: string;
  name: string;
  formula: string;
  variables: { symbol: string; meaning: string }[];
  explanation: string;
  topic: string;
  chapter: string;
  category: 'Normalization Rules' | 'Formula' | 'Proof';
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  example?: string;
  topic: string;
  chapter: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topic: string;
  difficulty: DifficultyLevel;
  explanation?: string;
}

export interface FlashcardFeedback {
  flashcardId: string;
  rating: 'AGAIN' | 'GOOD' | 'EASY';
}

export interface StudyWorkspace {
  material: Material;
  quickSummary: QuickSummary;
  deepSummary: DeepSummary;
  examCram: ExamCram;
  chapters: Chapter[];
  keyPoints: KeyPointsData;
  formulas: Formula[];
  glossary: GlossaryTerm[];
  flashcards: Flashcard[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

