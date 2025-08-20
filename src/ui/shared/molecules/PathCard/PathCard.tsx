import React from 'react';

// Utility function for conditional className concatenation
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface PathCardProps {
  title: string;
  description: string;
  features: string[];
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info';
  onClick: () => void;
  isSelected?: boolean;
}

/**
 * PathCard - A generic selectable card component for path selection
 *
 * This component provides a visually appealing, accessible card interface for
 * selecting between different paths (workouts, nutrition, services, etc.).
 * It includes proper keyboard navigation, ARIA labels, and visual feedback.
 *
 * @example
 * <PathCard
 *   title="Quick Setup"
 *   description="Get started in minutes"
 *   features={['Fast setup', 'AI recommendations']}
 *   badge="Beginner"
 *   icon={Zap}
 *   variant="primary"
 *   onClick={() => handlePathSelect('quick')}
 * />
 */
export function PathCard({
  title,
  description,
  features,
  badge,
  icon: Icon,
  variant,
  onClick,
  isSelected = false,
}: PathCardProps) {
  const colorClasses = {
    primary: {
      card: 'bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30 hover:border-primary/40 bg-base-100',
      icon: 'bg-gradient-to-br from-primary to-primary-focus',
      badge: 'badge-primary',
      text: 'text-primary',
      bulletBg: 'bg-primary',
      actionBg: 'bg-primary/20',
    },
    secondary: {
      card: 'bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30 hover:border-secondary/40 bg-base-100',
      icon: 'bg-gradient-to-br from-secondary to-secondary-focus',
      badge: 'badge-secondary',
      text: 'text-secondary',
      bulletBg: 'bg-secondary',
      actionBg: 'bg-secondary/20',
    },
    accent: {
      card: 'bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30 hover:border-accent/40 bg-base-100',
      icon: 'bg-gradient-to-br from-accent to-accent-focus',
      badge: 'badge-accent',
      text: 'text-accent',
      bulletBg: 'bg-accent',
      actionBg: 'bg-accent/20',
    },
    success: {
      card: 'bg-gradient-to-br from-success/20 to-success/10 border-success/30 hover:border-success/40 bg-base-100',
      icon: 'bg-gradient-to-br from-success to-success-focus',
      badge: 'badge-success',
      text: 'text-success',
      bulletBg: 'bg-success',
      actionBg: 'bg-success/20',
    },
    warning: {
      card: 'bg-gradient-to-br from-warning/20 to-warning/10 border-warning/30 hover:border-warning/40 bg-base-100',
      icon: 'bg-gradient-to-br from-warning to-warning-focus',
      badge: 'badge-warning',
      text: 'text-warning',
      bulletBg: 'bg-warning',
      actionBg: 'bg-warning/20',
    },
    info: {
      card: 'bg-gradient-to-br from-info/20 to-info/10 border-info/30 hover:border-info/40 bg-base-100',
      icon: 'bg-gradient-to-br from-info to-info-focus',
      badge: 'badge-info',
      text: 'text-info',
      bulletBg: 'bg-info',
      actionBg: 'bg-info/20',
    },
  };

  const currentColors = colorClasses[variant];

  // Use utility function for cleaner className construction
  const cardClassName = cn(
    'card shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border-2',
    currentColors.card,
    isSelected && 'ring-2 ring-primary'
  );

  return (
    <div
      className={cardClassName}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Select ${title} path`}
      aria-describedby={`${variant}-description`}
    >
      <div className="card-body p-6">
        {/* Header with Icon and Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className={cn('p-3 rounded-lg shadow-md', currentColors.icon)}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-base-content mb-2">
              {title}
            </h3>
            {badge && (
              <div className={cn('badge badge-sm', currentColors.badge)}>
                {badge}
              </div>
            )}
          </div>
        </div>

        {/* Description with ARIA ID */}
        <p
          id={`${variant}-description`}
          className="text-base-content/70 mb-6 leading-relaxed"
        >
          {description}
        </p>

        {/* Features List */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={cn('w-2 h-2 rounded-full', currentColors.bulletBg)}
              ></div>
              <span className="text-sm text-base-content/80">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Indicator */}
        <div className="flex justify-end">
          <button
            className={cn(
              'btn btn-primary btn-active w-8 h-8 rounded-full flex items-center justify-center p-0'
            )}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
