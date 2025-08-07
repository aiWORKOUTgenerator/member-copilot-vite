import { ConfigurationService } from '@/domain/interfaces/services/ConfigurationService';
import {
  ConfigurationServiceImpl,
  MockConfigurationService,
} from '@/services/configuration/ConfigurationServiceImpl';
import { useMemo } from 'react';

/**
 * Determine if we should use mocks based on environment
 */
const shouldUseMocks = (): boolean => {
  return (
    import.meta.env.MODE === 'test' || import.meta.env.VITE_USE_MOCKS === 'true'
  );
};

/**
 * Hook to get the configuration service instance
 * @returns ConfigurationService implementation
 */
export function useConfigurationService(): ConfigurationService {
  return useMemo(() => {
    const useMocks = shouldUseMocks();
    const service = useMocks
      ? new MockConfigurationService()
      : new ConfigurationServiceImpl();
    console.log('useConfigurationService - created new instance:', service);
    return service;
  }, []);
}
