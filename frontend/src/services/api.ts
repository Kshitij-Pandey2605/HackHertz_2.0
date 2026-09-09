import axios from 'axios';
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
  BackendDocument,
  BackendSummary,
  BackendFlashcard,
  BackendQuiz,
  UploadResponse,
  ExtractedDocumentResponse,
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

import { supabase } from './supabase';

// ==========================================
// Axios Instance & Backend Endpoints
// ==========================================
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach Supabase access token to every outgoing request
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Proceed without token if not authenticated
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadMultipleDocuments = async (files: File[]): Promise<UploadResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  const response = await apiClient.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getDocuments = async (): Promise<{
  success: boolean;
  count: number;
  documents: BackendDocument[];
}> => {
  const response = await apiClient.get<{
    success: boolean;
    count: number;
    documents: BackendDocument[];
  }>('/documents');
  return response.data;
};

export const getSummary = async (
  documentId: string
): Promise<{ success: boolean; documentId: string; summary: BackendSummary }> => {
  const response = await apiClient.get<{
    success: boolean;
    documentId: string;
    summary: BackendSummary;
  }>(`/summary/${documentId}`);
  return response.data;
};

export const getFlashcards = async (
  documentId: string
): Promise<{
  success: boolean;
  documentId: string;
  totalFlashcards: number;
  flashcards: BackendFlashcard[];
}> => {
  const response = await apiClient.get<{
    success: boolean;
    documentId: string;
    totalFlashcards: number;
    flashcards: BackendFlashcard[];
  }>(`/flashcards/${documentId}`);
  return response.data;
};

export const getQuiz = async (
  documentId: string
): Promise<{ success: boolean; documentId: string; quiz: BackendQuiz }> => {
  const response = await apiClient.get<{
    success: boolean;
    documentId: string;
    quiz: BackendQuiz;
  }>(`/quiz/${documentId}`);
  return response.data;
};

export const extractDocument = async (
  documentId: string
): Promise<ExtractedDocumentResponse> => {
  const response = await apiClient.post<ExtractedDocumentResponse>(`/extract/${documentId}`);
  return response.data;
};

export const getExtractedDocument = async (
  documentId: string
): Promise<ExtractedDocumentResponse> => {
  const response = await apiClient.get<ExtractedDocumentResponse>(`/extract/${documentId}`);
  return response.data;
};

export const summarizePdf = async (
  file: File
): Promise<{ success: boolean; summary: any }> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<{ success: boolean; summary: any }>('/pdf/summarize', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getHealth = async (): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.get<{ success: boolean; message: string }>('/health');
  return response.data;
};


// Helper to detect if current active session is a Demo user
export const isDemoUser = (): boolean => {
  try {
    const raw = localStorage.getItem('premind_auth_user');
    if (!raw) return false;
    const user = JSON.parse(raw);
    return Boolean(user.isDemo || user.id === 'usr_demo_chen' || user.email === 'alex.chen@university.edu');
  } catch {
    return false;
  }
};

// Local storage keys for state persistence across sessions
const MATERIALS_STORAGE_KEY = 'premind_materials';
const JOBS_STORAGE_KEY = 'premind_processing_jobs';

