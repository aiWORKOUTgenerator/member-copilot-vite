'use client';

import React from 'react';

export interface ProgressBarProps {
  /** Current progress percentage (0-100) */
  progress: number;
  /** Optional label to display above the progress bar */
  label?: string;
  /** Whether to show the percentage value */
  showPercentage?: boolean;
  /** Size variant of the progress bar */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Color variant of the progress bar */
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'error';
  /** Additional CSS classes */
  className?: string;
  /** Whether to animate progress changes */
  animated?: boolean;
  /** Optional description text below the progress bar */
  description?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * A reusable progress bar component for showing completion status
 *
 * @example
 * ```tsx
 * <ProgressBar
 *   progress={75}
 *   label="Upload Progress"
 *   showPercentage={true}
 *   variant="primary"
 *   size="md"
 * />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'primary',
  className = '',
  animated = true,
  description,
  testId = 'progress-bar',
}) => {
  // Ensure progress is within valid range
  const clampedProgress = Math.max(0, Math.min(100, progress));

  // Size classes
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  // Animation classes
  const animationClasses = animated
    ? 'transition-all duration-300 ease-out'
    : '';

  return (
    <div className={`w-full ${className}`} data-testid={testId}>
      {/* Label and percentage */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-base-content">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-base-content/70">
              {Math.round(clampedProgress)}% Complete
            </span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div className={`w-full bg-base-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-full ${animationClasses}`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || 'Progress'}
        />
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-base-content/60 mt-1">{description}</p>
      )}
    </div>
  );
};
