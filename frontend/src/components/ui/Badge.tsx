import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'success' | 'warning' | 'error' | 'neutral' | 'violet';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const variants = {
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    violet: 'bg-purple-50 text-purple-700 border-purple-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-gray-100 text-ink-secondary border-gray-200',
  };

  const sizes = {
    sm: 'text-[11px] font-medium px-2 py-0.5 rounded-md border',
    md: 'text-xs font-medium px-2.5 py-1 rounded-lg border',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 leading-none select-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
