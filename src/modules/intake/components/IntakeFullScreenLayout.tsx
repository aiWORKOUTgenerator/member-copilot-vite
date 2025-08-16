'use client';

import { ReactNode } from 'react';
import { useAppConfig } from '@/hooks/useConfiguration';

interface IntakeFullScreenLayoutProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function IntakeFullScreenLayout({
  title,
  children,
  footer,
}: IntakeFullScreenLayoutProps) {
  const appConfig = useAppConfig();

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-base-100/90 backdrop-blur border-b border-base-200">
        <div className="navbar container mx-auto px-4">
          <div className="flex-1 items-center gap-3 py-2">
            {appConfig?.logoUrl && (
              <img
                src={appConfig.logoUrl}
                alt="Brand Logo"
                className="h-8 w-auto"
              />
            )}
          </div>
          <div className="flex-none">
            <span className="text-base-content/60 text-xs">{title}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="mx-auto max-w-xl">{children}</div>
        </div>
      </main>

      {/* Footer */}
      <div className="sticky bottom-0 z-10 bg-base-100/90 backdrop-blur border-t border-base-200">
        <div className="container mx-auto px-4 py-3">
          <div className="mx-auto max-w-xl">{footer}</div>
        </div>
      </div>
    </div>
  );
}
