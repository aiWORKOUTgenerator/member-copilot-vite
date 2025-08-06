'use client';

import React, { ReactNode } from 'react';

export interface InfoCardProps {
  title: string;
  children: ReactNode;
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  variant = 'default',
  className = '',
}) => {
  // Map variants to background colors
  const bgColorMap = {
    default: 'bg-base-200',
    primary: 'bg-primary bg-opacity-10',
    secondary: 'bg-secondary bg-opacity-10',
    accent: 'bg-accent bg-opacity-10',
    info: 'bg-info bg-opacity-10',
    success: 'bg-success bg-opacity-10',
    warning: 'bg-warning bg-opacity-10',
    error: 'bg-error bg-opacity-10',
  };

  // Map variants to border colors (optional)
  const borderColorMap = {
    default: 'border-base-300',
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent',
    info: 'border-info',
    success: 'border-success',
    warning: 'border-warning',
    error: 'border-error',
  };

  return (
    <div
      className={`card ${bgColorMap[variant]} border ${borderColorMap[variant]} ${className}`}
    >
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
};
