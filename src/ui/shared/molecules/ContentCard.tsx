'use client';

import React, { ReactNode } from 'react';

interface ContentCardProps {
  /** Optional additional classes to customize the container */
  className?: string;
  /** Card contents */
  children: ReactNode;
}

/**
 * A consistent content wrapper for page sections using DaisyUI and Tailwind.
 * Mobile-first minimal padding with full rounding on larger screens.
 */
export const ContentCard: React.FC<ContentCardProps> = ({
  className = '',
  children,
}) => {
  return (
    <div
      className={`p-1 sm:p-6 bg-base-100 rounded-box space-y-4 ${className}`}
    >
      {children}
    </div>
  );
};
