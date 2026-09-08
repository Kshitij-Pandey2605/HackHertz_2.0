import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { ExamCram } from '../../types';
import { WorkspaceSkeleton } from '../../components/ui/WorkspaceSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import {
  Zap,
  CheckSquare,
  Square,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  BookMarked,
  Table as TableIcon,
} from 'lucide-react';

export const ExamCramView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<ExamCram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<{ id: string; label: string; checked?: boolean }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await api.workspace.getExamCram(id);
        setData(res.data);
        setChecklist(res.data.lastMinuteChecklist);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load Exam Cram.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleChecklist = (itemId: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item))
    );
  };

  if (isLoading) return <WorkspaceSkeleton type="summary" />;

  if (error || !data) {
    return (
      <ErrorState
        title="Unable to load Exam Cram"
        message={error || 'Could not fetch exam cram data.'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-6 shadow-elevated space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Exam Cram Sheet</h1>
              <p className="text-xs sm:text-sm text-amber-100">
                Everything worth remembering in the 5 minutes before your exam.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 bg-white text-amber-800 text-xs font-bold rounded-full shadow-subtle">
            High-Yield Revision
          </span>
        </div>
      </div>

      {/* Must Remember Points */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" /> Must Remember (Top 10 Exam Points)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.mustRemember.map((point, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 text-xs font-medium text-ink flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Comparison Table */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4 overflow-hidden">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <TableIcon className="w-5 h-5 text-brand-600" /> Quick Normal Form Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 text-ink border-b border-edge">
                {data.comparisons.headers.map((h, idx) => (
                  <th key={idx} className="p-3 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {data.comparisons.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-3 font-bold text-brand-700">{row[0]}</td>
                  <td className="p-3 text-ink-secondary">{row[1]}</td>
                  <td className="p-3 text-ink-secondary">{row[2]}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-emerald-100 text-emerald-800">
                      {row[3]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Common Exam Traps */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-600" /> Common Exam Traps & Pitfalls
        </h2>
        <div className="space-y-3">
          {data.commonTraps.map((trap, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1">
              <h3 className="text-xs font-bold text-rose-950 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                {trap.trap}
              </h3>
              <p className="text-xs text-rose-900 leading-relaxed pl-4">{trap.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Definitions */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-purple-600" /> Critical Definitions Sheet
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.criticalDefinitions.map((def, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200">
              <h3 className="text-xs font-bold text-purple-950">{def.term}</h3>
              <p className="text-[11px] text-purple-900 mt-1 leading-relaxed">{def.definition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Last-Minute Checklist */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-600" /> Last-Minute Readiness Checklist
          </h2>
          <span className="text-xs text-ink-muted">
            {checklist.filter((c) => c.checked).length} of {checklist.length} complete
          </span>
        </div>

        <div className="space-y-2">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleChecklist(item.id)}
              className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-3 ${
                item.checked
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950 line-through opacity-80'
                  : 'bg-gray-50 border-edge text-ink hover:bg-gray-100'
              }`}
            >
              {item.checked ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-ink-subtle flex-shrink-0" />
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom CTA to Flashcards */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-ink">Ready for Active Recall?</h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Test your memory retention using 20+ interactive spaced-repetition flashcards.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(`/workspace/${id}/flashcards`)}
          className="gap-2 shadow-sm whitespace-nowrap"
        >
          <span>Review Flashcards</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
