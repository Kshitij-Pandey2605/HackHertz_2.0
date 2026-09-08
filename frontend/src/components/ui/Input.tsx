import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isPassword = false,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-secondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-ink-muted">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={actualType}
            className={`w-full bg-white text-ink placeholder-ink-subtle text-sm rounded-xl border px-3.5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
              leftIcon ? 'pl-10' : ''
            } ${isPassword || rightIcon ? 'pr-10' : ''} ${
              error ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/20' : 'border-edge'
            } ${className}`}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-ink-muted hover:text-ink focus:outline-none transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : (
            rightIcon && <div className="absolute right-3.5 text-ink-muted">{rightIcon}</div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-ink-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
