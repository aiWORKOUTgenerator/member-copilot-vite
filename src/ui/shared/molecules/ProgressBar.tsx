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
 *   label="Overall Progress"
 *   showPercentage={true}
 *   size="md"
 *   variant="primary"
 *   animated={true}
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
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  // Size classes for the progress bar height
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  // Variant classes for the progress bar color
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <div className={`progress-bar-container ${className}`} data-testid={testId}>
      {/* Label and percentage row */}
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

      {/* Progress bar track */}
      <div
        className={`w-full bg-base-200 rounded-full ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progress: ${Math.round(clampedProgress)}%`}
      >
        {/* Progress bar fill */}
        <div
          className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-full ${
            animated ? 'transition-all duration-300 ease-out' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
          data-testid={`${testId}-fill`}
        />
      </div>

      {/* Optional description */}
      {description && (
        <p className="text-xs text-base-content/60 mt-1">{description}</p>
      )}
    </div>
  );
};
