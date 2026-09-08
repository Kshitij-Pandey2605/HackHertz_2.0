import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Zap,
  Award,
} from 'lucide-react';
import { SubjectMastery, TopicMasteryItem } from '../../types';
import { mockMasteryData } from '../../data/phase2MockData';
import { Button } from '../../components/ui/Button';

const getMasteryColor = (pct: number) => {
  if (pct >= 75) return { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (pct >= 45) return { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
  return { bar: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
};

const getMasteryLabel = (pct: number) => {
  if (pct >= 80) return 'Mastered';
  if (pct >= 60) return 'Proficient';
  if (pct >= 40) return 'Developing';
  return 'Needs Work';
};

const TopicRow: React.FC<{ topic: TopicMasteryItem }> = ({ topic }) => {
  const col = getMasteryColor(topic.masteryPercent);
  return (
    <div className="flex items-center gap-4 py-3 border-b border-edge/50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{topic.topic}</p>
        <p className="text-[11px] text-ink-muted mt-0.5">{topic.questionsAttempted} attempts · {topic.lastPracticed}</p>
      </div>
      <div className="w-28 flex-shrink-0">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${col.bar} rounded-full transition-all duration-700`}
            style={{ width: `${topic.masteryPercent}%` }}
          />
        </div>
      </div>
      <span className={`text-sm font-bold w-10 text-right ${col.text}`}>{topic.masteryPercent}%</span>
    </div>
  );
};

const SubjectCard: React.FC<{ subject: SubjectMastery }> = ({ subject }) => {
  const [expanded, setExpanded] = useState(false);
  const col = getMasteryColor(subject.masteryPercent);

  return (
    <div className={`bg-white rounded-2xl border shadow-card overflow-hidden transition-all ${col.border}`}>
      {/* Header */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-ink">{subject.subject}</h3>
            <p className="text-xs text-ink-muted mt-0.5">{subject.topics.length} topics tracked</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-black ${col.text}`}>{subject.masteryPercent}%</div>
            <div className={`inline-flex items-center gap-1 text-[11px] font-semibold mt-0.5 ${subject.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {subject.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(subject.trend)}% this week
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full ${col.bar} rounded-full transition-all duration-1000`}
            style={{ width: `${subject.masteryPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${col.bg} ${col.text} border ${col.border}`}>
            {getMasteryLabel(subject.masteryPercent)}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
          >
            Topic Breakdown
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded topics */}
      {expanded && (
        <div className={`px-5 pb-4 border-t ${col.border} ${col.bg} animate-fadeIn`}>
          <div className="pt-2">
            {subject.topics.map((t) => (
              <TopicRow key={t.topicId} topic={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const MasteryDashboardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data = mockMasteryData;
  const overallCol = getMasteryColor(data.overallMastery);

  // Circumference for SVG ring
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ - (data.overallMastery / 100) * circ;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center">
              <Award className="w-4 h-4 text-brand-600" />
            </div>
            <h1 className="text-2xl font-bold text-ink">Topic Mastery Dashboard</h1>
          </div>
          <p className="text-sm text-ink-muted ml-10">
            Last updated {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md" onClick={() => navigate(`/workspace/${id}/weak-topics`)} leftIcon={<AlertTriangle className="w-4 h-4" />}>
            Weak Topics
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate(`/workspace/${id}/revision-planner`)} leftIcon={<Zap className="w-4 h-4" />}>
            Plan Revision
          </Button>
        </div>
      </div>

      {/* Overall mastery hero */}
      <div className="bg-white rounded-3xl border border-edge shadow-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* SVG Ring */}
          <div className="relative w-36 h-36 flex-shrink-0">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="12" />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={data.overallMastery >= 75 ? '#10B981' : data.overallMastery >= 45 ? '#F59E0B' : '#F43F5E'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${overallCol.text}`}>{data.overallMastery}%</span>
              <span className="text-[11px] font-semibold text-ink-muted">Overall</span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-ink mb-1">{getMasteryLabel(data.overallMastery)} Student</h2>
            <p className="text-sm text-ink-muted mb-4">
              Across {data.subjects.length} subjects and {data.subjects.reduce((s, sub) => s + sub.topics.length, 0)} tracked topics.
            </p>

            {/* Mini subject summary */}
            <div className="flex flex-wrap gap-3">
              {data.subjects.map((sub) => {
                const c = getMasteryColor(sub.masteryPercent);
                return (
                  <div key={sub.subjectId} className={`px-3 py-1.5 rounded-xl border ${c.bg} ${c.border} flex items-center gap-2`}>
                    <span className="text-sm font-bold text-ink">{sub.subject}</span>
                    <span className={`text-sm font-black ${c.text}`}>{sub.masteryPercent}%</span>
                    <span className={`text-[10px] flex items-center gap-0.5 ${sub.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {sub.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(sub.trend)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mastery Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="text-ink-muted font-medium">Mastery Scale:</span>
        {[
          { label: 'Needs Work', color: 'bg-rose-500', range: '< 45%' },
          { label: 'Developing', color: 'bg-amber-500', range: '45–74%' },
          { label: 'Mastered', color: 'bg-emerald-500', range: '≥ 75%' },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-ink-muted">
            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            {item.label} <span className="text-ink-subtle">({item.range})</span>
          </span>
        ))}
      </div>

      {/* Per-subject cards */}
      <div>
        <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Subject Breakdown</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {data.subjects.map((sub) => (
            <SubjectCard key={sub.subjectId} subject={sub} />
          ))}
        </div>
      </div>
    </div>
  );
};
