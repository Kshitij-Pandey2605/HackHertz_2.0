import React from 'react';
import { Check, Sparkles, BookOpen, Flame } from 'lucide-react';
import { DifficultyLevel } from '../../types';

export interface DifficultySelectorProps {
  selectedLevel: DifficultyLevel;
  onSelectLevel: (level: DifficultyLevel) => void;
}

interface LevelOption {
  id: DifficultyLevel;
  title: string;
  badge: string;
  icon: React.ReactNode;
  tagline: string;
  bullets: string[];
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedLevel,
  onSelectLevel,
}) => {
  const levels: LevelOption[] = [
    {
      id: 'EASY',
      title: 'Foundational',
      badge: 'Easy',
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      tagline: 'Ideal for quick overviews & beginners',
      bullets: [
        'Simple, plain-English explanations',
        'Core foundational definitions & analogies',
        'Basic recall questions & introductory flashcards',
      ],
    },
    {
      id: 'MEDIUM',
      title: 'Exam-Oriented',
      badge: 'Medium (Recommended)',
      icon: <Sparkles className="w-5 h-5 text-brand-600" />,
      tagline: 'Balanced syllabus coverage for college exams',
      bullets: [
        'Structured exam-focused breakdowns',
        'Moderate application problems & key theorems',
        'Balanced technical depth & formula sheets',
      ],
    },
    {
      id: 'HARD',
      title: 'Deep Mastery',
      badge: 'Hard',
      icon: <Flame className="w-5 h-5 text-purple-600" />,
      tagline: 'High-rigor preparation for competitive tests',
      bullets: [
        'Full mathematical rigor & edge-case proofs',
        'Tricky distinctions & conceptual corner-cases',
        'Challenging multi-step diagnostic questions',
      ],
    },
  ];

  return (
    <div className="w-full space-y-3">
      <div>
        <h3 className="text-base font-semibold text-ink flex items-center gap-2">
          Choose Your Learning Level
        </h3>
        <p className="text-xs text-ink-muted mt-0.5">
          PreMind AI tailors summary depth, formula breakdowns, and quiz difficulty to your target goal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {levels.map((level) => {
          const isSelected = selectedLevel === level.id;

          return (
            <div
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              className={`relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer bg-white ${
                isSelected
                  ? 'border-brand-600 ring-2 ring-brand-500/20 shadow-card'
                  : 'border-edge hover:border-gray-300 hover:shadow-subtle'
              }`}
            >
              {/* Header badge & checkmark */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gray-50 border border-edge">
                      {level.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-ink">{level.title}</h4>
                      <span className="text-[11px] font-semibold text-brand-600">
                        {level.badge}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : 'border-edge bg-gray-50 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>

                <p className="text-xs text-ink-secondary font-medium mb-3">
                  {level.tagline}
                </p>

                {/* Bullets */}
                <ul className="space-y-1.5 pt-2 border-t border-edge/60">
                  {level.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px] text-ink-muted leading-tight">
                      <span className="text-brand-500 font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
