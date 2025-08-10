import React from 'react';

export interface SimpleDetailedViewSelectorProps {
  /** Current view mode */
  value: 'simple' | 'detailed';
  /** Callback when view mode changes */
  onChange: (value: 'simple' | 'detailed') => void;
  /** Custom labels for the toggle options */
  labels?: {
    simple: string;
    detailed: string;
  };
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disable the toggle */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SimpleDetailedViewSelector - A toggle component for switching between simple and detailed view modes
 *
 * This component provides a user-friendly way to switch between different presentation modes
 * for content that supports both simple and detailed views. Uses a unified tab-style design
 * with smooth transitions and clear visual hierarchy.
 *
 * @example
 * // Basic usage
 * <SimpleDetailedViewSelector
 *   value={viewMode}
 *   onChange={setViewMode}
 * />
 *
 * @example
 * // Custom labels and size
 * <SimpleDetailedViewSelector
 *   value={viewMode}
 *   onChange={setViewMode}
 *   labels={{ simple: 'Quick', detailed: 'Full' }}
 *   size="sm"
 * />
 *
 * @example
 * // Disabled state
 * <SimpleDetailedViewSelector
 *   value={viewMode}
 *   onChange={setViewMode}
 *   disabled={isLoading}
 * />
 */
export function SimpleDetailedViewSelector({
  value,
  onChange,
  labels = { simple: 'Simple', detailed: 'Detailed' },
  size = 'md',
  disabled = false,
  className = '',
}: SimpleDetailedViewSelectorProps) {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  const handleSimpleClick = () => {
    if (!disabled && value !== 'simple') {
      onChange('simple');
    }
  };

  const handleDetailedClick = () => {
    if (!disabled && value !== 'detailed') {
      onChange('detailed');
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
    targetValue: 'simple' | 'detailed'
  ) => {
    if (disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (value !== targetValue) {
        onChange(targetValue);
      }
    }
  };

  return (
    <div
      className={`inline-flex bg-base-200 rounded-lg p-1 ${disabled ? 'opacity-50' : ''} ${className}`}
      role="group"
      aria-label="View mode selector"
    >
      <button
        type="button"
        className={`${sizeClasses[size]} font-medium rounded-md transition-all duration-200 ${
          value === 'simple'
            ? 'bg-base-100 text-base-content shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
        }`}
        onClick={handleSimpleClick}
        onKeyDown={(e) => handleKeyDown(e, 'simple')}
        disabled={disabled}
        aria-pressed={value === 'simple'}
        aria-label={`${labels.simple} view`}
      >
        {labels.simple}
      </button>
      <button
        type="button"
        className={`${sizeClasses[size]} font-medium rounded-md transition-all duration-200 ${
          value === 'detailed'
            ? 'bg-base-100 text-base-content shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
        }`}
        onClick={handleDetailedClick}
        onKeyDown={(e) => handleKeyDown(e, 'detailed')}
        disabled={disabled}
        aria-pressed={value === 'detailed'}
        aria-label={`${labels.detailed} view`}
      >
        {labels.detailed}
      </button>
    </div>
  );
}
