'use client';

import React, { ReactNode } from 'react';

export interface PageLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  withContainer?: boolean;
  withCard?: boolean;
  bgColor?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  header,
  footer,
  className = '',
  withContainer = true,
  withCard = true,
  bgColor = 'bg-white',
}) => {
  return (
    <div className={`min-h-screen py-section ${bgColor} ${className}`}>
      {withContainer ? (
        <div className="max-w-7xl mx-auto px-4">
          {withCard ? (
            <div className="bg-base-100 shadow-lg rounded-lg">
              <div className="p-6">
                {header && (
                  <>
                    {header}
                    <div className="divider"></div>
                  </>
                )}
                {children}
                {footer && (
                  <>
                    <div className="divider"></div>
                    {footer}
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              {header && (
                <>
                  {header}
                  <div className="divider"></div>
                </>
              )}
              {children}
              {footer && (
                <>
                  <div className="divider"></div>
                  {footer}
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          {header && header}
          {children}
          {footer && footer}
        </>
      )}
    </div>
  );
};
