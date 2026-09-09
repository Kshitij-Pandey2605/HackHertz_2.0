// ==========================================
// Phase 4: AI Study Copilot & Analytics Types
// ==========================================

export type CopilotActionType =
  | 'make_flashcard'
  | 'quiz_me'
  | 'explain_simpler'
  | 'show_topic'
  | 'navigate';

export interface CopilotAction {
  label: string;
  actionType: CopilotActionType;
  targetUrl?: string;
  data?: Record<string, unknown>;
}

export interface CopilotMessage {
  id: string;
  sender: 'student' | 'copilot';
  content: string;
  timestamp: string;
  contextModule?: string;
  actions?: CopilotAction[];
}

export interface CopilotContext {
  materialId?: string;
  materialTitle?: string;
  moduleName?: string;
  currentTopic?: string;
  recentQuestion?: string;
}

export interface CopilotChatRequest {
  message: string;
  context: CopilotContext;
  conversationHistory?: {
    sender: 'student' | 'copilot';
    content: string;
  }[];
}

export type AnalyticsPeriodType = '7d' | '30d' | 'all';

export interface DailyActivityItem {
  day: string;
  minutes: number;
  sessions: number;
  date: string;
}

export interface QuizPerformanceStats {
  averageScore: number;
  quizzesCompleted: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
  byDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface StudyBreakdownItem {
  module: string;
  count: number;
  timeSpentMinutes: number;
  percentage: number;
  color: string;
}

export interface RecentActivityItem {
  id: string;
  type: 'flashcards' | 'quiz' | 'deep_summary' | 'exam_cram' | 'upload';
  title: string;
  subject: string;
  timestamp: string;
  score?: string;
  cardsReviewed?: number;
  materialId?: string;
  targetUrl?: string;
  periodGroup: 'Today' | 'Yesterday' | 'This Week' | 'Earlier';
}

export interface SubjectActivityItem {
  subject: string;
  materialsCount: number;
  hoursSpent: number;
  progressPercent: number;
  color: string;
}

export interface AnalyticsSummary {
  period: AnalyticsPeriodType;
  studySessions: number;
  studyTimeFormatted: string;
  studyTimeMinutes: number;
  flashcardsReviewed: number;
  quizzesCompleted: number;
  dailyActivity: DailyActivityItem[];
  quizPerformance: QuizPerformanceStats;
  studyBreakdown: StudyBreakdownItem[];
  recentActivity: RecentActivityItem[];
  subjectActivity: SubjectActivityItem[];
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

/* KEEP ALL THE REMAINING PHASE-2 TYPES
   (MasteryDashboardData, RevisionPlan,
   AdaptiveQuizSession, AICoachData, etc.) */