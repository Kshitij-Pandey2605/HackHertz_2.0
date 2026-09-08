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
                Quick Glance
              </h1>
              <p className="text-xs sm:text-sm text-ink-muted">
                Understand the core ideas in about a minute.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>~{data.readingTimeMinutes} min read</span>
          </div>
        </div>
      </div>

      {/* Core Idea */}
      <div className="bg-gradient-to-r from-brand-600 to-violet-700 text-white rounded-2xl p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/15 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
            <Lightbulb className="w-3.5 h-3.5" /> Core Idea
          </div>
          <p className="text-base sm:text-lg font-medium leading-relaxed pt-1">
            "{data.coreIdea}"
          </p>
        </div>
      </div>

      {/* Grid: What Matters Most & Must-Know Definitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What Matters Most */}
        <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> What Matters Most
          </h2>
          <ul className="space-y-2.5 text-xs text-ink-secondary">
            {data.whatMattersMost.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-gray-50 border border-edge/60">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="font-medium text-ink leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Must-Know Definitions */}
        <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" /> Must-Know Definitions
          </h2>
          <div className="space-y-3">
            {data.mustKnowDefinitions.map((def, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-gray-50 border border-edge">
                <h3 className="text-xs font-bold text-brand-700">{def.term}</h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">{def.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Essential Rules */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" /> Essential Rules / Formulas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.essentialRules.map((rule, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs font-medium text-amber-950 flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
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
            Explore structured chapter explanations, schema proofs, and technical examples.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(`/workspace/${id}/deep-summary`)}
          className="gap-2 shadow-sm whitespace-nowrap"
        >
          <span>Read Deep Summary</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
