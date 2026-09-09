import React from 'react';
import { Layers, BookOpen, Clock } from 'lucide-react';
import { StudyBreakdownItem } from '../../types';

interface StudyBreakdownProps {
  breakdown: StudyBreakdownItem[];
}

export const StudyBreakdown: React.FC<StudyBreakdownProps> = ({ breakdown }) => {
  if (!breakdown || breakdown.length === 0) return null;

  return (
    <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-edge/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-ink">How You&apos;ve Studied</h3>
        </div>
        <span className="text-xs text-ink-muted">Across All Modules</span>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-4">
        {breakdown.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-ink">{item.module}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <span className="text-ink-muted">{item.timeSpentMinutes} mins</span>
                <span className="text-ink font-bold">
                  {item.count} {item.module === 'Flashcards' ? 'cards' : item.module === 'Quizzes' ? 'tests' : 'views'}
                </span>
              </div>
            </div>

            {/* Proportional Bar */}
            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
                className="h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Note */}
      <div className="p-3.5 rounded-xl bg-gray-50 border border-edge text-xs text-ink-muted flex items-start gap-2.5">
        <Clock className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          You spend the most time on <strong className="text-ink">Deep Summary</strong> and{' '}
          <strong className="text-ink">Flashcards</strong>, reinforcing active recall.
        </p>
      </div>
    </div>
  );
};

export default StudyBreakdown;
