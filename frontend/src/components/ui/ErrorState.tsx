import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  fullPage?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while loading this content.',
  retryLabel = 'Try Again',
  onRetry,
  fullPage = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4 text-rose-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink-muted mb-5">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm">
          {retryLabel}
        </Button>
      )}
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
