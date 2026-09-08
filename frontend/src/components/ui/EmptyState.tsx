import React from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-10 text-center max-w-md mx-auto border-2 border-dashed border-edge rounded-2xl bg-white/50 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-edge flex items-center justify-center mb-4 text-ink-muted">
        {icon || <BookOpen className="w-6 h-6 text-brand-600" />}
      </div>
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink-muted mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
