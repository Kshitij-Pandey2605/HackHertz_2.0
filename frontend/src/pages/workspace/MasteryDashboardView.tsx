import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Award,
  AlertTriangle,
  Zap,
  TrendingUp,
  Brain,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  Code,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  generateTopicMasteryDashboard,
  defaultAnalyticsInput,
  RawTopicInput,
  MasteryLevel,
} from '../../services/learningAnalyticsEngine';
import { Button } from '../../components/ui/Button';

const getLevelBadgeClass = (level: MasteryLevel) => {
  switch (level) {
    case 'Expert':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Strong':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Moderate':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Weak':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Critical':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getProgressBarColor = (level: MasteryLevel) => {
  switch (level) {
    case 'Expert':
      return 'bg-emerald-500';
    case 'Strong':
      return 'bg-blue-600';
    case 'Moderate':
      return 'bg-amber-500';
    case 'Weak':
      return 'bg-orange-500';
    case 'Critical':
      return 'bg-rose-500';
    default:
      return 'bg-gray-500';
  }
};

const getAsciiBar = (pct: number) => {
  const totalBlocks = 10;
  const filled = Math.round((pct / 100) * totalBlocks);
  const empty = totalBlocks - filled;
  return '█'.repeat(Math.max(0, filled)) + '░'.repeat(Math.max(0, empty));
};

export const MasteryDashboardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [topicInputs, setTopicInputs] = useState<RawTopicInput[]>(defaultAnalyticsInput);
  const [showJson, setShowJson] = useState<boolean>(false);
  const [isInteractiveMode, setIsInteractiveMode] = useState<boolean>(false);

  // Compute analytics using the AI Learning Analytics Engine
  const analytics = useMemo(() => {
    return generateTopicMasteryDashboard(topicInputs);
  }, [topicInputs]);

  // Handle live updating of input values in simulation mode
  const handleUpdateTopic = (
    index: number,
    field: keyof RawTopicInput,
    value: number | string
  ) => {
    setTopicInputs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Reset to default standard benchmark
  const handleReset = () => {
    setTopicInputs(defaultAnalyticsInput);
  };

  // SVG circular gauge
  const radius = 56;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ - (analytics.overallMastery / 100) * circ;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-violet-700 flex items-center justify-center text-white shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
                Topic Mastery Dashboard
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  AI Analytics Engine
                </span>
              </h1>
              <p className="text-xs text-ink-muted">
                Analyzed from quiz scores, study engagement, and revision consistency
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={isInteractiveMode ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setIsInteractiveMode(!isInteractiveMode)}
            leftIcon={<Sliders className="w-3.5 h-3.5" />}
          >
            {isInteractiveMode ? 'Exit Tuning Mode' : 'Tune Input Metrics'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowJson(!showJson)}
            leftIcon={<Code className="w-3.5 h-3.5" />}
          >
            {showJson ? 'Hide JSON' : 'View Raw JSON'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/workspace/${id}/weak-topics`)}
            leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
          >
            Weak Topics
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/workspace/${id}/revision-planner`)}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
          >
            Plan Revision
          </Button>
        </div>
      </div>

      {/* JSON Output View Modal/Card */}
      {showJson && (
        <div className="bg-slate-900 text-emerald-400 p-5 rounded-2xl font-mono text-xs overflow-x-auto shadow-elevated border border-slate-700 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
            <span className="font-semibold text-slate-200">Engine JSON Payload:</span>
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(analytics, null, 2))}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
            >
              Copy JSON
            </button>
          </div>
          <pre>{JSON.stringify(analytics, null, 2)}</pre>
        </div>
      )}

      {/* 1. OVERALL MASTERY & KEY SIGNALS HERO */}
      <div className="bg-white rounded-3xl border border-edge shadow-card p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Circular Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-gray-50/60 rounded-2xl border border-edge/60">
            <div className="relative w-36 h-36 flex-shrink-0 mb-3">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="12" />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  stroke={
                    analytics.overallMastery >= 85
                      ? '#10B981'
                      : analytics.overallMastery >= 70
                      ? '#2563EB'
                      : analytics.overallMastery >= 50
                      ? '#F59E0B'
                      : '#F43F5E'
                  }
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-ink tracking-tight">
                  {analytics.overallMastery}%
                </span>
                <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">
                  Overall
                </span>
              </div>
            </div>
            <h3 className="text-base font-bold text-ink">
              Overall Mastery Score: {analytics.overallMastery}%
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Weighted: 70% Quiz + 20% Revision + 10% Study Time
            </p>
          </div>

          {/* Highlights & Summary */}
          <div className="lg:col-span-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Strongest */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Strongest Topic
                  </span>
                </div>
                <div className="text-lg font-black text-emerald-900">{analytics.strongestTopic}</div>
                <div className="text-xs text-emerald-700 mt-0.5">
                  {analytics.topics.find((t) => t.topic === analytics.strongestTopic)?.mastery}% Mastery • Expert
                </div>
              </div>

              {/* Weakest */}
              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80">
                <div className="flex items-center gap-2 mb-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                    Weakest Topic
                  </span>
                </div>
                <div className="text-lg font-black text-rose-900">{analytics.weakestTopic}</div>
                <div className="text-xs text-rose-700 mt-0.5">
                  {analytics.topics.find((t) => t.topic === analytics.weakestTopic)?.mastery}% Mastery • Needs Work
                </div>
              </div>

              {/* Most Improved */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80">
                <div className="flex items-center gap-2 mb-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Most Improved
                  </span>
                </div>
                <div className="text-lg font-black text-blue-900">{analytics.mostImprovedTopic}</div>
                <div className="text-xs text-blue-700 mt-0.5">
                  {analytics.topics.find((t) => t.topic === analytics.mostImprovedTopic)?.mastery}% Mastery • High Velocity
                </div>
              </div>
            </div>

            {/* Quick Summary ASCII Banner */}
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800 pb-1.5 font-bold">
                <span>TOPIC MASTERY ASCII VIEW</span>
                <span className="text-brand-400">OVERALL: {analytics.overallMastery}%</span>
              </div>
              <div className="space-y-1 text-slate-300">
                {analytics.topics.map((t) => (
                  <div key={t.topic} className="flex items-center justify-between font-mono">
                    <span className="w-44 truncate">{t.topic}</span>
                    <span className="text-brand-300 font-bold">{getAsciiBar(t.mastery)} {t.mastery}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE SIMULATION TUNER (Optional toggle) */}
      {isInteractiveMode && (
        <div className="bg-brand-50/40 rounded-3xl border border-brand-200 p-6 sm:p-7 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-ink">AI Learning Analytics Parameter Tuner</h3>
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Defaults
            </button>
          </div>
          <p className="text-xs text-ink-muted">
            Adjust quiz attempts, correct answers, revision count, and study hours to simulate real-time engine calculations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {topicInputs.map((input, idx) => (
              <div key={input.topic} className="bg-white p-4 rounded-2xl border border-edge shadow-subtle space-y-3">
                <div className="font-bold text-sm text-ink border-b pb-1.5 flex justify-between items-center">
                  <span>{input.topic}</span>
                  <span className="text-xs font-mono text-brand-600">
                    Acc: {Math.round(((input.correctAnswers || 0) / (input.questionsAttempted || 1)) * 100)}%
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-ink-muted flex justify-between">
                    <span>Questions Attempted:</span>
                    <span className="font-bold text-ink">{input.questionsAttempted}</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={input.questionsAttempted}
                    onChange={(e) => handleUpdateTopic(idx, 'questionsAttempted', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-ink-muted flex justify-between">
                    <span>Correct Answers:</span>
                    <span className="font-bold text-ink">{input.correctAnswers}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={input.questionsAttempted}
                    value={Math.min(input.correctAnswers, input.questionsAttempted)}
                    onChange={(e) => handleUpdateTopic(idx, 'correctAnswers', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] font-medium text-ink-muted block mb-1">Study Hours</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={input.studyTimeHours ?? 5}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        handleUpdateTopic(idx, 'studyTimeHours', val);
                        handleUpdateTopic(idx, 'studyTime', `${val}h`);
                      }}
                      className="w-full text-xs px-2.5 py-1.5 border border-edge rounded-lg font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-ink-muted block mb-1">Revisions</label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={input.revisionCount}
                      onChange={(e) => handleUpdateTopic(idx, 'revisionCount', parseInt(e.target.value) || 0)}
                      className="w-full text-xs px-2.5 py-1.5 border border-edge rounded-lg font-medium"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DETAILED TOPIC-WISE ANALYTICS CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-ink">Topic-wise Mastery Breakdown</h2>
            <p className="text-xs text-ink-muted">Detailed performance metrics across all evaluated topics</p>
          </div>
          {/* Classification Legend */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="px-2 py-0.5 rounded border text-[11px] font-semibold bg-emerald-100 text-emerald-800 border-emerald-300">Expert (90-100%)</span>
            <span className="px-2 py-0.5 rounded border text-[11px] font-semibold bg-blue-100 text-blue-800 border-blue-300">Strong (75-89%)</span>
            <span className="px-2 py-0.5 rounded border text-[11px] font-semibold bg-amber-100 text-amber-800 border-amber-300">Moderate (60-74%)</span>
            <span className="px-2 py-0.5 rounded border text-[11px] font-semibold bg-orange-100 text-orange-800 border-orange-300">Weak (40-59%)</span>
            <span className="px-2 py-0.5 rounded border text-[11px] font-semibold bg-rose-100 text-rose-800 border-rose-300">Critical (0-39%)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {analytics.topics.map((t) => (
            <div
              key={t.topic}
              className="bg-white rounded-2xl border border-edge shadow-card p-5 flex flex-col justify-between hover:shadow-elevated transition-all"
            >
              <div>
                {/* Card Title & Level Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-ink">{t.topic}</h3>
                    <span className="text-[11px] text-ink-muted">{t.subject || 'Core Subject'}</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getLevelBadgeClass(t.level)}`}>
                    {t.level}
                  </span>
                </div>

                {/* Mastery Percentage & Visual Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-xs font-semibold text-ink-muted">Calculated Mastery:</span>
                    <span className="text-2xl font-black text-ink">{t.mastery}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressBarColor(t.level)} rounded-full transition-all duration-700`}
                      style={{ width: `${t.mastery}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-edge/60 text-xs">
                  <div className="p-2 rounded-xl bg-gray-50 flex flex-col">
                    <span className="text-[10px] text-ink-muted font-medium">Accuracy</span>
                    <span className="font-bold text-ink mt-0.5">
                      {t.accuracy}% <span className="text-[10px] font-normal text-ink-muted">({t.correctAnswers}/{t.questionsAttempted})</span>
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 flex flex-col">
                    <span className="text-[10px] text-ink-muted font-medium">Study Time</span>
                    <span className="font-bold text-ink mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-ink-muted" /> {t.studyTime}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 flex flex-col">
                    <span className="text-[10px] text-ink-muted font-medium">Revisions</span>
                    <span className="font-bold text-ink mt-0.5 flex items-center gap-1">
                      <RotateCcw className="w-3 h-3 text-ink-muted" /> {t.revisionCount} cycles
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 flex flex-col">
                    <span className="text-[10px] text-ink-muted font-medium">Exam Contribution</span>
                    <span className="font-bold text-brand-700 mt-0.5">
                      {t.examReadinessContribution}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-2">
                <Button
                  variant={t.mastery < 75 ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => navigate(`/workspace/${id}/revision-planner`)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {t.mastery < 75 ? 'Prioritize in Revision' : 'Review Cheat Sheet'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. RECOMMENDATIONS & ACTIONABLE NEXT REVISION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Personalized AI Recommendations */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-edge shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-ink">Personalized AI Study Recommendations</h3>
          </div>

          <div className="space-y-3">
            {analytics.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/70 border border-edge/60 text-xs text-ink leading-relaxed"
              >
                <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Next Revision Order */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-edge shadow-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-ink">Recommended Next Revision</h3>
            </div>

            <ol className="space-y-2.5">
              {analytics.topics
                .slice()
                .sort((a, b) => a.mastery - b.mastery)
                .map((topic, index) => (
                  <li
                    key={topic.topic}
                    className="flex items-center justify-between p-3 rounded-xl border border-edge/70 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-ink">{topic.topic}</div>
                        <span className={`text-[10px] font-semibold ${topic.mastery < 60 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {topic.mastery}% Mastery • {topic.level}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-ink-muted">
                      {topic.mastery < 60 ? 'Priority: High' : 'Maintenance'}
                    </span>
                  </li>
                ))}
            </ol>
          </div>

          <div className="pt-4 mt-4 border-t border-edge">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => navigate(`/workspace/${id}/revision-planner`)}
              rightIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Generate 3-Day Revision Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
