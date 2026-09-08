import React from 'react';
import { Check, CheckCircle2, HelpCircle, AlignLeft, CheckSquare, Edit3 } from 'lucide-react';
import { QuizQuestion } from '../../types';
import { Badge } from '../ui/Badge';

export interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  onAnswerChange,
}) => {
  const typeBadges = {
    MCQ: { label: 'Multiple Choice', icon: <CheckSquare className="w-3.5 h-3.5" /> },
    TRUE_FALSE: { label: 'True / False', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    FILL_BLANK: { label: 'Fill in the Blank', icon: <Edit3 className="w-3.5 h-3.5" /> },
    SHORT_ANSWER: { label: 'Short Answer', icon: <AlignLeft className="w-3.5 h-3.5" /> },
  };

  const difficultyVariant =
    question.difficulty === 'EASY'
      ? 'success'
      : question.difficulty === 'HARD'
      ? 'violet'
      : 'brand';

  return (
    <div className="bg-white border border-edge rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
      {/* Question metadata header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-edge/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-lg">
            Question {questionNumber} of {totalQuestions}
          </span>
          <Badge variant={difficultyVariant} size="sm">
            {question.difficulty}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5 font-medium text-ink-secondary bg-gray-100 px-2.5 py-1 rounded-lg border border-edge">
            {typeBadges[question.type].icon}
            <span>{typeBadges[question.type].label}</span>
          </span>
          <span>&bull;</span>
          <span className="font-semibold text-ink-secondary">{question.topic}</span>
        </div>
      </div>

      {/* Question Statement */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-ink leading-snug">
          {question.question}
        </h3>
      </div>

      {/* Answer Input depending on type */}
      <div className="pt-2">
        {/* 1. MCQ */}
        {question.type === 'MCQ' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = currentAnswer === option;
              const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onAnswerChange(option)}
                  className={`w-full text-left flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20 shadow-subtle'
                      : 'border-edge bg-white hover:border-gray-300 hover:bg-gray-50/70'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 text-ink-secondary border border-edge'
                    }`}
                  >
                    {optionLetter}
                  </div>
                  <span
                    className={`text-xs sm:text-sm pt-0.5 leading-relaxed ${
                      isSelected ? 'text-brand-950 font-semibold' : 'text-ink'
                    }`}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. TRUE / FALSE */}
        {question.type === 'TRUE_FALSE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['TRUE', 'FALSE'].map((choice) => {
              const isSelected = currentAnswer.toUpperCase() === choice;
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => onAnswerChange(choice)}
                  className={`p-6 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-500/20 shadow-card'
                      : 'border-edge bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 text-ink-muted'
                    }`}
                  >
                    {choice === 'TRUE' ? 'T' : 'F'}
                  </div>
                  <span
                    className={`text-base font-bold tracking-wider ${
                      isSelected ? 'text-brand-950' : 'text-ink'
                    }`}
                  >
                    {choice}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. FILL IN THE BLANK */}
        {question.type === 'FILL_BLANK' && (
          <div className="space-y-2">
            <label
              htmlFor="fill-blank-input"
              className="text-xs font-semibold text-ink-secondary"
            >
              Enter the exact missing word or phrase:
            </label>
            <input
              id="fill-blank-input"
              type="text"
              value={currentAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder={question.placeholder || 'Type your answer here...'}
              className="w-full bg-white text-ink text-sm rounded-xl border border-edge px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder:text-ink-subtle shadow-subtle"
              autoFocus
            />
            <p className="text-[11px] text-ink-muted">
              Tip: Case-insensitive matching is applied automatically.
            </p>
          </div>
        )}

        {/* 4. SHORT ANSWER */}
        {question.type === 'SHORT_ANSWER' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="short-answer-input"
                className="text-xs font-semibold text-ink-secondary"
              >
                Provide a concise technical explanation:
              </label>
              <span className="text-[11px] text-ink-muted">
                {currentAnswer.length} characters (10+ recommended)
              </span>
            </div>
            <textarea
              id="short-answer-input"
              rows={4}
              value={currentAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Explain the key conceptual distinctions, conditions, or properties..."
              className="w-full bg-white text-ink text-sm rounded-xl border border-edge p-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder:text-ink-subtle shadow-subtle leading-relaxed"
            />
            <p className="text-[11px] text-ink-muted">
              Evaluation checks for core technical terminology such as candidate keys, prime attributes, or superkeys.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
