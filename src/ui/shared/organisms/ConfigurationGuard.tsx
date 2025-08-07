import { ReactNode } from 'react';
import { useConfiguration } from '@/hooks/useConfiguration';
import { ConfigurationLoadingScreen } from './ConfigurationLoadingScreen';

interface ConfigurationGuardProps {
  children: ReactNode;
}

/**
 * ConfigurationGuard component that prevents app access until configuration is loaded.
 * Shows loading screen while configuration is being fetched.
 * Shows error screen if configuration fails to load.
 * Only renders children when configuration is successfully loaded.
 */
export function ConfigurationGuard({ children }: ConfigurationGuardProps) {
  const { isLoading, isLoaded, error, refetch } = useConfiguration();

  // Show loading screen while configuration is being loaded
  if (isLoading || !isLoaded) {
    return (
      <ConfigurationLoadingScreen
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    );
  }

  // Configuration loaded successfully, render the app
  return <>{children}</>;
}
