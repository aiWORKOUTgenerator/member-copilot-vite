import { ConfigurationService } from '@/domain/interfaces/services/ConfigurationService';
import {
  ConfigurationServiceImpl,
  MockConfigurationService,
} from '@/services/configuration/ConfigurationServiceImpl';
import { useMemo } from 'react';

/**
 * Hook to get the configuration service instance
 * Uses MockConfigurationService in development when no VITE_CONFIG_API_URL is set
 * @returns ConfigurationService implementation
 */
export function useConfigurationService(): ConfigurationService {
  return useMemo(() => {
    // Use mock service in development when no API URL is configured
    const isDevelopment = import.meta.env.DEV;
    const hasConfigApiUrl = !!import.meta.env.VITE_CONFIG_API_URL;

    if (isDevelopment && !hasConfigApiUrl) {
      console.log('🔧 Using MockConfigurationService for development');
      return new MockConfigurationService();
    }

    return new ConfigurationServiceImpl();
  }, []);
}
