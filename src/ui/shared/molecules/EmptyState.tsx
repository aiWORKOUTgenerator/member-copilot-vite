'use client';

import { FolderPlus } from 'lucide-react';
import React from 'react';

interface EmptyStateBasicProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  className?: string;
}

/**
 * A reusable empty state component that displays an icon, title, description and optional action button
 */
export default function EmptyStateBasic({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}: EmptyStateBasicProps) {
  const defaultIcon = (
    <FolderPlus
      className="mx-auto size-12 text-base-content/40"
      strokeWidth={2}
      aria-hidden="true"
    />
  );

  return (
    <div className={`text-center ${className} flex flex-col items-center`}>
      {icon || defaultIcon}
      <h3 className="mt-2 text-md font-semibold text-primary">{title}</h3>
      <p className="mt-1 text-md text-primary/50">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-content shadow-xs hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {actionIcon}
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
