'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      error,
      helperText,
      fullWidth = true,
      disabled,
      isLoading,
      id,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if one isn't provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = !!error;
    const isDisabled = disabled || isLoading;

    return (
      <div className={`form-control ${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="label">
            <span className="label-text font-medium">{label}</span>
          </label>
        )}
        <div className="relative">
          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <span className="loading loading-spinner loading-sm"></span>
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={isDisabled}
            className={`
              input input-bordered w-full 
              ${hasError ? 'input-error' : ''} 
              ${isLoading ? 'pr-10' : ''}
            `}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />
        </div>
        {hasError && (
          <div className="label">
            <span
              className="label-text-alt text-error"
              id={`${inputId}-error`}
              role="alert"
            >
              {error}
            </span>
          </div>
        )}
        {helperText && !hasError && (
          <div className="label">
            <span
              className="label-text-alt text-base-content/70"
              id={`${inputId}-helper`}
            >
              {helperText}
            </span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
