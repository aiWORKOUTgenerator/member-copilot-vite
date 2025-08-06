'use client';

import { ReactNode } from 'react';

interface NewBadgeProps {
  /**
   * Whether to show the badge
   */
  visible?: boolean;

  /**
   * Position of the badge relative to its container
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /**
   * Custom badge content (defaults to "NEW")
   */
  children?: ReactNode;

  /**
   * Badge color variant
   */
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'error';

  /**
   * Additional CSS classes
   */
  className?: string;
}

export function NewBadge({
  visible = true,
  position = 'top-right',
  children = 'NEW',
  variant = 'accent',
  className = '',
}: NewBadgeProps) {
  if (!visible) return null;

  const getPositionClasses = (pos: string) => {
    switch (pos) {
      case 'top-right':
        return 'top-0 -right-1 translate-x-1/2 -translate-y-1/2';
      case 'top-left':
        return 'top-0 -left-1 -translate-x-1/2 -translate-y-1/2';
      case 'bottom-right':
        return 'bottom-0 -right-1 translate-x-1/2 translate-y-1/2';
      case 'bottom-left':
        return 'bottom-0 -left-1 -translate-x-1/2 translate-y-1/2';
      default:
        return 'top-0 -right-1 translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <div
      className={`
        absolute z-10 
        ${getPositionClasses(position)}
        badge badge-${variant} 
        text-xs font-bold 
        shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
}
