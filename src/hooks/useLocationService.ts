import { useMemo } from 'react';
import { useApiService } from './useApiService';
import { LocationService } from '../domain/interfaces/services/LocationService';
import { LocationServiceImpl } from '../services/location/LocationServiceImpl';
import { MockLocationService } from '../services/location/MockLocationService';

/**
 * Hook to get a LocationService instance with authentication configured
 * @returns A LocationService instance with authentication configured
 */
export function useLocationService(): LocationService {
  // Get the authenticated API service
  const apiService = useApiService();

  // Create a memoized LocationService instance that will only change when dependencies change
  const locationService = useMemo(() => {
    // Try to use real API service first, fallback to mock if needed
    try {
      // console.log('🔧 Attempting to use real LocationServiceImpl');
      return new LocationServiceImpl(apiService);
    } catch (error) {
      console.warn('⚠️ Falling back to MockLocationService:', error);
      return new MockLocationService();
    }
  }, [apiService]);

  return locationService;
}
