import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  Clock,
  Layers,
  HelpCircle,
  BookOpen,
  Sparkles,
  ArrowRight,
  UploadCloud,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { AnalyticsSummary, AnalyticsPeriodType } from '../types';
import { AnalyticsStatCard } from '../components/analytics/AnalyticsStatCard';
import { ActivityChart } from '../components/analytics/ActivityChart';
import { QuizPerformance } from '../components/analytics/QuizPerformance';
import { StudyBreakdown } from '../components/analytics/StudyBreakdown';
import { RecentActivity } from '../components/analytics/RecentActivity';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<AnalyticsPeriodType>('7d');
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (selectedPeriod: AnalyticsPeriodType) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.analytics.getAnalytics(selectedPeriod);
      if (res.data) {
        setAnalytics(res.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load study activity.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const periods: { id: AnalyticsPeriodType; label: string }[] = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: 'all', label: 'All Time' },
  ];

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-12">
        <ErrorState
          title="We couldn't load your study activity"
          message={error}
          onRetry={() => fetchAnalytics(period)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* 1. HEADER WITH PERIOD SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-brand-600" />
            <span>Learning Analytics &bull; Study Story</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Your Study Activity
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            See your learning consistency, time spent, and quiz performance across PreMind.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-edge rounded-2xl shadow-subtle self-start sm:self-auto">
          {periods.map((p) => {
            const isActive = period === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-ink-secondary hover:text-ink hover:bg-gray-100'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        /* Polished Skeleton Loaders */
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-200/80 rounded-2xl" />
            ))}
          </div>
          <div className="h-64 bg-gray-200/80 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200/80 rounded-2xl" />
            <div className="h-64 bg-gray-200/80 rounded-2xl" />
          </div>
        </div>
      ) : !analytics ? (
        /* Empty State */
        <div className="my-12">
          <EmptyState
            title="Your study story starts here"
            description="Complete your first study session or review flashcards, and your activity will appear here."
            actionLabel="Upload Material"
            onAction={() => navigate('/upload')}
          />
        </div>
      ) : (
        /* Loaded Content */
        <div className="space-y-8 animate-fadeIn">
          {/* 2. TOP STAT CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <AnalyticsStatCard
              title="Study Sessions"
              value={analytics.studySessions}
              subtitle="Logged learning blocks"
              icon={<Calendar className="w-5 h-5" />}
              iconBgColor="bg-blue-50 text-blue-600 border-blue-100"
              badge="+18%"
              badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
            />

            <AnalyticsStatCard
              title="Total Study Time"
              value={analytics.studyTimeFormatted}
              subtitle="Active revision duration"
              icon={<Clock className="w-5 h-5" />}
              iconBgColor="bg-indigo-50 text-indigo-600 border-indigo-100"
              badge="High Focus"
              badgeColor="bg-indigo-50 text-indigo-700 border-indigo-200"
            />

            <AnalyticsStatCard
              title="Flashcards Reviewed"
              value={analytics.flashcardsReviewed}
              subtitle="Active recall cards flipped"
              icon={<Layers className="w-5 h-5" />}
              iconBgColor="bg-purple-50 text-purple-600 border-purple-100"
              badge="Retention"
              badgeColor="bg-purple-50 text-purple-700 border-purple-200"
            />

            <AnalyticsStatCard
              title="Quizzes Completed"
              value={analytics.quizzesCompleted}
              subtitle={`${analytics.quizPerformance.averageScore}% average score`}
              icon={<HelpCircle className="w-5 h-5" />}
              iconBgColor="bg-emerald-50 text-emerald-600 border-emerald-100"
              badge="Assessed"
              badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
            />
          </div>

          {/* 3. ACTIVITY VISUALIZATION */}
          <ActivityChart data={analytics.dailyActivity} period={period} />

          {/* 4. PERFORMANCE & BREAKDOWN (2-COLUMN) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuizPerformance stats={analytics.quizPerformance} />
            <StudyBreakdown breakdown={analytics.studyBreakdown} />
          </div>

          {/* 5. RECENT ACTIVITY & SUBJECT COVERAGE (2-COLUMN) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity items={analytics.recentActivity} />

            {/* Subject Coverage & Materials */}
            <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-edge/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-ink">Subject Coverage</h3>
                  </div>
                  <span className="text-xs text-ink-muted">Active Courses</span>
                </div>

                {/* Subject List */}
                <div className="space-y-4">
                  {analytics.subjectActivity.map((sub, idx) => (
                    <div key={idx} className="space-y-2 p-4 rounded-xl bg-gray-50 border border-edge">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-ink">{sub.subject}</span>
                        <span className="font-bold text-brand-600">{sub.progressPercent}% Mastered</span>
                      </div>

                      {/* Progress bar */}
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${sub.progressPercent}%`, backgroundColor: sub.color }}
                          className="h-full rounded-full transition-all duration-500"
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1">
                        <span>{sub.materialsCount} study materials uploaded</span>
                        <span>{sub.hoursSpent} hrs studied</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-4 border-t border-edge flex items-center justify-between">
                <span className="text-xs text-ink-muted">Want to add another course?</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/upload')}
                  leftIcon={<UploadCloud className="w-3.5 h-3.5 text-brand-600" />}
                >
                  Upload Material
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
