import { ConfigurationService } from '@/domain/interfaces/services/ConfigurationService';
import {
  ConfigurationServiceImpl,
  MockConfigurationService,
} from '@/services/configuration/ConfigurationServiceImpl';
import { useMemo } from 'react';

/**
 * Hook to get the configuration service instance
 * @returns ConfigurationService implementation
 */
export function useConfigurationService(): ConfigurationService {
  return useMemo(() => {
    // Use mock service for local development
    if (import.meta.env.DEV) {
      return new MockConfigurationService();
    }
    return new ConfigurationServiceImpl();
  }, []);
}
