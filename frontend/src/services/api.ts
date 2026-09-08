import {
  Material,
  ProcessingJob,
  DashboardStats,
  DifficultyLevel,
  User,
  ApiResponse,
} from '../types';
import {
  mockMaterials,
  mockDashboardStats,
  mockUser,
  defaultProcessingSteps,
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
};
