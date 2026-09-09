import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { QuickSummary } from '../../types';
import { WorkspaceSkeleton } from '../../components/ui/WorkspaceSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import {
  Eye,
  Clock,
  CheckCircle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export const QuickGlanceView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<QuickSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await api.workspace.getQuickSummary(id);
        setData(res.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load Quick Glance.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) return <WorkspaceSkeleton type="summary" />;

  if (error || !data) {
    return (
      <ErrorState
        title="Unable to load Quick Glance"
        message={error || 'Could not fetch summary data.'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-6">
      {/* Header Banner */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
                Quick Summary
              </h1>
              <p className="text-xs sm:text-sm text-ink-muted">
                Understand the core ideas in about a minute.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            <span>~{data.readingTimeMinutes || 1} min read</span>
          </span>
        </div>
      </div>

      {/* Core Idea Box */}
      <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-700 rounded-2xl p-6 sm:p-7 text-white shadow-elevated">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-200 mb-2">
          <Lightbulb className="w-4 h-4" />
          <span>Core Concept</span>
        </div>
        <p className="text-base sm:text-lg font-medium leading-relaxed">
          {data.coreIdea}
        </p>
      </div>

      {/* What Matters Most */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-ink flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>What Matters Most</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.whatMattersMost.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-canvas border border-edge/80 text-xs sm:text-sm text-ink-secondary leading-relaxed flex items-start gap-2.5"
            >
              <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Must Know Definitions */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-ink flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Must-Know Key Terms</span>
        </h2>
        <div className="space-y-3">
          {data.mustKnowDefinitions.map((def, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-edge hover:border-brand-300 transition-colors bg-white space-y-1"
            >
              <h3 className="text-xs sm:text-sm font-bold text-brand-600">
                {def.term}
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {def.definition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Essential Rules */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-ink flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Essential Rules to Remember</span>
        </h2>
        <div className="space-y-2.5">
          {data.essentialRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 text-xs sm:text-sm text-amber-950 flex items-start gap-2.5 font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Remember This Callout */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 shadow-subtle flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-600 text-white flex-shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider">
            Remember This
          </h3>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
            {data.rememberThis}
          </p>
        </div>
      </div>

      {/* Bottom CTA to Deep Summary */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="text-sm font-bold text-ink">Ready to go deeper?</h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Explore structured chapter explanations, step-by-step examples, and formulas.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(`/workspace/${id}/deep-summary`)}
          className="gap-2 shadow-sm whitespace-nowrap"
        >
          <span>Read Detailed Notes</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
