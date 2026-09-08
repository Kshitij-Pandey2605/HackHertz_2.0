import React from 'react';
import { CheckCircle2, Loader2, Circle, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { ProcessingJob } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';

export interface ProcessingStepsProps {
  job: ProcessingJob;
  onOpenWorkspace: () => void;
}

export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({
  job,
  onOpenWorkspace,
}) => {
  const isComplete = job.status === 'completed';

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-edge shadow-card p-6 sm:p-8">
      {/* File badge & header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-edge">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-ink truncate max-w-xs sm:max-w-sm">
              {job.fileName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-ink-muted mt-0.5">
              {job.pageCount && <span>{job.pageCount} pages</span>}
              <span>&bull;</span>
              <span className="font-medium text-brand-600 uppercase text-[10px] tracking-wider bg-brand-50 px-1.5 py-0.2 rounded border border-brand-100">
                {job.difficulty} LEVEL
              </span>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-full">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing
            </span>
          )}
        </div>
      </div>

      {/* Progress section */}
      <div className="py-6 border-b border-edge">
        <div className="flex items-center justify-between text-xs font-medium text-ink-muted mb-2">
          <span>Transformation Progress</span>
          <span className="text-brand-600 font-bold">{job.progress}%</span>
        </div>
        <ProgressBar progress={job.progress} size="md" />

        <p className="text-xs text-ink-muted mt-3 text-center italic">
          {isComplete
            ? 'Your personalized study material has been generated.'
            : 'PreMind AI is turning your document into a focused study workspace.'}
        </p>
      </div>

      {/* Steps checklist */}
      <div className="py-6 space-y-4">
        {job.steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isCurrent = step.status === 'in_progress';
          const isPending = step.status === 'pending';

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3.5 p-3 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-brand-50/70 border border-brand-200'
                  : isDone
                  ? 'bg-emerald-50/30'
                  : 'opacity-50'
              }`}
            >
              {/* Icon */}
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-sm font-semibold ${
                      isDone
                        ? 'text-ink line-through decoration-emerald-600/60 decoration-2'
                        : isCurrent
                        ? 'text-brand-900'
                        : 'text-ink-muted'
                    }`}
                  >
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider bg-white px-2 py-0.5 rounded shadow-subtle border border-brand-200">
                      Step {idx + 1} of {job.steps.length}
                    </span>
                  )}
                </div>
                {step.description && (
                  <p
                    className={`text-xs mt-0.5 ${
                      isCurrent ? 'text-brand-700' : 'text-ink-muted'
                    }`}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion CTA */}
      {isComplete && (
        <div className="pt-6 border-t border-edge text-center animate-fadeIn">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-ink mb-1">
            Your study workspace is ready.
          </h4>
          <p className="text-xs text-ink-muted max-w-sm mx-auto mb-5">
            Summaries, formulas, flashcards, and quizzes have been generated and structured for maximum retention.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="w-full shadow-elevated"
            onClick={onOpenWorkspace}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Open Study Workspace
          </Button>
        </div>
      )}
    </div>
  );
};
