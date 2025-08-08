/**
 * Standardized React Components for Customization System
 *
 * This module contains reusable React components that eliminate duplication
 * across workout customization components.
 */

import React from 'react';

// ============================================================================
// REACT COMPONENT UTILITIES
// ============================================================================

/**
 * Standardized error display component for all customization components
 * Replaces all instances of manual error display patterns
 */
export const ErrorDisplay: React.FC<{
  error?: string;
  id?: string;
  className?: string;
}> = ({ error, id, className = '' }) => {
  if (!error) return null;

  return (
    <p className={`validator-hint mt-2 ${className}`} role="alert" id={id}>
      {error}
    </p>
  );
};

/**
 * Standardized selection summary component for displaying selected items
 * Provides consistent styling and count display across all components
 */
export const SelectionSummary: React.FC<{
  title: string;
  count: number;
  children: React.ReactNode;
  className?: string;
}> = ({ title, count, children, className = '' }) => {
  if (count === 0) return null;

  return (
    <div className={`mt-4 ${className}`}>
      <p className="text-xs text-base-content/60 mb-2">
        {title} ({count}):
      </p>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
};

/**
 * Standardized validation display component for warnings and errors
 * Provides consistent styling for validation messages across components
 */
export const ValidationDisplay: React.FC<{
  validation?: {
    warnings?: string[];
    errors?: string[];
    recommendations?: string[];
  };
}> = ({ validation }) => {
  if (
    !validation ||
    (!validation.warnings?.length &&
      !validation.errors?.length &&
      !validation.recommendations?.length)
  ) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      {/* Warnings */}
      {validation.warnings && validation.warnings.length > 0 && (
        <div className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.982-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <div className="font-medium">Configuration Suggestions:</div>
            {validation.warnings.map((warning, index) => (
              <div key={index} className="text-sm mt-1">
                • {warning}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Errors */}
      {validation.errors && validation.errors.length > 0 && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <div className="font-medium">Configuration Issues:</div>
            {validation.errors.map((error, index) => (
              <div key={index} className="text-sm mt-1">
                • {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations (displayed as info alerts) */}
      {validation.recommendations && validation.recommendations.length > 0 && (
        <div className="mt-4 space-y-2">
          {validation.recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm text-info"
            >
              <span>💡</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Standardized loading state component for customization components
 * Provides consistent loading UI across all components
 */
export const LoadingState: React.FC<{
  message?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}> = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <span className={`loading loading-spinner ${sizeClasses[size]}`}></span>
        <p className="text-sm text-base-content/60 mt-2">{message}</p>
      </div>
    </div>
  );
};

/**
 * Standardized empty state component for when no selections are made
 * Provides consistent empty state UI across all components
 */
export const EmptyState: React.FC<{
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}> = ({ title, description, icon, actionButton }) => {
  return (
    <div className="text-center py-8">
      {icon && (
        <div className="flex justify-center mb-4 text-base-content/40">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-base-content/80 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-base-content/60 mb-4 max-w-md mx-auto">
          {description}
        </p>
      )}
      {actionButton && <div className="mt-4">{actionButton}</div>}
    </div>
  );
};

/**
 * Standardized section header component for customization sections
 * Provides consistent styling for section headers
 */
export const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  badge?: string;
  rightElement?: React.ReactNode;
}> = ({ title, subtitle, badge, rightElement }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {badge && (
            <span className="badge badge-primary badge-sm">{badge}</span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-base-content/60 mt-1">{subtitle}</p>
        )}
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};
