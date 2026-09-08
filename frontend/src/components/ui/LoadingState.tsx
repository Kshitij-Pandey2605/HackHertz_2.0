import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  title?: string;
  description?: string;
  fullPage?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Loading...',
  description = 'Please wait while we prepare your information.',
  fullPage = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-4 text-brand-600">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink-muted">{description}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center w-full">
        {content}
      </div>
    );
  }

  return content;
};
