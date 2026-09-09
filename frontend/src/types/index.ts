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
  isDemo?: boolean;
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

export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'SHORT_ANSWER';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  chapter: string;
  difficulty: DifficultyLevel;
  targetSection?: string;
  acceptableAnswers?: string[];
  placeholder?: string;
}

export interface QuizSettings {
  difficulty: DifficultyLevel;
  questionCount: number;
  questionTypes: QuestionType[];
}

export interface QuizSession {
  id: string;
  materialId: string;
  materialTitle: string;
  difficulty: DifficultyLevel;
  questionCount: number;
  questionTypes: QuestionType[];
  questions: QuizQuestion[];
  startedAt: string;
}

export interface GradedQuestion {
  questionId: string;
  question: string;
  type: QuestionType;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  topic: string;
  chapter: string;
  targetSection?: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  materialId: string;
  materialTitle: string;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  score: number;
  percentage: number;
  summaryMessage: string;
  gradedQuestions: GradedQuestion[];
  completedAt: string;
}

export interface ExportContent {
  materialTitle: string;
  subject: string;
  date: string;
  quickGlance: string;
  keyConcepts: string[];
  deepSummary: string;
  formulas: { name: string; formula: string; explanation: string }[];
  glossary: { term: string; definition: string }[];
  examCram: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ==========================================
// Direct Backend API Response Types
// ==========================================

export interface BackendDocument {
  id: string;
  file_name: string;
  file_url: string;
  uploaded_at: string;
}

export interface BackendSummary {
  quickSummary: string;
  detailedSummary: string;
  examNotes: string[];
}

export interface BackendFlashcard {
  id: number | string;
  question: string;
  answer: string;
  topic?: string;
  difficulty?: DifficultyLevel | string;
}

export interface BackendQuizQuestion {
  id: number | string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface BackendQuiz {
  easy: BackendQuizQuestion[];
  medium: BackendQuizQuestion[];
  hard: BackendQuizQuestion[];
}

export interface UploadedDocItem {
  documentId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt?: string;
}

export interface UploadResponse {
  success: boolean;
  documentId: string;
  fileName: string;
  fileUrl: string;
  count?: number;
  documents?: UploadedDocItem[];
}

export interface MultiUploadResponse {
  success: boolean;
  count: number;
  documents: UploadedDocItem[];
  documentId?: string;
  fileName?: string;
  fileUrl?: string;
}

export interface ExtractedSection {
  title: string;
  content: string;
}

export interface ExtractedPage {
  pageNumber: number;
  wordCount: number;
  text: string;
}

export interface ExtractedDocumentResponse {
  success: boolean;
  documentId: string;
  title: string;
  totalPages: number;
  wordCount: number;
  readingTime: string;
  sections: ExtractedSection[];
  pages?: ExtractedPage[];
  metadata?: {
    characterCount?: number;
    readingTimeMinutes?: number;
    author?: string | null;
    producer?: string | null;
    creationDate?: string | null;
  };
}

// ==========================================
// Phase 2 — Differentiator Feature Types
// ==========================================

// --- Weak Topic Detection ---
export type WeakTopicSeverity = 'CRITICAL' | 'MODERATE' | 'WATCH';

export interface WeakTopic {
  id: string;
  topic: string;
  subject: string;
  chapter: string;
  severity: WeakTopicSeverity;
  correctAttempts: number;
  totalAttempts: number;
  accuracyPercent: number;
  lastTestedAt: string;
  relatedSection?: string;
}

export interface WeakTopicsData {
  materialId: string;
  materialTitle: string;
  analyzedAt: string;
  totalTopicsTested: number;
  weakTopics: WeakTopic[];
  recommendedAction: string;
}

// --- Topic Mastery Dashboard & Learning Analytics Engine ---
export type MasteryLevel = 'Expert' | 'Strong' | 'Moderate' | 'Weak' | 'Critical';

export interface RawTopicInput {
  topic: string;
  questionsAttempted: number;
  correctAnswers: number;
  revisionCount: number;
  studyTime: string;
  studyTimeHours?: number;
  previousMastery?: number;
  subject?: string;
}

export interface TopicAnalytics {
  topic: string;
  mastery: number;
  level: MasteryLevel;
  questionsAttempted: number;
  correctAnswers: number;
  accuracy: number;
  studyTime: string;
  revisionCount: number;
  examReadinessContribution: number;
  subject?: string;
}

export interface AnalyticsDashboardOutput {
  overallMastery: number;
  strongestTopic: string;
  weakestTopic: string;
  mostImprovedTopic: string;
  topicsNeedingRevision: string[];
  topics: TopicAnalytics[];
  recommendations: string[];
}

export interface TopicMasteryItem {
  topicId: string;
  topic: string;
  masteryPercent: number;
  questionsAttempted: number;
  lastPracticed: string;
}

export interface SubjectMastery {
  subjectId: string;
  subject: string;
  masteryPercent: number;
  trend: number; // delta % from last week (positive = improved)
  topics: TopicMasteryItem[];
}

export interface MasteryDashboardData {
  materialId: string;
  overallMastery: number;
  lastUpdated: string;
  subjects: SubjectMastery[];
}

// --- Personalized Revision Planner ---
export interface RevisionTopic {
  topicId: string;
  topic: string;
  subject: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedMinutes: number;
}

export interface RevisionDay {
  day: number;
  date: string;
  label: string; // e.g. "Day 1 — Monday"
  topics: RevisionTopic[];
  totalMinutes: number;
  isCompleted: boolean;
}

export interface RevisionPlan {
  materialId: string;
  examDate: string;
  daysUntilExam: number;
  generatedAt: string;
  days: RevisionDay[];
}

// --- Adaptive Quiz Engine ---
export type AdaptiveDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface AdaptiveQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: AdaptiveDifficulty;
}

export interface AdaptiveQuizSession {
  sessionId: string;
  materialId: string;
  currentDifficulty: AdaptiveDifficulty;
  correctStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  questions: AdaptiveQuestion[];
  isCalibrating: boolean;
}

export interface AdaptiveQuizResult {
  sessionId: string;
  finalDifficulty: AdaptiveDifficulty;
  totalAnswered: number;
  totalCorrect: number;
  accuracyPercent: number;
  weakTopicsDetected: string[];
  masteryGained: number;
}

// --- AI Study Coach ---
export interface AICoachSuggestion {
  id: string;
  category: 'FOCUS' | 'QUICK_WIN' | 'LONG_TERM';
  title: string;
  description: string;
  topic?: string;
  estimatedMinutes?: number;
  priority: number;
}

export interface LearningProgressStat {
  label: string;
  value: number | string;
  unit?: string;
  changePercent?: number;
  icon: string;
}

export interface AICoachData {
  materialId: string;
  generatedAt: string;
  studentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  overallScore: number;
  suggestions: AICoachSuggestion[];
  progressStats: LearningProgressStat[];
  studyInsight: string;
}