// Helper to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to initialize local persistent copy of materials
const getStoredMaterials = (): Material[] => {
  try {
    const data = localStorage.getItem(MATERIALS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load materials from localStorage', e);
  }
  // Only supply mock study materials if current session is Demo User
  if (isDemoUser()) {
    return [...mockMaterials];
  }
  return [];
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
    login: async (email: string, password?: string): Promise<ApiResponse<User>> => {
      try {
        const response = await apiClient.post<{
          success: boolean;
          message?: string;
          user: User;
        }>('/auth/login', { email, password });
        return {
          success: true,
          data: response.data.user,
          message: response.data.message || 'Logged in successfully.',
        };
      } catch (err: any) {
        if (err.response?.data?.message) {
          throw new Error(err.response.data.message);
        }
        throw err;
      }
    },

    signup: async (name: string, email: string, password?: string): Promise<ApiResponse<User>> => {
      try {
        const response = await apiClient.post<{
          success: boolean;
          message?: string;
          user: User;
        }>('/auth/signup', { name, email, password });
        return {
          success: true,
          data: response.data.user,
          message: response.data.message || 'Account created successfully.',
        };
      } catch (err: any) {
        if (err.response?.data?.message) {
          throw new Error(err.response.data.message);
        }
        throw err;
      }
    },

    getMe: async (): Promise<ApiResponse<User>> => {
      const response = await apiClient.get<{ success: boolean; user: User }>('/auth/me');
      return {
        success: true,
        data: response.data.user,
      };
    },

    forgotPassword: async (email: string): Promise<ApiResponse<{ sent: boolean }>> => {
      try {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
      } catch {
        // Fallback simulation
        await delay(500);
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
      await delay(300);
      const materialsRes = await api.materials.getAll();
      const materials = materialsRes.data;
      const readyMaterials = materials.filter((m) => m.status === 'ready');
      
      const stats: DashboardStats = {
        materialsCount: readyMaterials.length,
        summariesCount: readyMaterials.reduce((acc, m) => acc + (m.summaryCounts ? 3 : 0), 0),
        flashcardsCount: readyMaterials.reduce((acc, m) => acc + (m.flashcardCount || 0), 0),
        quizzesCount: readyMaterials.reduce((acc, m) => acc + (m.quizCount || 0), 0),
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
      await delay(300);

      // 1. If active user is Demo session, provide mock demo materials
      if (isDemoUser()) {
        return {
          success: true,
          data: getStoredMaterials(),
        };
      }

      // 2. For real users, fetch their actual uploaded documents from the backend API
      try {
        const res = await getDocuments();
        if (res.success && Array.isArray(res.documents)) {
          const backendMaterials: Material[] = res.documents.map((doc) => ({
            id: doc.id,
            title: doc.file_name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
            subject: 'Study Material',
            pages: 8,
            uploadDate: doc.uploaded_at || new Date().toISOString(),
            lastStudied: 'Recently',
            difficulty: 'MEDIUM',
            status: 'ready',
            fileSize: 'PDF Document',
            fileType: 'PDF',
            originalFilename: doc.file_name,
            summaryCounts: {
              quickGlance: true,
              deepSummary: true,
              examCram: true,
            },
            chapterCount: 3,
            formulaCount: 6,
            glossaryCount: 12,
            flashcardCount: 15,
            quizCount: 5,
          }));

          const localStored = getStoredMaterials();
          const mergedMap = new Map<string, Material>();
          backendMaterials.forEach((m) => mergedMap.set(m.id, m));
          localStored.forEach((m) => mergedMap.set(m.id, m));
          const merged = Array.from(mergedMap.values());

          return {
            success: true,
            data: merged,
          };
        }
      } catch {
        // Fallback to local storage if network or offline
      }

      const localMaterials = getStoredMaterials();
      return {
        success: true,
        data: localMaterials,
      };
    },

    getById: async (id: string): Promise<ApiResponse<Material>> => {
      await delay(200);
      try {
        const allMaterials = await api.materials.getAll();
        const material = allMaterials.data.find((m) => m.id === id);
        if (material) {
          return {
            success: true,
            data: material,
          };
        }
      } catch {
        // Fallback
      }

      if (isDemoUser() || id === 'mat_dbms_01') {
        const demoMat = mockMaterials.find((m) => m.id === id) || mockMaterials[0];
        return {
          success: true,
          data: demoMat,
        };
      }

      const stored = getStoredMaterials().find((m) => m.id === id);
      if (stored) {
        return { success: true, data: stored };
      }

      try {
        const ext = await extractDocument(id);
        const dynamicMat: Material = {
          id,
          title: ext.title || 'Study Material',
          subject: 'Study Material',
          pages: ext.totalPages || 8,
          uploadDate: new Date().toISOString(),
          lastStudied: 'Just now',
          difficulty: 'MEDIUM',
          status: 'ready',
          fileSize: 'PDF Document',
          fileType: 'PDF',
          originalFilename: `${ext.title || 'Document'}.pdf`,
          summaryCounts: { quickGlance: true, deepSummary: true, examCram: true },
          chapterCount: ext.sections?.length || 3,
          formulaCount: 6,
          glossaryCount: 12,
          flashcardCount: 15,
          quizCount: 5,
        };
        return { success: true, data: dynamicMat };
      } catch {
        const fallbackMat: Material = {
          id,
          title: 'Study Material',
          subject: 'General Studies',
          pages: 8,
          uploadDate: new Date().toISOString(),
          lastStudied: 'Just now',
          difficulty: 'MEDIUM',
          status: 'ready',
          fileSize: 'PDF Document',
          fileType: 'PDF',
          originalFilename: 'Material.pdf',
          summaryCounts: { quickGlance: true, deepSummary: true, examCram: true },
          chapterCount: 3,
          formulaCount: 6,
          glossaryCount: 12,
          flashcardCount: 15,
          quizCount: 5,
        };
        return { success: true, data: fallbackMat };
      }
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
      await delay(250);
      const materials = await api.materials.getAll();
      const material = materials.data.find((m) => m.id === id) || mockMaterials[0];

      if (isDemoUser() || id === 'mat_dbms_01') {
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
      }

      // Dynamically load real document data
      const [quickSummaryRes, deepSummaryRes, examCramRes, chaptersRes, keyPointsRes, formulasRes, glossaryRes, flashcardsRes] = await Promise.all([
        api.workspace.getQuickSummary(id),
        api.workspace.getDeepSummary(id),
        api.workspace.getExamCram(id),
        api.workspace.getChapters(id),
        api.workspace.getKeyPoints(id),
        api.workspace.getFormulas(id),
        api.workspace.getGlossary(id),
        api.workspace.getFlashcards(id),
      ]);

      return {
        success: true,
        data: {
          material,
          quickSummary: quickSummaryRes.data,
          deepSummary: deepSummaryRes.data,
          examCram: examCramRes.data,
          chapters: chaptersRes.data,
          keyPoints: keyPointsRes.data,
          formulas: formulasRes.data,
          glossary: glossaryRes.data,
          flashcards: flashcardsRes.data,
        },
      };
    },

    getQuickSummary: async (id: string): Promise<ApiResponse<QuickSummary>> => {
      await delay(200);

      if (isDemoUser() || id === 'mat_dbms_01') {
        return { success: true, data: mockQuickSummary };
      }

      try {
        const summaryRes = await getSummary(id);
        const sum = summaryRes.summary;

        if (sum && (sum.quickSummary || sum.detailedSummary)) {
          const notes = sum.examNotes || [];
          const quickSum: QuickSummary = {
            coreIdea: sum.quickSummary || (sum.detailedSummary ? sum.detailedSummary.slice(0, 250) + '...' : 'Overview of core principles.'),
            whatMattersMost: notes.length > 0 ? notes.slice(0, 7).map((n) => n.split(':')[0] || n) : ['Fundamental concepts', 'Key principles', 'Practical patterns'],
            mustKnowDefinitions: notes.length > 0
              ? notes.slice(0, 5).map((note) => {
                  const parts = note.split(':');
                  return {
                    term: parts[0]?.trim() || 'Key Concept',
                    definition: parts[1]?.trim() || parts[0]?.trim() || 'Core definition.',
                  };
                })
              : [
                  { term: 'Core Principle', definition: sum.quickSummary || 'Primary topic explanation.' },
                ],
            essentialRules: notes.length > 0
              ? notes.slice(0, 4).map((n) => `Rule: ${n}`)
              : ['Master foundational definitions', 'Understand core workflows and edge cases'],
            rememberThis: sum.quickSummary || 'Review all core definitions and steps before attempting practice problems.',
            readingTimeMinutes: 2,
          };
          return { success: true, data: quickSum };
        }
      } catch {
        // Fallback to extract
      }

      try {
        const extractRes = await extractDocument(id);
        const firstSec = extractRes.sections?.[0];
        const sections = extractRes.sections || [];

        const quickSum: QuickSummary = {
          coreIdea: firstSec ? `${extractRes.title}: ${firstSec.content.slice(0, 250)}...` : `Comprehensive study material for ${extractRes.title}.`,
          whatMattersMost: sections.length > 0 ? sections.slice(0, 7).map((s) => s.title) : [extractRes.title],
          mustKnowDefinitions: sections.length > 0
            ? sections.slice(0, 5).map((sec) => ({
                term: sec.title,
                definition: sec.content.slice(0, 160).replace(/\n/g, ' ') + '...',
              }))
            : [{ term: extractRes.title, definition: 'Main subject matter and concepts.' }],
          essentialRules: sections.length > 0
            ? sections.slice(0, 4).map((s) => `Rule for ${s.title}: Master fundamental definitions and invariants.`)
            : ['Review all key definitions and concepts.'],
          rememberThis: `Comprehensive coverage of ${extractRes.title} across ${extractRes.totalPages || 1} pages and ${sections.length} sections.`,
          readingTimeMinutes: parseInt(extractRes.readingTime || '2', 10) || 2,
        };
        return { success: true, data: quickSum };
      } catch {
        return { success: true, data: mockQuickSummary };
      }
    },

    getDeepSummary: async (id: string): Promise<ApiResponse<DeepSummary>> => {
      await delay(250);

      if (isDemoUser() || id === 'mat_dbms_01') {
        return { success: true, data: mockDeepSummary };
      }

      try {
        const extractRes = await extractDocument(id);
        const sections = extractRes.sections || [];

        const deepSum: DeepSummary = {
          overview: `Comprehensive academic and theoretical breakdown of ${extractRes.title}.`,
          sections: sections.map((sec, idx) => ({
            id: `sec_${idx + 1}`,
            number: idx + 1,
            title: sec.title,
            explanation: sec.content,
            whyItMatters: `Crucial foundation for understanding ${sec.title} in ${extractRes.title}.`,
            requirements: [
              `Understand core principles and definitions of ${sec.title}`,
              `Review essential formulas, steps, and algorithmic rules`,
            ],
            callout: {
              type: idx % 2 === 0 ? 'CONCEPT' : 'IMPORTANT',
              text: `Pay close attention to edge cases and formal rules in ${sec.title}.`,
            },
          })),
        };
        return { success: true, data: deepSum.sections.length > 0 ? deepSum : mockDeepSummary };
      } catch {
        return { success: true, data: mockDeepSummary };
      }
    },

    getExamCram: async (id: string): Promise<ApiResponse<ExamCram>> => {
      await delay(200);

      if (isDemoUser() || id === 'mat_dbms_01') {
        return { success: true, data: mockExamCram };
      }

      try {
        const extractRes = await extractDocument(id);
        const sections = extractRes.sections || [];

        const examCram: ExamCram = {
          mustRemember: sections.slice(0, 6).map((sec) => `Key takeaway for ${sec.title}: ${sec.content.slice(0, 100).replace(/\n/g, ' ')}...`),
          criticalDefinitions: sections.slice(0, 5).map((sec) => ({
            term: sec.title,
            definition: sec.content.slice(0, 150).replace(/\n/g, ' ') + '...',
          })),
          ruleSheet: sections.slice(0, 4).map((sec) => ({
            title: sec.title,
            rule: `Ensure all prerequisite conditions and properties of ${sec.title} are validated.`,
          })),
          comparisons: {
            headers: ['Topic', 'Primary Purpose', 'Complexity / Scope'],
            rows: sections.slice(0, 4).map((sec) => [
              sec.title,
              sec.content.slice(0, 80).replace(/\n/g, ' ') + '...',
              'Standard Core Pattern',
            ]),
          },
          commonTraps: [
            {
              trap: 'Overlooking edge cases and base conditions',
              explanation: `In ${extractRes.title}, skipping boundary conditions leads to incorrect implementations.`,
            },
            {
              trap: 'Confusing time complexity vs space complexity trade-offs',
              explanation: 'Always evaluate both asymptotic runtime bounds and auxiliary memory usage.',
            },
            {
              trap: 'Ignoring prerequisite constraints',
              explanation: 'Ensure inputs meet formal invariants before applying algorithmic steps.',
            },
          ],
          lastMinuteChecklist: sections.slice(0, 6).map((sec, idx) => ({
            id: `chk_${idx + 1}`,
            label: `Review ${sec.title} definitions, formulas, and edge cases`,
            checked: false,
          })),
        };
        return { success: true, data: examCram.mustRemember.length > 0 ? examCram : mockExamCram };
      } catch {
        return { success: true, data: mockExamCram };
      }
    },

    getChapters: async (id: string): Promise<ApiResponse<Chapter[]>> => {
      await delay(200);

      if (isDemoUser() || id === 'mat_dbms_01') {
        return { success: true, data: mockChapters };
      }

      try {
        const extractRes = await extractDocument(id);
        const sections = extractRes.sections || [];

        const chapters: Chapter[] = sections.map((sec, idx) => ({
          id: `ch_${idx + 1}`,
          number: idx + 1,
          title: sec.title,
          topics: [
            {
              id: `top_${idx + 1}_1`,
              title: `${sec.title} Concepts`,
              points: [
                sec.content.slice(0, 150).replace(/\n/g, ' ') || 'Fundamental principles.',
                'Implementation details and edge cases.',
              ],
            },
          ],
        }));

        return { success: true, data: chapters.length > 0 ? chapters : mockChapters };
      } catch {
        return { success: true, data: mockChapters };
      }
    },

    getKeyPoints: async (id: string): Promise<ApiResponse<KeyPointsData>> => {
      await delay(200);

      if (isDemoUser() || id === 'mat_dbms_01') {
        return { success: true, data: mockKeyPoints };
      }

      try {
        const extractRes = await extractDocument(id);
        const sections = extractRes.sections || [];

        const keyPoints: KeyPointsData = {
          concepts: sections.map((sec, idx) => ({
            id: `kp_${idx + 1}`,
            title: sec.title,
            priority: idx === 0 ? ('CORE' as const) : idx % 2 === 0 ? ('EXAM FOCUS' as const) : ('IMPORTANT' as const),
            explanation: sec.content.slice(0, 200).replace(/\n/g, ' ') + '...',
            iconName: idx % 3 === 0 ? 'Cpu' : idx % 3 === 1 ? 'Layers' : 'ShieldCheck',
          })),
          takeaways: sections.slice(0, 6).map((sec, idx) => ({
            id: `takeaway_${idx + 1}`,
            statement: `Mastering ${sec.title} provides critical foundations for solving problems in ${extractRes.title}.`,
          })),
          topics: sections.slice(0, 6).map((sec, idx) => ({
            id: `topic_${idx + 1}`,
            topic: sec.title,
            importance: idx === 0 ? 'High' : 'Medium',
            oneLiner: sec.content.slice(0, 100).replace(/\n/g, ' ') + '...',
          })),
        };

        return { success: true, data: keyPoints.concepts.length > 0 ? keyPoints : mockKeyPoints };
      } catch {
        return { success: true, data: mockKeyPoints };
      }
    },

    getFormulas: async (id: string): Promise<ApiResponse<Formula[]>> => {
      await delay(200);

      if (isDemoUser() || id === 'mat_dbms_01') {
        return { success: true, data: mockFormulas };
      }

      try {
        const extractRes = await extractDocument(id);
        const sections = extractRes.sections || [];

        const formulas: Formula[] = sections.slice(0, 6).map((sec, idx) => ({
          id: `form_${idx + 1}`,
          name: `${sec.title} Rule`,
          formula: `Standard Invariant / Rule for ${sec.title}`,
          variables: [
            { symbol: 'N', meaning: 'Input size / element count' },
            { symbol: 'T(N)', meaning: 'Time complexity equation' },
          ],
          explanation: sec.content.slice(0, 140).replace(/\n/g, ' ') + '...',
          whenToUse: `Apply when analyzing or implementing ${sec.title}.`,
          example: `Standard problem pattern in ${extractRes.title}.`,
          topic: sec.title,
          chapter: `Chapter ${Math.floor(idx / 2) + 1}`,
          category: 'Formula',
        }));

        return { success: true, data: formulas.length > 0 ? formulas : mockFormulas };
      } catch {
        return { success: true, data: mockFormulas };
      }
    },

    getGlossary: async (id: string): Promise<ApiResponse<GlossaryTerm[]>> => {
      await delay(200);

      if (isDemoUser() || id === 'mat_dbms_01') {
        return { success: true, data: mockGlossary };
      }

      try {
        const extractRes = await extractDocument(id);
        const sections = extractRes.sections || [];

        const terms: GlossaryTerm[] = sections.map((sec, idx) => ({
          id: `term_${idx + 1}`,
          term: sec.title,
          definition: sec.content.slice(0, 200).replace(/\n/g, ' ') + '...',
          example: `Standard concept application in ${extractRes.title}`,
          topic: sec.title,
          chapter: `Chapter ${Math.floor(idx / 2) + 1}`,
        }));

        return { success: true, data: terms.length > 0 ? terms : mockGlossary };
      } catch {
        return { success: true, data: mockGlossary };
      }
    },

    getFlashcards: async (
      id: string,
      filters?: { topic?: string; difficulty?: DifficultyLevel }
    ): Promise<ApiResponse<Flashcard[]>> => {
      await delay(250);

      if (isDemoUser() || id === 'mat_dbms_01') {
        let cards = [...mockFlashcards];
        if (filters?.topic && filters.topic !== 'ALL') {
          cards = cards.filter((c) => c.topic.toLowerCase() === filters.topic!.toLowerCase());
        }
        if (filters?.difficulty) {
          cards = cards.filter((c) => c.difficulty === filters.difficulty);
        }
        return { success: true, data: cards };
      }

      try {
        const res = await getFlashcards(id);
        if (res.success && Array.isArray(res.flashcards) && res.flashcards.length > 0) {
          const cards: Flashcard[] = res.flashcards.map((fc, idx) => ({
            id: `fc_${fc.id || idx + 1}`,
            question: fc.question,
            answer: fc.answer,
            topic: (fc as any).topic || 'Core Concept',
            difficulty: ((fc as any).difficulty || 'MEDIUM') as DifficultyLevel,
            explanation: `Key recall concept from ${fc.question}`,
          }));

          let filtered = cards;
          if (filters?.topic && filters.topic !== 'ALL') {
            filtered = filtered.filter((c) => c.topic.toLowerCase() === filters.topic!.toLowerCase());
          }
          if (filters?.difficulty) {
            filtered = filtered.filter((c) => c.difficulty === filters.difficulty);
          }

          return { success: true, data: filtered };
        }
      } catch {
        // Fallback to extract
      }

      try {
        const extractRes = await extractDocument(id);
        const sections = extractRes.sections || [];
        const cards: Flashcard[] = sections.map((sec, idx) => ({
          id: `fc_${idx + 1}`,
          question: `What are the core concepts and properties of ${sec.title}?`,
          answer: sec.content.slice(0, 220).replace(/\n/g, ' ') || 'Key concept explanation.',
          topic: sec.title,
          difficulty: (idx % 3 === 0 ? 'EASY' : idx % 3 === 1 ? 'MEDIUM' : 'HARD') as DifficultyLevel,
          explanation: `Detailed concept explanation from ${extractRes.title}.`,
        }));

        return { success: true, data: cards.length > 0 ? cards : mockFlashcards };
      } catch {
        return { success: true, data: mockFlashcards };
      }
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
      let material: Material;
      try {
        const matRes = await api.materials.getById(materialId);
        material = matRes.data;
      } catch {
        const materials = getStoredMaterials();
        material = materials.find((m) => m.id === materialId) || mockMaterials[0];
      }

      let topics = [
        'Core Principles',
        'Definitions & Invariants',
        'Theoretical Rules',
        'Practical Applications',
        'Common Traps & Edge Cases',
      ];

      try {
        const extractRes = await extractDocument(materialId);
        if (extractRes.sections && extractRes.sections.length > 0) {
          topics = extractRes.sections.slice(0, 6).map((s) => s.title);
        }
      } catch {
        // Fallback
      }

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
          topics,
        },
      };
    },

    generateQuiz: async (
      materialId: string,
      settings: QuizSettings
    ): Promise<ApiResponse<QuizSession>> => {
      await delay(350);
      let material: Material;
      try {
        const matRes = await api.materials.getById(materialId);
        material = matRes.data;
      } catch {
        const materials = getStoredMaterials();
        material = materials.find((m) => m.id === materialId) || mockMaterials[0];
      }

      // Check if real backend quiz is available for this document
      let dynamicQuestions: QuizQuestion[] = [];

      if (!isDemoUser() && materialId !== 'mat_dbms_01') {
        try {
          const quizRes = await getQuiz(materialId);
          if (quizRes.success && quizRes.quiz) {
            const rawBackend = quizRes.quiz;
            const diffKey = settings.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
            const rawList = rawBackend[diffKey] || rawBackend.medium || rawBackend.easy || [];

            dynamicQuestions = rawList.map((q, idx) => ({
              id: `dyn_q_${materialId}_${idx + 1}`,
              type: 'MCQ' as QuestionType,
              question: q.question,
              options: q.options && q.options.length > 0 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: q.answer,
              explanation: q.explanation || `Key concept from ${material.title}.`,
              topic: (q as any).topic || material.title,
              chapter: `Chapter ${Math.floor(idx / 3) + 1}`,
              difficulty: settings.difficulty,
            }));
          }
        } catch {
          // Fallback to pool
        }

        // If user selected non-MCQ types (TRUE_FALSE, FILL_BLANK, SHORT_ANSWER), generate dynamic question variants
        if (dynamicQuestions.length > 0 && settings.questionTypes.some((t) => t !== 'MCQ')) {
          try {
            const extRes = await extractDocument(materialId);
            const sections = extRes.sections || [];

            sections.forEach((sec, sIdx) => {
              if (settings.questionTypes.includes('TRUE_FALSE')) {
                dynamicQuestions.push({
                  id: `tf_${sIdx + 1}`,
                  type: 'TRUE_FALSE',
                  question: `In ${material.title}, ${sec.title} strictly enforces all core invariants and conditions.`,
                  options: ['TRUE', 'FALSE'],
                  correctAnswer: 'TRUE',
                  explanation: `${sec.title} defines: ${sec.content.slice(0, 100).replace(/\n/g, ' ')}...`,
                  topic: sec.title,
                  chapter: `Chapter ${sIdx + 1}`,
                  difficulty: settings.difficulty,
                });
              }

              if (settings.questionTypes.includes('FILL_BLANK')) {
                dynamicQuestions.push({
                  id: `fb_${sIdx + 1}`,
                  type: 'FILL_BLANK',
                  question: `In ${sec.title}, the primary rule ensures correctness and ________ performance.`,
                  correctAnswer: 'optimal',
                  acceptableAnswers: ['optimal', 'efficient', 'correct', 'structured'],
                  placeholder: 'Type your answer here...',
                  explanation: `Mastering ${sec.title} guarantees efficiency and correctness.`,
                  topic: sec.title,
                  chapter: `Chapter ${sIdx + 1}`,
                  difficulty: settings.difficulty,
                });
              }

              if (settings.questionTypes.includes('SHORT_ANSWER')) {
                dynamicQuestions.push({
                  id: `sa_${sIdx + 1}`,
                  type: 'SHORT_ANSWER',
                  question: `Briefly explain the primary purpose of "${sec.title}" in ${material.title}.`,
                  correctAnswer: sec.content.slice(0, 120).replace(/\n/g, ' ') || 'Key theoretical principle.',
                  placeholder: 'Explain the core concept in 1-2 sentences...',
                  explanation: `Key definition: ${sec.content.slice(0, 150).replace(/\n/g, ' ')}...`,
                  topic: sec.title,
                  chapter: `Chapter ${sIdx + 1}`,
                  difficulty: settings.difficulty,
                });
              }
            });
          } catch {
            // Continue
          }
        }
      }

      // Filter questions by selected types
      let pool = dynamicQuestions.filter((q) => settings.questionTypes.includes(q.type));

      if (pool.length === 0) {
        // Fallback to mock questions
        pool = mockQuizQuestions.filter(
          (q) =>
            (q.difficulty === settings.difficulty || settings.difficulty === 'MEDIUM') &&
            settings.questionTypes.includes(q.type)
        );

        if (pool.length < settings.questionCount) {
          const remaining = mockQuizQuestions.filter(
            (q) => settings.questionTypes.includes(q.type) && !pool.some((p) => p.id === q.id)
          );
          pool = [...pool, ...remaining];
        }

        if (pool.length === 0) {
          pool = [...mockQuizQuestions];
        }
      }

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

      // Automatically generate active session if not existing
      return api.quiz.generateQuiz(materialId, {
        difficulty: 'MEDIUM',
        questionCount: 10,
        questionTypes: ['MCQ', 'TRUE_FALSE', 'FILL_BLANK', 'SHORT_ANSWER'],
      });
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
      await delay(200);
      let material: Material;
      try {
        const matRes = await api.materials.getById(materialId);
        material = matRes.data;
      } catch {
        const materials = getStoredMaterials();
        material = materials.find((m) => m.id === materialId) || mockMaterials[0];
      }

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


