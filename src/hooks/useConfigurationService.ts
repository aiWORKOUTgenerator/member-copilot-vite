import { ConfigurationService } from '@/domain/interfaces/services/ConfigurationService';
import { ConfigurationServiceImpl } from '@/services/configuration/ConfigurationServiceImpl';
import { useMemo } from 'react';

/**
 * Hook to get the configuration service instance
 * @returns ConfigurationService implementation
 */
export function useConfigurationService(): ConfigurationService {
  return useMemo(() => {
    return new ConfigurationServiceImpl();
  }, []);
}
