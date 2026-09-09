import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Formula } from '../../types';
import { WorkspaceSkeleton } from '../../components/ui/WorkspaceSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../contexts/ToastContext';
import { Sigma, Copy, Check, Info, Sparkles, ArrowRight, Layers } from 'lucide-react';

export const FormulasView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await api.workspace.getFormulas(id);
        setFormulas(res.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load formulas.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCopyFormula = (formulaItem: Formula) => {
    navigator.clipboard.writeText(`${formulaItem.name}: ${formulaItem.formula}`);
    setCopiedId(formulaItem.id);
    showToast('Formula copied to clipboard', 'success');

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  if (isLoading) return <WorkspaceSkeleton type="grid" />;

  if (error || formulas.length === 0) {
    return (
      <ErrorState
        title="No Formulas Found"
        message={error || 'No mathematical formulas or rules were detected.'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Sigma className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Formulas & Rules
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Formulas, equations, and rules extracted from your study notes.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of FormulaCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formulas.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Top metadata badges & Copy button */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-xs text-ink-muted">{item.chapter}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyFormula(item)}
                  className="p-1.5 rounded-lg text-ink-muted hover:text-brand-600 hover:bg-brand-50 border border-edge transition-colors flex items-center gap-1 text-[11px] font-semibold"
                  title="Copy formula"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Name */}
              <h3 className="text-sm font-bold text-ink">{item.name}</h3>

              {/* Formula Display Box */}
              <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm font-bold text-center border border-slate-800 shadow-inner overflow-x-auto">
                {item.formula}
              </div>

              {/* Variables breakdown */}
              {item.variables && item.variables.length > 0 && (
                <div className="p-3 rounded-xl bg-gray-50 border border-edge space-y-1.5 text-xs">
                  <h4 className="text-[11px] font-bold text-ink-muted flex items-center gap-1">
                    <Info className="w-3 h-3 text-brand-600" /> Variables & Symbols
                  </h4>
                  <ul className="space-y-1 text-ink-secondary text-[11px]">
                    {item.variables.map((v, vIdx) => (
                      <li key={vIdx} className="flex items-start gap-1.5">
                        <span className="font-mono font-bold text-brand-700 min-w-[24px]">
                          {v.symbol}
                        </span>
                        <span className="text-ink-muted">&rarr;</span>
                        <span>{v.meaning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Explanation */}
              <p className="text-xs text-ink-muted leading-relaxed pt-1">
                {item.explanation}
              </p>
            </div>

            <div className="pt-3 border-t border-edge/60 flex items-center justify-between text-[11px] text-ink-muted">
              <span>Topic: {item.topic}</span>
              <span className="flex items-center gap-1 text-brand-600 font-semibold">
                <Sparkles className="w-3 h-3" /> Exam Ready
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to Flashcards / Quiz */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ready for Active Recall</span>
          </div>
          <h3 className="text-sm font-bold text-ink">Memorize these formulas with Flashcards</h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Test yourself on closure properties, decomposition conditions, and dependency preserving rules.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(`/workspace/${id}/quiz/setup`)}
            className="flex-1 sm:flex-none whitespace-nowrap"
          >
            Practice Quiz
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/workspace/${id}/flashcards`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="flex-1 sm:flex-none whitespace-nowrap shadow-elevated"
          >
            Review Flashcards
          </Button>
        </div>
      </div>
    </div>
  );
};
