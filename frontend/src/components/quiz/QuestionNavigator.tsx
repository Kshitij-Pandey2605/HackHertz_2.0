import React from 'react';
import { Check, HelpCircle } from 'lucide-react';
import { QuizQuestion } from '../../types';

export interface QuestionNavigatorProps {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<string, string>;
  onSelectQuestion: (index: number) => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIndex,
  answers,
  onSelectQuestion,
}) => {
  return (
    <div className="bg-white border border-edge rounded-2xl p-4 sm:p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
          Question Navigator
        </h4>
        <span className="text-[11px] text-ink-muted">
          {Object.keys(answers).filter((k) => (answers[k] || '').trim().length > 0).length} of {questions.length} answered
        </span>
      </div>

      {/* Grid of question buttons */}
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = (answers[q.id] || '').trim().length > 0;

          let btnClass = 'border-edge bg-canvas text-ink-secondary hover:bg-gray-100';
          if (isCurrent) {
            btnClass = 'border-brand-600 bg-brand-600 text-white font-bold ring-2 ring-brand-400/30';
          } else if (isAnswered) {
            btnClass = 'border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuestion(idx)}
              className={`relative h-10 rounded-xl border flex items-center justify-center text-xs transition-all ${btnClass}`}
              title={`Question ${idx + 1} (${isAnswered ? 'Answered' : 'Unanswered'})`}
              aria-label={`Question ${idx + 1}, ${isAnswered ? 'Answered' : 'Unanswered'}, ${isCurrent ? 'Current' : ''}`}
            >
              <span>{idx + 1}</span>
              {isAnswered && !isCurrent && (
                <Check className="w-2.5 h-2.5 text-emerald-600 absolute bottom-1 right-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-edge/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-brand-600 border border-brand-700" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center text-[9px] font-bold">
            ✓
          </span>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-canvas border border-edge" />
          <span>Pending</span>
        </div>
      </div>
    </div>
  );
};
