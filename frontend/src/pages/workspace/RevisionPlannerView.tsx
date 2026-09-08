import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  BookOpen,
  ChevronRight,
  Flame,
  RefreshCw,
  Target,
} from 'lucide-react';
import { RevisionDay, RevisionTopic } from '../../types';
import { mockRevisionPlan } from '../../data/phase2MockData';
import { Button } from '../../components/ui/Button';

const priorityConfig = {
  HIGH: { label: 'High Priority', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  MEDIUM: { label: 'Medium', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  LOW: { label: 'Low', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
};

const TopicChip: React.FC<{ topic: RevisionTopic }> = ({ topic }) => {
  const cfg = priorityConfig[topic.priority];
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-ink truncate">{topic.topic}</p>
        <p className="text-[11px] text-ink-muted">{topic.subject} · ~{topic.estimatedMinutes}m</p>
      </div>
    </div>
  );
};

const DayCard: React.FC<{ day: RevisionDay; onToggle: (dayNum: number) => void }> = ({ day, onToggle }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={`bg-white rounded-2xl border shadow-card transition-all overflow-hidden ${
        day.isCompleted ? 'border-emerald-300 opacity-80' : 'border-edge'
      }`}
    >
      {/* Day header */}
      <div className="p-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Day number bubble */}
          <div
            className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 ${
              day.isCompleted ? 'bg-emerald-100' : 'bg-brand-600'
            }`}
          >
            <span className={`text-[10px] font-bold uppercase ${day.isCompleted ? 'text-emerald-700' : 'text-brand-200'}`}>
              Day
            </span>
            <span className={`text-lg font-black leading-none ${day.isCompleted ? 'text-emerald-700' : 'text-white'}`}>
              {day.day}
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-ink">{day.label}</h3>
            <div className="flex items-center gap-3 mt-0.5">
              <div className="flex items-center gap-1 text-xs text-ink-muted">
                <Calendar className="w-3 h-3" />
                <span>{new Date(day.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-ink-muted">
                <Clock className="w-3 h-3" />
                <span>~{day.totalMinutes}m</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mark complete toggle */}
          <button
            onClick={() => onToggle(day.day)}
            className={`p-1.5 rounded-xl transition-colors ${
              day.isCompleted
                ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                : 'text-ink-subtle hover:text-emerald-600 hover:bg-emerald-50 border border-transparent'
            }`}
            title={day.isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            {day.isCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-ink-muted hover:text-ink p-1.5 rounded-xl hover:bg-gray-50 border border-transparent transition-colors text-xs font-medium"
          >
            {expanded ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* Topics list */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-edge/60 pt-4 animate-fadeIn">
          <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-3">
            Topics to cover
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {day.topics.map((t) => (
              <TopicChip key={t.topicId} topic={t} />
            ))}
          </div>

          {/* High priority alert */}
          {day.topics.some((t) => t.priority === 'HIGH') && !day.isCompleted && (
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              <Flame className="w-3.5 h-3.5" />
              <span>{day.topics.filter((t) => t.priority === 'HIGH').length} high-priority topic{day.topics.filter((t) => t.priority === 'HIGH').length > 1 ? 's' : ''} — don't skip these!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const RevisionPlannerView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(mockRevisionPlan);

  const toggleDay = (dayNum: number) => {
    setPlan((prev) => ({
      ...prev,
      days: prev.days.map((d) => (d.day === dayNum ? { ...d, isCompleted: !d.isCompleted } : d)),
    }));
  };

  const completedDays = plan.days.filter((d) => d.isCompleted).length;
  const totalMinutes = plan.days.reduce((s, d) => s + d.totalMinutes, 0);
  const progressPct = Math.round((completedDays / plan.days.length) * 100);

  const examDateFormatted = new Date(plan.examDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
              <Target className="w-4 h-4 text-violet-700" />
            </div>
            <h1 className="text-2xl font-bold text-ink">Personalized Revision Planner</h1>
          </div>
          <p className="text-sm text-ink-muted ml-10">
            Auto-generated from your weak topics and mastery gaps
          </p>
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={() => setPlan(mockRevisionPlan)}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Regenerate Plan
        </Button>
      </div>

      {/* Exam Countdown Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-violet-950 text-white p-6 sm:p-8 shadow-elevated">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Countdown */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-center">
              <div className="text-6xl font-black text-white leading-none">{plan.daysUntilExam}</div>
              <div className="text-brand-200 text-sm font-semibold mt-1">Days Left</div>
            </div>
            <div className="h-16 w-px bg-white/20 hidden sm:block" />
          </div>

          <div className="flex-1">
            <p className="text-xs font-bold text-brand-300 uppercase tracking-wider mb-1">📅 Exam Date</p>
            <h2 className="text-xl font-bold text-white mb-3">{examDateFormatted}</h2>
            <div className="flex flex-wrap gap-4 text-xs text-brand-200">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {plan.days.length} study days planned
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                ~{Math.round(totalMinutes / 60)}h total study time
              </span>
            </div>
          </div>

          {/* Progress ring */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="32" fill="none"
                  stroke="#A5B4FC" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 - (progressPct / 100) * 2 * Math.PI * 32}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black text-white">{progressPct}%</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-brand-200">Done</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -right-4 -bottom-8 w-28 h-28 bg-white/5 rounded-full" />
      </div>

      {/* Progress summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Days Planned', value: plan.days.length, color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-200' },
          { label: 'Completed', value: completedDays, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { label: 'Remaining', value: plan.days.length - completedDays, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
        ].map((item) => (
          <div key={item.label} className={`${item.bg} ${item.border} border rounded-2xl p-4 text-center`}>
            <div className={`text-3xl font-black ${item.color}`}>{item.value}</div>
            <div className="text-xs font-semibold text-ink-muted mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Day-by-day schedule */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-ink">Study Schedule</h3>
          <span className="text-xs text-ink-muted">Click ○ to mark days complete</span>
        </div>
        <div className="space-y-4">
          {plan.days.map((day) => (
            <DayCard key={day.day} day={day} onToggle={toggleDay} />
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-edge">
        <Button variant="outline" size="md" onClick={() => navigate(`/workspace/${id}/ai-coach`)} leftIcon={<ChevronRight className="w-4 h-4" />}>
          AI Study Coach
        </Button>
        <Button variant="primary" size="md" onClick={() => navigate(`/workspace/${id}/adaptive-quiz`)} leftIcon={<Flame className="w-4 h-4" />}>
          Start Adaptive Quiz
        </Button>
      </div>
    </div>
  );
};
