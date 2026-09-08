import React from 'react';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  size = 'md',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-ink-muted mb-1.5">
          <span>Progress</span>
          <span className="text-ink font-semibold">{clamped}%</span>
        </div>
      )}
      <div
        className={`w-full bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-violet-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
