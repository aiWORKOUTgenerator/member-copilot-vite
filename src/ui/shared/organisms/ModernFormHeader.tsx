import { ReactNode } from 'react';

export interface ModernFormHeaderProps {
  /** Main title for the form */
  title: string;
  /** Subtitle/description text */
  subtitle?: string;
  /** Icon component to display */
  icon?: ReactNode;
  /** Overall progress percentage (0-100) */
  progress?: number;
  /** Number of completed fields */
  completedFields?: number;
  /** Total number of fields */
  totalFields?: number;
  /** Auto-advance toggle state */
  autoAdvanceEnabled?: boolean;
  /** Auto-advance toggle change handler */
  onAutoAdvanceChange?: (enabled: boolean) => void;
  /** Auto-advance toggle disabled state */
  autoAdvanceDisabled?: boolean;
  /** View mode toggle (e.g., Simple/Detailed) */
  viewMode?: {
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
  };
  /** Step navigation configuration */
  steps?: Array<{
    id: string;
    label: string;
    description?: string;
    isActive: boolean;
    isCompleted?: boolean;
  }>;
  /** Additional content to render in the header */
  children?: ReactNode;
  /** Custom CSS classes for the container */
  className?: string;
}

/**
 * ModernFormHeader - A reusable header component with glass morphism design
 *
 * Features:
 * - Glass morphism background with animated elements
 * - Progress tracking with gradient progress bar
 * - Auto-advance toggle functionality
 * - View mode switching (Simple/Detailed)
 * - Step navigation with visual indicators
 * - Responsive design with modern styling
 *
 * Used across multiple forms for consistent modern design.
 */
export const ModernFormHeader: React.FC<ModernFormHeaderProps> = ({
  title,
  subtitle,
  icon,
  progress = 0,
  completedFields = 0,
  totalFields = 0,
  autoAdvanceEnabled = false,
  onAutoAdvanceChange,
  autoAdvanceDisabled = false,
  viewMode,
  steps = [],
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-sm border border-white/20 shadow-2xl shadow-primary/20 mb-8 ${className}`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-xl"></div>

      <div className="relative z-10 p-8">
        {/* Header Section with Enhanced Typography */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform duration-200">
                {icon}
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-accent/80 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-base-content to-base-content/80 bg-clip-text text-transparent">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-base-content/70 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {/* View Mode Toggle */}
          {viewMode && (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
              {viewMode.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    viewMode.value === option.value
                      ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30 transform scale-105'
                      : 'text-base-content/70 hover:text-base-content hover:bg-white/5'
                  }`}
                  onClick={() => viewMode.onChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Progress and Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Progress Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-base-content">
                Overall Progress
              </h4>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {Math.round(progress)}%
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-primary/80 to-accent rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm text-base-content/70 mt-2">
                {completedFields} of {totalFields} required fields completed
              </p>
            </div>
          </div>

          {/* Auto-advance Toggle Card */}
          {onAutoAdvanceChange && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-base-content mb-1">
                    Auto-advance
                  </h4>
                  <p className="text-sm text-base-content/70">
                    Automatically move to next step
                  </p>
                </div>
                <div className="form-control">
                  <label
                    className="label cursor-pointer"
                    htmlFor="auto-advance-toggle"
                  >
                    <input
                      id="auto-advance-toggle"
                      type="checkbox"
                      className="toggle toggle-primary toggle-lg"
                      checked={autoAdvanceEnabled}
                      disabled={autoAdvanceDisabled}
                      onChange={(e) => onAutoAdvanceChange?.(e.target.checked)}
                      aria-label="Auto-advance"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step Navigation */}
        {steps.length > 0 && (
          <div className="relative">
            <div className="flex items-center justify-evenly">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      step.isActive
                        ? 'bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30 transform scale-110'
                        : 'bg-white/20 border border-white/30'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span
                        className={`text-sm font-bold ${
                          step.isActive ? 'text-white' : 'text-base-content/70'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>
                    {step.isActive && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-accent/80 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <h5
                      className={`font-semibold ${
                        step.isActive
                          ? 'text-base-content'
                          : 'text-base-content/70'
                      }`}
                    >
                      {step.label}
                    </h5>
                    {step.description && (
                      <p className="text-xs text-base-content/60 mt-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Content */}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
};
