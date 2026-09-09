import React, { useState } from 'react';
import {
  BookOpen,
  Key,
  BookMarked,
  CheckCircle2,
  Zap,
  Target,
  Clock,
  BarChart,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { PdfStructuredSummary } from '../../types';

interface PdfSummaryViewerProps {
  summary: PdfStructuredSummary;
  documentName?: string;
}

export const PdfSummaryViewer: React.FC<PdfSummaryViewerProps> = ({ summary, documentName }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getDifficultyBadge = (diff: string) => {
    const d = (diff || 'Medium').toLowerCase();
    if (d === 'easy') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (d === 'hard') {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Top Header Card with Metadata */}
      <div className="bg-white rounded-3xl border border-edge p-6 sm:p-7 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-violet-700 text-white flex items-center justify-center shadow-subtle">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">{documentName || 'Study Summary'}</h2>
              <p className="text-xs text-ink-muted">AI-Generated Structured Exam Summary &bull; Gemini Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Difficulty Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyBadge(
                summary.difficulty
              )}`}
            >
              <BarChart className="w-3.5 h-3.5" />
              {summary.difficulty || 'Medium'} Difficulty
            </span>

            {/* Reading Time Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-ink-secondary border border-edge">
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              {summary.estimatedReadingTime || '15 min'} Read
            </span>
          </div>
        </div>
      </div>

      {/* 1. Chapter Overview */}
      <div className="bg-white rounded-3xl border border-edge p-6 sm:p-7 shadow-card space-y-3 relative group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-700 font-bold text-base">
            <BookOpen className="w-5 h-5" />
            <h3>Chapter Overview</h3>
          </div>
          <button
            onClick={() => handleCopy(summary.chapterOverview, 'overview')}
            className="text-ink-muted hover:text-brand-600 p-1.5 rounded-lg hover:bg-brand-50 transition-colors"
            title="Copy Overview"
          >
            {copiedSection === 'overview' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-sm text-ink-secondary leading-relaxed sm:text-base font-normal">
          {summary.chapterOverview}
        </p>
      </div>

      {/* 2. Key Concepts & Definitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Concepts */}
        <div className="bg-white rounded-3xl border border-edge p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
            <Key className="w-5 h-5" />
            <h3>Key Concepts</h3>
          </div>
          <ul className="space-y-2.5">
            {summary.keyConcepts.map((concept, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-secondary leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{concept}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Important Definitions */}
        <div className="bg-white rounded-3xl border border-edge p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-cyan-700 font-bold text-base">
            <BookMarked className="w-5 h-5" />
            <h3>Important Definitions</h3>
          </div>
          <ul className="space-y-3">
            {summary.definitions.map((def, idx) => (
              <li key={idx} className="p-3 bg-cyan-50/40 border border-cyan-100 rounded-2xl text-xs sm:text-sm text-ink-secondary leading-relaxed">
                <span className="font-semibold text-ink block mb-0.5">{def.split(':')[0]}</span>
                <span className="text-ink-muted">{def.includes(':') ? def.split(':').slice(1).join(':').trim() : def}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Key Points to Remember */}
      <div className="bg-white rounded-3xl border border-edge p-6 sm:p-7 shadow-card space-y-4">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <h3>Key Points to Remember</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {summary.importantPoints.map((point, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3.5 bg-emerald-50/30 border border-emerald-100 rounded-2xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-ink-secondary leading-snug">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Revision Notes & Exam-Focused Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Revision Notes */}
        <div className="bg-white rounded-3xl border border-edge p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
            <Zap className="w-5 h-5 text-amber-600" />
            <h3>Quick Revision Notes</h3>
          </div>
          <div className="space-y-2">
            {summary.revisionNotes.map((note, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-xs sm:text-sm text-ink-secondary">
                <span className="text-amber-600 font-bold">&bull;</span>
                <span className="leading-snug">{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exam-Focused Topics */}
        <div className="bg-white rounded-3xl border border-edge p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
            <Target className="w-5 h-5 text-rose-600" />
            <h3>Exam-Focused Topics</h3>
          </div>
          <div className="space-y-2.5">
            {summary.examTopics.map((topic, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3.5 bg-rose-50/40 border border-rose-200/80 rounded-2xl text-xs sm:text-sm font-semibold text-rose-900">
                <span className="w-6 h-6 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  #{idx + 1}
                </span>
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfSummaryViewer;
