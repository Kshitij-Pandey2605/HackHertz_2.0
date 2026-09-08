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

  // Continue studying hero item (first ready material)
  const continueMaterial = materials.find((m) => m.status === 'ready') || materials[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink flex items-center gap-2">
            Welcome back {user?.name ? `${user.name.split(' ')[0]} ` : ''}👋
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Ready to turn your study material into exam-ready knowledge?
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/upload')}
          leftIcon={<UploadCloud className="w-4 h-4" />}
          className="shadow-subtle self-start sm:self-auto"
        >
          Upload New Material
        </Button>
      </div>

      {/* 2. PROMINENT CONTINUE STUDYING HERO BANNER */}
      {continueMaterial && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900 via-brand-800 to-violet-950 text-white p-6 sm:p-7 shadow-elevated">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-semibold mb-3 border border-white/10">
                <Clock className="w-3 h-3" />
                <span>Continue Studying &bull; Last opened {continueMaterial.lastStudied}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                {continueMaterial.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-brand-200">
                <span>{continueMaterial.subject}</span>
                <span>&bull;</span>
                <span>{continueMaterial.pages} pages</span>
                <span>&bull;</span>
                <span className="bg-brand-700/80 px-2 py-0.5 rounded text-white font-medium">
                  {continueMaterial.difficulty} Level
                </span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(`/workspace/${continueMaterial.id}`)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-white text-brand-900 hover:bg-brand-50 border-none font-bold flex-shrink-0 self-start md:self-auto shadow-subtle"
            >
              Resume Workspace
            </Button>
          </div>
        </div>
      )}

      {/* 3. STUDY OVERVIEW (Simple statistics - No complex gamification) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
            Study Overview
          </h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Study Materials"
            value={stats?.materialsCount ?? 0}
            icon={<FileText className="w-4 h-4" />}
            hint="Active textbooks & slide decks"
          />
          <StatCard
            label="Structured Summaries"
            value={stats?.summariesCount ?? 0}
            icon={<BookOpen className="w-4 h-4" />}
            hint="Glance, Deep & Cram sheets"
          />
          <StatCard
            label="Flashcards Extracted"
            value={stats?.flashcardsCount ?? 0}
            icon={<Layers className="w-4 h-4" />}
            hint="Active recall Q&A items"
          />
          <StatCard
            label="Quiz Questions"
            value={stats?.quizzesCount ?? 0}
            icon={<HelpCircle className="w-4 h-4" />}
            hint="Diagnostic examination questions"
          />
        </div>
      </div>

      {/* 4. QUICK ACTIONS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
            Quick Actions
          </h3>
        </div>
        <QuickActions latestMaterialId={continueMaterial?.id} />
      </div>

      {/* 5. RECENT MATERIALS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-ink">Recent Study Materials</h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Access your parsed syllabi, formulas, and flashcard modules
            </p>
          </div>
          <span className="text-xs text-ink-muted">
            {materials.length} total document{materials.length === 1 ? '' : 's'}
          </span>
        </div>

        {materials.length === 0 ? (
          <EmptyState
            title="No study materials yet"
            description="Upload your first textbook chapter, lecture slides, or lecture notes to generate instant summaries, formulas, and quizzes."
            actionLabel="Upload Material"
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
    </div>
  );
};
