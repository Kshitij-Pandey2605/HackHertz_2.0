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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
