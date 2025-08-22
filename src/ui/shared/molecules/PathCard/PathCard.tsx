import React from 'react';
import { Card, CardBody, colorSchemeUtilities } from '@/ui/shared/atoms/Card';

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
  const currentColors = colorSchemeUtilities[variant];

  return (
    <Card
      variant="path"
      colorScheme={variant}
      isSelected={isSelected}
      onClick={onClick}
      aria-label={`Select ${title} path`}
      aria-describedby={`${variant}-description`}
    >
      <CardBody padding="lg">
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
      </CardBody>
    </Card>
  );
}
