'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { Location, LocationUtils } from '@/domain/entities';
import { useLocationService } from '@/hooks';
import { useAuth } from '@/hooks/auth';
import { LocationContext, LocationState } from './location.types';

interface LocationProviderProps {
  children: ReactNode;
}

/**
 * LocationProvider component that makes location data available to all child components.
 * It fetches location data on mount and provides methods to refetch.
 */
export function LocationProvider({ children }: LocationProviderProps) {
  const locationService = useLocationService();
  const { isSignedIn } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    console.log('fetching locationService changed');
    setIsLoading(true);
    setError(null);

    try {
      const data = await locationService.getLocations();
      setLocations(data.locations);
      setIsLoaded(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch locations'
      );
      console.error('Error fetching locations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [locationService]);

  useEffect(() => {
    if (!isSignedIn) {
      setLocations([]);
      setIsLoaded(false);
    }
    if (isSignedIn && !isLoaded) {
      console.log('fetching locations');
      fetchLocations();
    }
  }, [isSignedIn, isLoaded, fetchLocations]);

  // Memoized context value with location utilities
  const contextValue: LocationState = {
    locations,
    isLoading,
    error,
    isLoaded,
    refetch: fetchLocations,
    // Utility functions using LocationUtils
    getAllEquipment: () => LocationUtils.getAllEquipment(locations),
    getAllClassSchedules: () => LocationUtils.getAllClassSchedules(locations),
    getDefaultLocation: () => LocationUtils.getDefaultLocation(locations),
    hasActiveEquipment: (location: Location) =>
      LocationUtils.hasActiveEquipment(location),
    hasActiveClasses: (location: Location) =>
      LocationUtils.hasActiveClasses(location),
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}
