import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';

export const StudyProgressBanner: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const steps = [
    { label: 'Quick Glance', to: `/workspace/${id}/quick-glance`, stepKey: 'quick-glance' },
    { label: 'Deep Summary', to: `/workspace/${id}/deep-summary`, stepKey: 'deep-summary' },
    { label: 'Exam Cram', to: `/workspace/${id}/exam-cram`, stepKey: 'exam-cram' },
    { label: 'Flashcards', to: `/workspace/${id}/flashcards`, stepKey: 'flashcards' },
    { label: 'Quiz', to: `/workspace/${id}/quiz/setup`, stepKey: 'quiz' },
  ];

  return (
    <div className="p-4 rounded-2xl bg-white border border-edge shadow-subtle mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <div>
          <p className="text-xs font-bold text-ink">Your study material is ready</p>
          <p className="text-[11px] text-ink-muted">Progress through each module to build complete subject mastery.</p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0">
        {steps.map((step, idx) => (
          <React.Fragment key={step.stepKey}>
            <NavLink
              to={step.to}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 border border-brand-200'
                    : 'text-ink-secondary hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-ink-subtle" />
                  )}
                  <span>{step.label}</span>
                </>
              )}
            </NavLink>
            {idx < steps.length - 1 && (
              <span className="text-ink-subtle text-xs hidden sm:inline">&rarr;</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
