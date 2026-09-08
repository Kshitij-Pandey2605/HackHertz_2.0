import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Sparkles } from 'lucide-react';

export interface GradingOverlayProps {
  isOpen: boolean;
}

export const GradingOverlay: React.FC<GradingOverlayProps> = ({ isOpen }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    const t1 = setTimeout(() => setStep(1), 300);
    const t2 = setTimeout(() => setStep(2), 650);
    const t3 = setTimeout(() => setStep(3), 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-2xl border border-edge shadow-elevated p-8 max-w-md w-full text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mx-auto shadow-subtle">
          <Sparkles className="w-7 h-7 animate-pulse" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-ink">Reviewing your answers...</h3>
          <p className="text-xs text-ink-muted mt-1">
            PreMind AI is checking your responses against syllabus benchmarks.
          </p>
        </div>

        <div className="space-y-3 text-left max-w-xs mx-auto text-xs">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-edge/60">
            {step >= 1 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <Loader2 className="w-4 h-4 text-brand-600 animate-spin flex-shrink-0" />
            )}
            <span className={step >= 1 ? 'text-ink font-medium' : 'text-ink-muted'}>
              Checking responses
            </span>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-edge/60">
            {step >= 2 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <Loader2
                className={`w-4 h-4 flex-shrink-0 ${
                  step === 1 ? 'text-brand-600 animate-spin' : 'text-gray-300'
                }`}
              />
            )}
            <span className={step >= 2 ? 'text-ink font-medium' : 'text-ink-muted'}>
              Evaluating answers
            </span>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-edge/60">
            {step >= 3 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <Loader2
                className={`w-4 h-4 flex-shrink-0 ${
                  step === 2 ? 'text-brand-600 animate-spin' : 'text-gray-300'
                }`}
              />
            )}
            <span className={step >= 3 ? 'text-ink font-medium' : 'text-ink-muted'}>
              Preparing your diagnostic results
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
