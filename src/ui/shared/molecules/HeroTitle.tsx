import React from 'react';

export interface HeroTitleProps {
  /** The main title text */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Background color variant */
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'neutral';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Subtitle text size (overrides size variant) */
  subtitleSize?: 'xs' | 'sm' | 'base' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the hero container background */
  showBackground?: boolean;
  /** Optional badge or indicator */
  badge?: React.ReactNode;
}

/**
 * HeroTitle - A reusable hero title component with flexible styling options
 *
 * This component provides consistent title presentation across the application
 * with support for different alignments, sizes, and styling variants.
 *
 * @example
 * // Basic left-aligned title
 * <HeroTitle
 *   title="How long do you want your workout to be?"
 *   subtitle="Choose a duration that fits your schedule"
 *   icon={Clock}
 *   align="left"
 * />
 *
 * @example
 * // Centered primary variant
 * <HeroTitle
 *   title="Welcome to AI Workout"
 *   subtitle="Your personalized fitness journey starts here"
 *   variant="primary"
 *   align="center"
 *   size="lg"
 * />
 *
 * @example
 * // With badge indicator
 * <HeroTitle
 *   title="Workout Duration"
 *   icon={Target}
 *   badge={<Badge>Required</Badge>}
 *   align="left"
 * />
 */
export const HeroTitle: React.FC<HeroTitleProps> = ({
  title,
  subtitle,
  icon: Icon,
  align = 'left',
  variant = 'default',
  size = 'md',
  subtitleSize,
  className = '',
  showBackground = true,
  badge,
}) => {
  // Size variants
  const sizeClasses = {
    sm: {
      title: 'text-lg font-semibold',
      subtitle: 'text-sm',
      icon: 'w-4 h-4',
      container: 'p-4',
    },
    md: {
      title: 'text-xl font-bold',
      subtitle: 'text-base',
      icon: 'w-5 h-5',
      container: 'p-6',
    },
    lg: {
      title: 'text-2xl font-bold',
      subtitle: 'text-lg',
      icon: 'w-6 h-6',
      container: 'p-8',
    },
  };

  // Subtitle size mapping
  const subtitleSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  };

  // Background variants
  const backgroundClasses = {
    default: 'bg-base-200',
    primary: 'bg-primary text-primary-content',
    secondary: 'bg-secondary text-secondary-content',
    accent: 'bg-accent text-accent-content',
    neutral: 'bg-neutral text-neutral-content',
  };

  // Alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const currentSize = sizeClasses[size];
  const currentBackground = backgroundClasses[variant];
  const currentAlign = alignClasses[align];

  // Use custom subtitle size if provided, otherwise use size variant default
  const subtitleClass = subtitleSize
    ? subtitleSizeClasses[subtitleSize]
    : currentSize.subtitle;

  const content = (
    <div className={`${currentAlign} ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className={currentSize.icon} />}
        <span className={currentSize.title}>{title}</span>
        {badge && <span className="ml-2">{badge}</span>}
      </div>
      {subtitle && <p className={`${subtitleClass} opacity-80`}>{subtitle}</p>}
    </div>
  );

  if (!showBackground) {
    return (
      <div className={`${currentAlign} ${currentSize.container} ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div
      className={`${currentBackground} rounded-box mb-6 ${currentSize.container}`}
    >
      {content}
    </div>
  );
};
