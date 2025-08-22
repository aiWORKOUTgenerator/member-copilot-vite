'use client';

import React, { ReactNode } from 'react';

export interface CardBodyProps {
  /** Card body content */
  children: ReactNode;
  /** Padding size - maps to card size variants */
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS classes */
  className?: string;
}

/**
 * CardBody - A component for consistent card content layout
 *
 * This component provides standardized padding and layout for card content.
 * It ensures consistent spacing across all card variants.
 *
 * @example
 * <CardBody>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </CardBody>
 *
 * @example
 * <CardBody padding="lg" className="text-center">
 *   <div>Custom styled content</div>
 * </CardBody>
 */
export const CardBody: React.FC<CardBodyProps> = ({
  children,
  padding = 'md',
  className = '',
}) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-6',
  };

  const bodyClasses = [
    'card-body rounded-lg',
    paddingClasses[padding],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={bodyClasses}>{children}</div>;
};
