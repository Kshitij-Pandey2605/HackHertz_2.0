import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  selected?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, hoverable = false, selected = false, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-2xl border transition-all duration-200 ${
          selected
            ? 'border-brand-600 ring-2 ring-brand-500/20 shadow-card'
            : 'border-edge shadow-card'
        } ${
          hoverable ? 'hover:shadow-card-hover hover:border-gray-300 cursor-pointer' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
