'use client';

import { FC } from 'react';
import { useAppConfig } from '@/hooks/useConfiguration';

/**
 * IntakeLoadingFallback
 *
 * A loading fallback component that matches the IntakeFullScreenLayout structure.
 * Used as a fallback while contact information is being loaded during intake flows.
 */
export const IntakeLoadingFallback: FC = () => {
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
            <span className="text-base-content/60 text-xs">Loading...</span>
          </div>
        </div>
      </div>

      {/* Main content with loading indicator */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="mx-auto max-w-xl">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center space-y-4">
                <span
                  className="loading loading-ring loading-lg text-primary"
                  aria-label="Loading contact information"
                  role="status"
                ></span>
                <p className="text-base-content/70">
                  Loading your information...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer placeholder */}
      <div className="sticky bottom-0 z-10 bg-base-100/90 backdrop-blur border-t border-base-200">
        <div className="container mx-auto px-4 py-3">
          <div className="mx-auto max-w-xl">
            {/* Empty footer space to maintain layout consistency */}
          </div>
        </div>
      </div>
    </div>
  );
};
