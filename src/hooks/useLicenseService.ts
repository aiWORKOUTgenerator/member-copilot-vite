import { LicenseServiceImpl } from '@/services/license/LicenseService';
import { useMemo } from 'react';
import { LicenseService } from '../domain/interfaces/license/LicenseService';
import { useLicensePolicyService } from './useLicensePolicyService';
import { useApiService } from './useApiService';

/**
 * Hook to access the license service functionality
 * @returns License service methods for feature access and usage tracking
 */
export function useLicenseService(): LicenseService {
  const apiService = useApiService();
  const licensePolicyService = useLicensePolicyService();
  // Create and memoize the license service
  const licenseService = useMemo<LicenseService>(() => {
    return new LicenseServiceImpl(apiService, licensePolicyService);
  }, [apiService, licensePolicyService]);

  return licenseService;
}
