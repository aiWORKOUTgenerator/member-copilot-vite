import { LicensePolicyService } from '@/services/license/LicensePolicyService';
import { useMemo } from 'react';
import { useApiService } from './useApiService';

export function useLicensePolicyService(): LicensePolicyService {
  // Get the authenticated API service
  const apiService = useApiService();

  // Create a memoized LicensePolicyService instance that will only change when dependencies change
  const licensePolicyService = useMemo(() => {
    return new LicensePolicyService(apiService);
  }, [apiService]);

  return licensePolicyService;
}
