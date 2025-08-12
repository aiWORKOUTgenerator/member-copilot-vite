'use client';
import React from 'react';

interface TextAreaProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isValid?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}

/**
 * TextArea component for multi-line text input
 *
 * This component provides a styled textarea input using DaisyUI classes,
 * with support for validation states, character limits, and accessibility features.
 */
export const TextArea: React.FC<TextAreaProps> = ({
  id,
  value,
  onChange,
  placeholder = '',
  isValid = true,
  disabled = false,
  rows = 3,
  maxLength,
  className = '',
}) => {
  return (
    <div className="w-full">
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`textarea textarea-bordered w-full resize-none ${
          !isValid ? 'textarea-error' : ''
        } ${className}`}
        disabled={disabled}
        aria-invalid={!isValid}
        aria-describedby={!isValid ? `${id}-error` : undefined}
      />
      {maxLength && (
        <div className="text-xs text-base-content/60 mt-1 text-right">
          {value.length}/{maxLength} characters
        </div>
      )}
    </div>
  );
};
