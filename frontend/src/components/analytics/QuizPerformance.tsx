import React from 'react';
import { HelpCircle, CheckCircle2, Award, Zap } from 'lucide-react';
import { QuizPerformanceStats } from '../../types';

interface QuizPerformanceProps {
  stats: QuizPerformanceStats;
}

export const QuizPerformance: React.FC<QuizPerformanceProps> = ({ stats }) => {
  return (
    <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-edge/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-ink">Quiz Performance</h3>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          {stats.quizzesCompleted} Quizzes Taken
        </span>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-gray-50 border border-edge space-y-1">
          <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block">
            Average Score
          </span>
          <span className="text-2xl font-extrabold text-brand-600">
            {stats.averageScore}%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-gray-50 border border-edge space-y-1">
          <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block">
            Correct Answers
          </span>
          <span className="text-2xl font-extrabold text-ink">
            {stats.correctAnswers}{' '}
            <span className="text-xs font-normal text-ink-muted">/ {stats.totalQuestions}</span>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-gray-50 border border-edge space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block">
            Accuracy Rate
          </span>
          <span className="text-2xl font-extrabold text-emerald-600">
            {stats.accuracyRate}%
          </span>
        </div>
      </div>

      {/* Difficulty Level Breakdown */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider">
          Accuracy By Difficulty
        </h4>

        <div className="space-y-2.5">
          {/* Easy */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Easy (Foundations)
              </span>
              <span className="text-ink">{stats.byDifficulty.easy}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${stats.byDifficulty.easy}%` }}
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Medium */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-brand-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                Medium (College Syllabus)
              </span>
              <span className="text-ink">{stats.byDifficulty.medium}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${stats.byDifficulty.medium}%` }}
                className="h-full bg-brand-500 rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Hard */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-purple-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Hard (Technical Rigor)
              </span>
              <span className="text-ink">{stats.byDifficulty.hard}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${stats.byDifficulty.hard}%` }}
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPerformance;
