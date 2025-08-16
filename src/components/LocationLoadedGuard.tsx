import { ReactNode } from 'react';
import { useLocation } from '@/hooks/useLocation';
import { useAuth } from '@/hooks/auth';

interface LocationLoadedGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * LocationLoadedGuard ensures that location data is loaded before rendering children.
 * Wrap this around components that require location data to be available.
 */
export function LocationLoadedGuard({
  children,
  fallback,
}: LocationLoadedGuardProps) {
  const { isLoaded, isLoading } = useLocation();
  const { isSignedIn } = useAuth();

  // If signed in but locations aren't loaded yet, show loading state
  if (isSignedIn && !isLoaded && isLoading) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2">Loading locations...</p>
        </div>
      </div>
    );
  }

  // Locations are loaded or there was an error loading, render children
  return <>{children}</>;
}
