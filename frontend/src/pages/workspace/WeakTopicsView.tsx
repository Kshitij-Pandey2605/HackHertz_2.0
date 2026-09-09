import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  XCircle,
  AlertCircle,
  Eye,
  BookOpen,
  RotateCcw,
  TrendingUp,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { WeakTopic, WeakTopicSeverity } from '../../types';
import { mockWeakTopicsData } from '../../data/phase2MockData';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const severityConfig: Record<
  WeakTopicSeverity,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode; barColor: string }
> = {
  CRITICAL: {
    label: 'Critical',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    barColor: 'bg-rose-500',
    icon: <XCircle className="w-4 h-4 text-rose-600" />,
  },
  MODERATE: {
    label: 'Moderate',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    barColor: 'bg-amber-500',
    icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
  },
  WATCH: {
    label: 'Watch',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    barColor: 'bg-blue-500',
    icon: <Eye className="w-4 h-4 text-blue-600" />,
  },
};

const WeakTopicCard: React.FC<{ topic: WeakTopic; onReview: () => void; onQuiz: () => void }> = ({
  topic,
  onReview,
  onQuiz,
}) => {
  const cfg = severityConfig[topic.severity];
  const barWidth = topic.accuracyPercent;

  return (
    <div className={`bg-white rounded-2xl border ${cfg.border} shadow-card p-5 transition-all hover:shadow-card-hover`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
            {cfg.icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink leading-snug">{topic.topic}</h3>
            <p className="text-xs text-ink-muted mt-0.5">
              {topic.subject} · {topic.chapter}
            </p>
          </div>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border} flex-shrink-0`}>
          {cfg.label}
        </span>
      </div>

      {/* Accuracy bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] font-medium text-ink-muted">Accuracy</span>
          <span className={`text-sm font-black ${cfg.color}`}>{topic.accuracyPercent}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${cfg.barColor} rounded-full transition-all duration-700`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <p className="text-[11px] text-ink-muted mt-1.5">
          {topic.correctAttempts} correct / {topic.totalAttempts} attempts · Last tested {topic.lastTestedAt}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onReview}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-2 rounded-xl transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Review
        </button>
        <button
          onClick={onQuiz}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-3 py-2 rounded-xl transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          Practice
        </button>
      </div>
    </div>
  );
};

export const WeakTopicsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data = mockWeakTopicsData;
  const [filter, setFilter] = useState<WeakTopicSeverity | 'ALL'>('ALL');

  const filtered = filter === 'ALL' ? data.weakTopics : data.weakTopics.filter((t) => t.severity === filter);

  const counts = {
    CRITICAL: data.weakTopics.filter((t) => t.severity === 'CRITICAL').length,
    MODERATE: data.weakTopics.filter((t) => t.severity === 'MODERATE').length,
    WATCH: data.weakTopics.filter((t) => t.severity === 'WATCH').length,
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <h1 className="text-2xl font-bold text-ink">Weak Topic Detection</h1>
          </div>
          <p className="text-sm text-ink-muted ml-10">
            {data.totalTopicsTested} topics tested · {data.weakTopics.length} need attention · Analyzed{' '}
            {new Date(data.analyzedAt).toLocaleDateString()}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(`/workspace/${id}/adaptive-quiz`)}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Adaptive Practice
        </Button>
      </div>

      {/* AI Recommendation Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-900 via-rose-800 to-brand-900 text-white p-5 shadow-elevated">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-rose-200 uppercase tracking-wider mb-1">AI Recommendation</p>
            <p className="text-sm font-semibold text-white leading-relaxed">{data.recommendedAction}</p>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute -right-4 bottom-0 w-20 h-20 bg-white/5 rounded-full" />
      </div>

      {/* Summary Pills */}
      <div className="grid grid-cols-3 gap-4">
        {(
          [
            { key: 'CRITICAL', label: 'Critical', icon: <XCircle className="w-4 h-4 text-rose-600" />, bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
            { key: 'MODERATE', label: 'Moderate', icon: <AlertCircle className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
            { key: 'WATCH', label: 'Watch', icon: <Eye className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
          ] as const
        ).map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(filter === s.key ? 'ALL' : s.key)}
            className={`p-4 rounded-2xl border transition-all text-left ${
              filter === s.key
                ? `${s.bg} ${s.border} shadow-card`
                : 'bg-white border-edge hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">{s.icon}</div>
            <span className={`text-2xl font-black ${s.text}`}>{counts[s.key]}</span>
            <p className="text-xs font-semibold text-ink-muted mt-0.5">{s.label} Topics</p>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl border border-edge">
          {(['ALL', 'CRITICAL', 'MODERATE', 'WATCH'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filter === f ? 'bg-white text-ink shadow-subtle' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {f === 'ALL' ? 'All Topics' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <span className="text-xs text-ink-muted">{filtered.length} topic{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((topic) => (
          <WeakTopicCard
            key={topic.id}
            topic={topic}
            onReview={() => navigate(`/workspace/${id}/${topic.relatedSection || 'deep-summary'}`)}
            onQuiz={() => navigate(`/workspace/${id}/adaptive-quiz`)}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-edge">
        <Button variant="outline" size="md" onClick={() => navigate(`/workspace/${id}/mastery`)} leftIcon={<TrendingUp className="w-4 h-4" />}>
          View Mastery Dashboard
        </Button>
        <Button variant="outline" size="md" onClick={() => navigate(`/workspace/${id}/revision-planner`)} leftIcon={<ChevronRight className="w-4 h-4" />}>
          Build Revision Plan
        </Button>
      </div>
    </div>
  );
};
