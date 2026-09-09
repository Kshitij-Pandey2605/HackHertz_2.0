import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  BookOpen,
  Layers,
  HelpCircle,
  UploadCloud,
  ArrowRight,
  Clock,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Material, DashboardStats } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { MaterialCard } from '../components/dashboard/MaterialCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, materialsRes] = await Promise.all([
        api.dashboard.getStats(),
        api.materials.getAll(),
      ]);
      setStats(statsRes.data);
      setMaterials(materialsRes.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to load dashboard data.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingState fullPage title="Loading your study workspace..." description="Retrieving your documents, summaries, and cards." />;
  }

  if (error) {
    return <ErrorState fullPage message={error} onRetry={fetchDashboardData} />;
  }

  const formatStudentTitle = (rawTitle: string): string => {
    if (!rawTitle) return 'Study Notes';
    return rawTitle
      .replace(/Database Management Systems/gi, 'DBMS Notes')
      .replace(/Functional Dependencies/gi, 'Normalization Basics')
      .replace(/Operating Systems/gi, 'OS Notes')
      .replace(/Process Synchronization & Deadlocks/gi, 'Process & Deadlocks')
      .replace(/Computer Networks/gi, 'CN Notes');
  };

  const continueMaterial = materials.find((m) => m.status === 'ready') || materials[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink flex items-center gap-2">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            What would you like to study today? Pick up where you left off or start fresh.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/upload')}
          leftIcon={<UploadCloud className="w-4 h-4" />}
          className="shadow-subtle self-start sm:self-auto"
        >
          Upload Notes
        </Button>
      </div>

      {/* 2. PROMINENT "CONTINUE STUDYING" HERO CARD */}
      {continueMaterial && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-800 text-white p-6 sm:p-7 shadow-elevated">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-brand-200" />
                  <span>Next Step: Flashcards</span>
                </span>
                <span className="text-xs text-brand-100 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Last studied {continueMaterial.lastStudied}
                </span>
              </div>

              <div>
                <h2
                  className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug"
                  title={continueMaterial.title}
                >
                  {formatStudentTitle(continueMaterial.title)}
                </h2>
                <p className="text-xs sm:text-sm text-brand-100 mt-1">
                  {continueMaterial.subject} &bull; {continueMaterial.pages} pages &bull; {continueMaterial.difficulty} Level
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-1 max-w-md">
                <div className="flex justify-between text-xs text-brand-100 font-medium">
                  <span>Study Progress: Learn &rarr; Review</span>
                  <span>60%</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: '60%' }} />
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(`/workspace/${continueMaterial.id}/flashcards`)}
              rightIcon={<ArrowRight className="w-4 h-4 text-brand-700" />}
              className="bg-white text-brand-700 hover:bg-brand-50 border-none font-bold text-sm flex-shrink-0 self-start md:self-auto shadow-md"
            >
              Continue Studying
            </Button>
          </div>
        </div>
      )}

      {/* 3. TIME-BASED STUDY SHORTCUTS ("How much time do you have?") */}
      {continueMaterial && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink flex items-center gap-2">
              <span>⏱ How much time do you have?</span>
            </h2>
            <span className="text-xs text-ink-muted">Quick revision shortcuts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 5 min: Exam Cram */}
            <div
              onClick={() => navigate(`/workspace/${continueMaterial.id}/exam-cram`)}
              className="bg-white border border-edge hover:border-brand-400 p-5 rounded-2xl shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    ⚡ 5 mins
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-brand-600 transition-colors" />
                </div>
                <h3 className="text-base font-bold text-ink group-hover:text-brand-600 transition-colors">
                  Exam Cram
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  High-speed key takeaways, memory hooks, and must-know definitions.
                </p>
              </div>
              <p className="text-[11px] font-semibold text-brand-600 pt-3 flex items-center gap-1">
                Fast Revision &rarr;
              </p>
            </div>

            {/* 10 min: Flashcards */}
            <div
              onClick={() => navigate(`/workspace/${continueMaterial.id}/flashcards`)}
              className="bg-white border border-edge hover:border-brand-400 p-5 rounded-2xl shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    🧠 10 mins
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-brand-600 transition-colors" />
                </div>
                <h3 className="text-base font-bold text-ink group-hover:text-brand-600 transition-colors">
                  Flashcards
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Active recall drills to lock core rules and definitions into memory.
                </p>
              </div>
              <p className="text-[11px] font-semibold text-brand-600 pt-3 flex items-center gap-1">
                Practice Recall &rarr;
              </p>
            </div>

            {/* 30 min: Deep Study */}
            <div
              onClick={() => navigate(`/workspace/${continueMaterial.id}/deep-summary`)}
              className="bg-white border border-edge hover:border-brand-400 p-5 rounded-2xl shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    📚 30 mins
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-brand-600 transition-colors" />
                </div>
                <h3 className="text-base font-bold text-ink group-hover:text-brand-600 transition-colors">
                  Deep Study
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Comprehensive chapter-by-chapter breakdowns with examples.
                </p>
              </div>
              <p className="text-[11px] font-semibold text-brand-600 pt-3 flex items-center gap-1">
                Understand Deeply &rarr;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. RECENT STUDY FILES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-ink">Recent Study Files</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Access your summaries, key takeaways, flashcards, and quizzes
            </p>
          </div>
          <span className="text-xs text-ink-muted">
            {materials.length} total file{materials.length === 1 ? '' : 's'}
          </span>
        </div>

        {materials.length === 0 ? (
          <EmptyState
            title="No study files yet"
            description="Upload your lecture notes, slides, or study guides to get instant summaries, flashcards, and quizzes."
            actionLabel="Upload Notes"
            onAction={() => navigate('/upload')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((mat) => (
              <MaterialCard key={mat.id} material={mat} />
            ))}
          </div>
        )}
      </div>

      {/* 5. STUDY ACTIVITY & PROGRESS PREVIEW */}
      <div className="bg-gradient-to-r from-brand-50/70 via-indigo-50/50 to-purple-50/70 border border-brand-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white border border-brand-200 text-brand-600 shadow-xs flex-shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-ink">Your Study Progress</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.2 rounded-full">
                Active Streak: 4 Days
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              4h 35m studied &bull; 86 flashcards reviewed &bull; 7 practice quizzes taken
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/analytics')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-brand-700 bg-white hover:bg-brand-50 border border-brand-200 transition-colors shadow-subtle self-start sm:self-auto"
        >
          <span>View Study Progress</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6. STUDY STATS METRICS */}
      <div className="pt-2 border-t border-edge">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
            Your Study Stats
          </h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Study Files"
            value={stats?.materialsCount ?? 0}
            icon={<FileText className="w-4 h-4" />}
            hint="Uploaded notes & study files"
          />
          <StatCard
            label="Study Summaries"
            value={stats?.summariesCount ?? 0}
            icon={<BookOpen className="w-4 h-4" />}
            hint="Quick & detailed notes"
          />
          <StatCard
            label="Flashcards"
            value={stats?.flashcardsCount ?? 0}
            icon={<Layers className="w-4 h-4" />}
            hint="Interactive study cards"
          />
          <StatCard
            label="Practice Quizzes"
            value={stats?.quizzesCount ?? 0}
            icon={<HelpCircle className="w-4 h-4" />}
            hint="Self-test questions"
          />
        </div>
      </div>
    </div>
  );
};
