import { ReactNode } from 'react';
import { useContact } from '@/hooks/useContact';
import { useAuth } from '@/hooks/auth';

interface ContactLoadedGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ContactLoadedGuard ensures that contact data is loaded before rendering children.
 * Wrap this around components that require contact data to be available.
 */
export function ContactLoadedGuard({
  children,
  fallback,
}: ContactLoadedGuardProps) {
  const { isLoaded, isLoading } = useContact();
  const { isSignedIn } = useAuth();

  // If not signed in, render children immediately
  if (!isSignedIn) {
    return <>{children}</>;
  }

  // If signed in but contact isn't loaded yet, show loading state
  if (!isLoaded && isLoading) {
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
          <p className="mt-2">Loading contact information...</p>
        </div>
      </div>
    );
  }

  // Contact is loaded or there was an error loading, render children
  return <>{children}</>;
}
