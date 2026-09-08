import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Zap,
  FileText,
  ListChecks,
  AlertCircle,
  ArrowRight,
  Layers,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { getSummary } from '../services/api';
import { BackendSummary } from '../types';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

export const SummaryPage: React.FC = () => {
  const { id, documentId } = useParams<{ id?: string; documentId?: string }>();
  const activeDocId = documentId || id || '123';
  const navigate = useNavigate();

  const [summaryData, setSummaryData] = useState<BackendSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummaryData = async () => {
    if (!activeDocId) {
      setError('Invalid Document ID');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getSummary(activeDocId);
      if (response.success && response.summary) {
        setSummaryData(response.summary);
      } else {
        setError('No summary data returned for this document.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch summary from server.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, [activeDocId]);

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        <div className="h-28 bg-white border border-edge rounded-2xl p-6 space-y-3 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-edge rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
            </div>
            <div className="bg-white border border-edge rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-4/5" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white border border-edge rounded-2xl p-6 space-y-3 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/2" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-gray-100 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12">
        <ErrorState
          title="Could not load summary"
          message={error}
          onRetry={fetchSummaryData}
        />
      </div>
    );
  }

  // Empty State
  if (!summaryData) {
    return (
      <div className="max-w-xl mx-auto my-12">
        <EmptyState
          title="No Summary Found"
          description="We could not locate summary notes for this document ID."
          actionLabel="Go to Upload"
          onAction={() => navigate('/upload')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Document Summary
            </h1>
            <p className="text-xs text-ink-muted mt-0.5 font-mono">
              Document ID: {activeDocId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchSummaryData}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/workspace/${activeDocId}/flashcards`)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Study Flashcards
          </Button>
        </div>
      </div>

      {/* Main Content: 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick & Detailed Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Summary Card */}
          <div className="bg-gradient-to-br from-brand-50/70 via-white to-purple-50/50 border border-brand-200 rounded-2xl p-6 sm:p-7 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-brand-800 font-bold text-sm">
              <Zap className="w-4 h-4 text-brand-600" />
              <span>Quick Summary</span>
            </div>
            <p className="text-base text-ink font-medium leading-relaxed">
              {summaryData.quickSummary}
            </p>
          </div>

          {/* Detailed Summary Card */}
          <div className="bg-white border border-edge rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-ink font-bold text-base border-b border-edge pb-3">
              <FileText className="w-5 h-5 text-brand-600" />
              <span>Detailed Breakdown</span>
            </div>
            <p className="text-sm text-ink-secondary leading-relaxed sm:leading-loose">
              {summaryData.detailedSummary}
            </p>
          </div>
        </div>

        {/* Right Column: Exam Cram Notes */}
        <div className="space-y-6">
          <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4 sticky top-24">
            <div className="flex items-center gap-2 text-ink font-bold text-sm border-b border-edge pb-3">
              <ListChecks className="w-4 h-4 text-purple-600" />
              <span>High-Yield Exam Notes</span>
            </div>

            {summaryData.examNotes && summaryData.examNotes.length > 0 ? (
              <ul className="space-y-2.5">
                {summaryData.examNotes.map((note, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs font-semibold text-purple-950 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{note}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-ink-muted">No exam notes available.</p>
            )}

            {/* Quick Practice CTA */}
            <div className="pt-4 border-t border-edge space-y-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate(`/workspace/${activeDocId}/flashcards`)}
                leftIcon={<Layers className="w-4 h-4 text-emerald-600" />}
                className="w-full justify-start text-xs font-semibold"
              >
                Open Flashcards
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate(`/workspace/${activeDocId}/quiz`)}
                leftIcon={<HelpCircle className="w-4 h-4 text-purple-600" />}
                className="w-full justify-start text-xs font-semibold"
              >
                Practice Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
