'use client';

import React, { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center md:justify-between mb-6 ${className}`}
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-base-content/70">{subtitle}</p>}
      </div>

      {actions && (
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
};
