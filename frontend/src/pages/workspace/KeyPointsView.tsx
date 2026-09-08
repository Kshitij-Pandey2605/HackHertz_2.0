import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { KeyPointsData } from '../../types';
import { WorkspaceSkeleton } from '../../components/ui/WorkspaceSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Key, Sparkles, Star, Cpu, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const KeyPointsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<KeyPointsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await api.workspace.getKeyPoints(id);
        setData(res.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load key points.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) return <WorkspaceSkeleton type="grid" />;

  if (error || !data) {
    return (
      <ErrorState
        title="Unable to load Key Points"
        message={error || 'Could not fetch key points.'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-brand-600" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-purple-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <Key className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Key Points & Takeaways
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              High-priority concepts designed for active retention.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Important Concepts */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <Star className="w-5 h-5 text-brand-600" /> Important Concepts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.concepts.map((concept) => (
            <div
              key={concept.id}
              className="bg-white border border-edge rounded-2xl p-5 shadow-card space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {renderIcon(concept.iconName)}
                    <h3 className="text-xs font-bold text-ink">{concept.title}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      concept.priority === 'CORE'
                        ? 'bg-brand-100 text-brand-800 border border-brand-200'
                        : concept.priority === 'EXAM FOCUS'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {concept.priority}
                  </span>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">{concept.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Key Takeaways */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Key Takeaways
        </h2>
        <div className="space-y-2.5">
          {data.takeaways.map((takeaway) => (
            <div
              key={takeaway.id}
              className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 text-xs font-medium text-emerald-950 flex items-center gap-3"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{takeaway.statement}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Highlighted Topics */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <Key className="w-5 h-5 text-purple-600" /> Highlighted Topics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.topics.map((topic) => (
            <div key={topic.id} className="p-4 rounded-xl bg-gray-50 border border-edge space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-ink">{topic.topic}</h3>
                <span className="text-[9px] bg-gray-200 text-ink-muted font-bold px-1.5 py-0.5 rounded">
                  {topic.importance}
                </span>
              </div>
              <p className="text-[11px] text-ink-muted leading-relaxed">{topic.oneLiner}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
