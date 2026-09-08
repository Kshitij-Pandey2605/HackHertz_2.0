import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Clock,
  HelpCircle,
  TrendingUp,
  Zap,
  Target,
  Star,
  ChevronRight,
  Brain,
} from 'lucide-react';
import { AICoachSuggestion } from '../../types';
import { mockAICoachData } from '../../data/phase2MockData';
import { Button } from '../../components/ui/Button';

const categoryConfig = {
  FOCUS: {
    label: 'Focus Area',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    headerBg: 'bg-rose-600',
    icon: <Target className="w-4 h-4" />,
    number: '01',
  },
  QUICK_WIN: {
    label: 'Quick Win',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    headerBg: 'bg-emerald-600',
    icon: <Zap className="w-4 h-4" />,
    number: '02',
  },
  LONG_TERM: {
    label: 'Long-term Goal',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    headerBg: 'bg-purple-600',
    icon: <Star className="w-4 h-4" />,
    number: '03',
  },
};

const statIconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-5 h-5" />,
  HelpCircle: <HelpCircle className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
};

const statColors = [
  { bg: 'bg-brand-50', border: 'border-brand-200', icon: 'text-brand-600', text: 'text-brand-700', ring: '#4F46E5' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', text: 'text-emerald-700', ring: '#10B981' },
  { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', text: 'text-amber-700', ring: '#F59E0B' },
  { bg: 'bg-violet-50', border: 'border-violet-200', icon: 'text-violet-600', text: 'text-violet-700', ring: '#7C3AED' },
];

const SuggestionCard: React.FC<{ suggestion: AICoachSuggestion; rank: number }> = ({ suggestion, rank }) => {
  const cfg = categoryConfig[suggestion.category];
  return (
    <div className={`bg-white rounded-2xl border shadow-card overflow-hidden hover:shadow-card-hover transition-all ${cfg.border}`}>
      <div className={`${cfg.headerBg} px-4 py-2.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2 text-white">
          {cfg.icon}
          <span className="text-xs font-bold uppercase tracking-wider">{cfg.label}</span>
        </div>
        <span className="text-white/60 text-xs font-black">#{rank}</span>
      </div>
      <div className="p-4 space-y-3">
        <h4 className="text-sm font-bold text-ink leading-snug">{suggestion.title}</h4>
        <p className="text-xs text-ink-muted leading-relaxed">{suggestion.description}</p>
        {(suggestion.topic || suggestion.estimatedMinutes) && (
          <div className="flex flex-wrap gap-2">
            {suggestion.topic && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                {suggestion.topic}
              </span>
            )}
            {suggestion.estimatedMinutes && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-ink-muted flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ~{suggestion.estimatedMinutes}m
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const AICoachView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data = mockAICoachData;
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'FOCUS' | 'QUICK_WIN' | 'LONG_TERM'>('ALL');

  const filteredSuggestions = activeCategory === 'ALL'
    ? data.suggestions
    : data.suggestions.filter((s) => s.category === activeCategory);

  // Overall ring
  const radius = 48;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ - (data.overallScore / 100) * circ;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-violet-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-ink">AI Study Coach</h1>
          </div>
          <p className="text-sm text-ink-muted ml-10">
            Personalized recommendations · Updated {new Date(data.generatedAt).toLocaleString()}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(`/workspace/${id}/adaptive-quiz`)}
          leftIcon={<Zap className="w-4 h-4" />}
        >
          Start Adaptive Quiz
        </Button>
      </div>

      {/* AI Insight Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-violet-900 to-brand-950 text-white p-6 sm:p-8 shadow-elevated">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Brain icon with glow */}
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/20">
            <Brain className="w-8 h-8 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">AI Coach Insight</span>
              <span className="text-xs font-semibold text-white bg-white/15 border border-white/20 px-2 py-0.5 rounded-full">
                {data.studentLevel}
              </span>
            </div>
            <p className="text-sm sm:text-base font-medium text-white/90 leading-relaxed">
              {data.studyInsight}
            </p>
          </div>

          {/* Score ring */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                <circle
                  cx="55" cy="55" r={radius} fill="none"
                  stroke="#A5B4FC" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{data.overallScore}</span>
                <span className="text-[10px] text-brand-200 font-semibold">Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />
      </div>

      {/* Learning Progress Stats */}
      <div>
        <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Learning Progress Tracker</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {data.progressStats.map((stat, i) => {
            const col = statColors[i % statColors.length];
            return (
              <div key={stat.label} className={`${col.bg} ${col.border} border rounded-2xl p-5 relative overflow-hidden`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${col.icon} bg-white/60`}>
                  {statIconMap[stat.icon] ?? <BookOpen className="w-5 h-5" />}
                </div>
                <div className={`text-3xl font-black ${col.text}`}>
                  {stat.value}{stat.unit === '%' ? '%' : ''}
                </div>
                <div className="text-xs font-semibold text-ink-muted mt-0.5">{stat.label}</div>
                {stat.unit && stat.unit !== '%' && (
                  <div className="text-[11px] text-ink-subtle">{stat.unit}</div>
                )}
                {stat.changePercent !== undefined && (
                  <div className={`absolute top-3 right-3 text-[10px] font-bold flex items-center gap-0.5 ${stat.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <TrendingUp className={`w-3 h-3 ${stat.changePercent < 0 ? 'rotate-180' : ''}`} />
                    +{stat.changePercent}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-ink">Personalized Suggestions</h3>
            <p className="text-xs text-ink-muted mt-0.5">Ranked by impact on your upcoming exam</p>
          </div>
          {/* Category filter */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl border border-edge self-start sm:self-auto">
            {(['ALL', 'FOCUS', 'QUICK_WIN', 'LONG_TERM'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeCategory === cat ? 'bg-white text-ink shadow-subtle' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat === 'FOCUS' ? '🎯 Focus' : cat === 'QUICK_WIN' ? '⚡ Quick Win' : '🌟 Long-term'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSuggestions.map((s, idx) => (
            <SuggestionCard key={s.id} suggestion={s} rank={s.priority} />
          ))}
        </div>
      </div>

      {/* Bottom CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-edge">
        <Button variant="outline" size="md" onClick={() => navigate(`/workspace/${id}/revision-planner`)} leftIcon={<Target className="w-4 h-4" />}>
          Build Revision Plan
        </Button>
        <Button variant="outline" size="md" onClick={() => navigate(`/workspace/${id}/mastery`)} leftIcon={<TrendingUp className="w-4 h-4" />}>
          Mastery Dashboard
        </Button>
        <Button variant="primary" size="md" onClick={() => navigate(`/workspace/${id}/weak-topics`)} rightIcon={<ChevronRight className="w-4 h-4" />}>
          View Weak Topics
        </Button>
      </div>
    </div>
  );
};
