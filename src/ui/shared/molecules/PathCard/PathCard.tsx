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
      card: 'bg-gradient-to-br from-blue-50 to-green-50 border-blue-200 hover:border-blue-300',
      icon: 'bg-gradient-to-br from-blue-500 to-green-500',
      badge: 'badge-primary',
      text: 'text-blue-700',
      bulletBg: 'bg-blue-600',
      actionBg: 'bg-blue-600/10',
    },
    secondary: {
      card: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300',
      icon: 'bg-gradient-to-br from-purple-500 to-pink-500',
      badge: 'badge-secondary',
      text: 'text-purple-700',
      bulletBg: 'bg-purple-600',
      actionBg: 'bg-purple-600/10',
    },
    accent: {
      card: 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:border-orange-300',
      icon: 'bg-gradient-to-br from-orange-500 to-red-500',
      badge: 'badge-accent',
      text: 'text-orange-700',
      bulletBg: 'bg-orange-600',
      actionBg: 'bg-orange-600/10',
    },
    success: {
      card: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300',
      icon: 'bg-gradient-to-br from-green-500 to-emerald-500',
      badge: 'badge-success',
      text: 'text-green-700',
      bulletBg: 'bg-green-600',
      actionBg: 'bg-green-600/10',
    },
    warning: {
      card: 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-300',
      icon: 'bg-gradient-to-br from-yellow-500 to-amber-500',
      badge: 'badge-warning',
      text: 'text-yellow-700',
      bulletBg: 'bg-yellow-600',
      actionBg: 'bg-yellow-600/10',
    },
    info: {
      card: 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 hover:border-cyan-300',
      icon: 'bg-gradient-to-br from-cyan-500 to-blue-500',
      badge: 'badge-info',
      text: 'text-cyan-700',
      bulletBg: 'bg-cyan-600',
      actionBg: 'bg-cyan-600/10',
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
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center',
              currentColors.text,
              currentColors.actionBg
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
          </div>
        </div>
      </div>
    </div>
  );
}
