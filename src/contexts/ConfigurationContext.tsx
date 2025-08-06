'use client';

import { AppConfiguration } from '@/domain/entities/appConfiguration';
import { useConfigurationService } from '@/hooks/useConfigurationService';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  ConfigurationContext,
  ConfigurationState,
} from './configuration.types';

interface ConfigurationProviderProps {
  children: ReactNode;
}

/**
 * ConfigurationProvider component that loads and provides app configuration.
 * This provider must load configuration before allowing access to any app features.
 */
export function ConfigurationProvider({
  children,
}: ConfigurationProviderProps) {
  const configurationService = useConfigurationService();
  const [configuration, setConfiguration] = useState<AppConfiguration | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get the current domain from window.location
   */
  const getCurrentDomain = useCallback((): string => {
    return window.location.hostname;
  }, []);

  /**
   * Fetch configuration for the current domain
   */
  const fetchConfiguration = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const domain = getCurrentDomain();
      const config = await configurationService.getConfiguration(domain);
      setConfiguration(config);
      setIsLoaded(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load configuration';
      setError(errorMessage);
      console.error('Configuration loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [configurationService, getCurrentDomain]);

  // Load configuration on mount
  useEffect(() => {
    fetchConfiguration();
  }, [fetchConfiguration]);

  // Memoized context value
  const contextValue: ConfigurationState = {
    configuration,
    isLoading,
    isLoaded,
    error,
    refetch: fetchConfiguration,
  };

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
}
