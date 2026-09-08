import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { DeepSummary } from '../../types';
import { WorkspaceSkeleton } from '../../components/ui/WorkspaceSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Bookmark,
  FileCode,
} from 'lucide-react';

export const DeepSummaryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<DeepSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await api.workspace.getDeepSummary(id);
        setData(res.data);
        if (res.data.sections.length > 0) {
          setActiveSectionId(res.data.sections[0].id);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load Deep Summary.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const scrollToSection = (secId: string) => {
    setActiveSectionId(secId);
    const elem = document.getElementById(secId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) return <WorkspaceSkeleton type="summary" />;

  if (error || !data) {
    return (
      <ErrorState
        title="Unable to load Deep Summary"
        message={error || 'Could not fetch summary data.'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Deep Summary
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Understand the concepts, not just the keywords.
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout: Sticky Table of Contents + Reading Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Table of Contents Sticky Nav (Desktop) */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-24 space-y-3 bg-white border border-edge rounded-2xl p-4 shadow-subtle">
            <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider px-2">
              On This Page
            </h3>
            <nav className="space-y-1">
              {data.sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 ${
                    activeSectionId === sec.id
                      ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                      : 'text-ink-secondary hover:bg-gray-50'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-gray-100 text-ink-muted font-semibold text-[10px] flex items-center justify-center flex-shrink-0">
                    {sec.number}
                  </span>
                  <span className="truncate">{sec.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Reading Canvas */}
        <div className="lg:col-span-3 space-y-8 max-w-3xl">
          {data.sections.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              className="bg-white border border-edge rounded-2xl p-6 sm:p-8 shadow-card space-y-5 scroll-mt-28"
            >
              {/* Section Header */}
              <div className="border-b border-edge/80 pb-4">
                <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded border border-brand-100">
                  Section {sec.number}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink mt-2">
                  {sec.title}
                </h2>
              </div>

              {/* Explanation Text */}
              <p className="text-sm text-ink-secondary leading-relaxed sm:leading-loose">
                {sec.explanation}
              </p>

              {/* Optional Requirements / Bullet Points */}
              {sec.requirements && (
                <div className="p-4 rounded-xl bg-gray-50 border border-edge space-y-2">
                  <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Requirements & Criteria
                  </h4>
                  <ul className="space-y-1.5 text-xs text-ink-secondary pl-5 list-disc">
                    {sec.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Optional Example Block */}
              {sec.example && (
                <div className="rounded-xl border border-edge bg-slate-900 text-slate-100 overflow-hidden shadow-subtle">
                  <div className="bg-slate-800 px-4 py-2 text-xs font-mono text-slate-300 border-b border-slate-700 flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-brand-400" />
                    <span>{sec.example.title}</span>
                  </div>
                  <div className="p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {sec.example.codeOrText}
                  </div>
                </div>
              )}

              {/* Callout Card */}
              {sec.callout && (
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                    sec.callout.type === 'DEFINITION'
                      ? 'bg-blue-50 border-blue-200 text-blue-950'
                      : sec.callout.type === 'IMPORTANT'
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : sec.callout.type === 'EXAM NOTE'
                      ? 'bg-purple-50 border-purple-200 text-purple-950'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  }`}
                >
                  {sec.callout.type === 'IMPORTANT' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Lightbulb className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                      {sec.callout.type}
                    </span>
                    <span>{sec.callout.text}</span>
                  </div>
                </div>
              )}

              {/* Why It Matters */}
              {sec.whyItMatters && (
                <div className="pt-2 text-xs text-ink-muted italic border-t border-edge/60 flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-brand-600" />
                  <span>Why it matters: {sec.whyItMatters}</span>
                </div>
              )}
            </section>
          ))}

          {/* Bottom Navigation CTA */}
          <div className="bg-white border border-edge rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-ink">Understood the concepts?</h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Now lock them into your memory with active recall flashcard drills.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/workspace/${id}/flashcards`)}
              className="gap-2 shadow-sm whitespace-nowrap"
            >
              <span>Practice Flashcards</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
