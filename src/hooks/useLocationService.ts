import { useMemo } from 'react';
import { useApiService } from './useApiService';
import { LocationService } from '../domain/interfaces/services/LocationService';
import { LocationServiceImpl } from '../services/location/LocationServiceImpl';

/**
 * Hook to get a LocationService instance with authentication configured
 * @returns A LocationService instance with authentication configured
 */
export function useLocationService(): LocationService {
  // Get the authenticated API service
  const apiService = useApiService();

  // Create a memoized LocationService instance that will only change when dependencies change
  const locationService = useMemo(() => {
    // Always use real LocationServiceImpl; handle errors at method call sites
    // console.log('🔧 Using LocationServiceImpl');
    return new LocationServiceImpl(apiService);
  }, [apiService]);

  return locationService;
}
