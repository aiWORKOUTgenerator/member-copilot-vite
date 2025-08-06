import { MeteredUsageServiceImpl } from '@/services/meteredUsage/MeteredUsageServiceImpl';
import { useMemo } from 'react';
import { MeteredUsageService } from '../domain/interfaces/meteredUsage/MeteredUsageService';
import { useApiService } from './useApiService';

/**
 * Hook to access the metered usage service functionality
 * @returns Metered usage service methods
 */
export function useMeteredUsageService(): MeteredUsageService {
  const apiService = useApiService();

  const meteredUsageService = useMemo<MeteredUsageService>(() => {
    return new MeteredUsageServiceImpl(apiService);
  }, [apiService]);

  return meteredUsageService;
}
