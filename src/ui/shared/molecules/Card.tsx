'use client';

import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  footer,
}) => {
  return (
    <div className={`card bg-base-100 shadow-lg ${className}`}>
      <div className="card-body">
        {title && (
          <h2 className="card-title text-2xl font-bold text-center mb-1">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-center text-base-content/70 mb-6">{subtitle}</p>
        )}
        {children}
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  );
};
