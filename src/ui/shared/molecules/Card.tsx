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
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-base-200/20 via-base-100/10 to-base-200/5 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group ${className}`}
    >
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-50"></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl"></div>

      <div className="relative z-10 p-6">
        {title && (
          <h2 className="text-2xl font-bold text-center mb-1 group-hover:text-primary transition-colors duration-200">
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
