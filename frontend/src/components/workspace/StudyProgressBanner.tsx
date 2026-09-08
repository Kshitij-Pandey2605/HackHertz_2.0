import React from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';

export const StudyProgressBanner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const stages = [
    {
      number: '1',
      stage: 'Understand',
      label: 'Quick Glance',
      to: `/workspace/${id}/quick-glance`,
      matches: ['quick-glance', 'deep-summary', 'chapters'],
    },
    {
      number: '2',
      stage: 'Remember',
      label: 'Flashcards',
      to: `/workspace/${id}/flashcards`,
      matches: ['flashcards', 'key-points', 'formulas', 'glossary'],
    },
    {
      number: '3',
      stage: 'Practice',
      label: 'Quiz',
      to: `/workspace/${id}/quiz/setup`,
      matches: ['quiz'],
    },
    {
      number: '4',
      stage: 'Revise',
      label: 'Exam Cram',
      to: `/workspace/${id}/exam-cram`,
      matches: ['exam-cram', 'export'],
    },
  ];

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-edge shadow-subtle mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-ink">Study Journey</p>
          <p className="text-[11px] text-ink-muted">Master your subject in 4 guided steps</p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0">
        {stages.map((st, idx) => {
          const isCurrent = st.matches.some((m) => location.pathname.includes(m));
          return (
            <React.Fragment key={st.stage}>
              <NavLink
                to={st.to}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-sm'
                    : 'text-ink-secondary hover:bg-gray-50'
                }`}
              >
                {isCurrent ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-ink-subtle flex-shrink-0" />
                )}
                <span>
                  <span className="text-[10px] text-ink-muted mr-1 font-normal">{st.number}.</span>
                  {st.stage}
                </span>
              </NavLink>
              {idx < stages.length - 1 && (
                <span className="text-ink-subtle text-xs hidden sm:inline">&rarr;</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
