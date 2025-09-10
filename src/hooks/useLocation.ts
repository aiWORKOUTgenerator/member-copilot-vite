import { LocationState } from '@/contexts/location.types';
import {
  ClassSchedule,
  ClassScheduleWithLocation,
  Equipment,
  Location,
  LocationUtils,
} from '@/domain/entities';
import { useAuth } from '@/hooks/auth';
import { useLocationService } from '@/hooks/useLocationService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

/**
 * Hook to access locations using React Query
 */
export function useLocation(): LocationState {
  const locationService = useLocationService();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  // console.log('🔧 useLocation: Hook called, isSignedIn:', isSignedIn, 'Service:', locationService.constructor.name);

  const query = useQuery<{ locations: Location[] }, unknown>({
    queryKey: ['locations'],
    queryFn: () => {
      return locationService.getLocations();
    },
    enabled: isSignedIn === true,
    staleTime: 30_000,
  });

  // console.log('🔧 useLocation: Query state:', {
  //   isFetching: query.isFetching,
  //   isFetched: query.isFetched,
  //   error: query.error,
  //   data: query.data
  // });

  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['locations'] });
    }
  }, [isSignedIn, queryClient]);

  const refetch = async (): Promise<void> => {
    await query.refetch();
  };

  const locations: Location[] = query.data?.locations ?? [];

  const getAllEquipment = (): Equipment[] =>
    LocationUtils.getAllEquipment(locations);
  const getAllClassSchedules = (): ClassSchedule[] =>
    LocationUtils.getAllClassSchedules(locations);
  const getDefaultLocation = (): Location | null =>
    LocationUtils.getDefaultLocation(locations);
  const hasActiveEquipment = (location: Location): boolean =>
    LocationUtils.hasActiveEquipment(location);
  const hasActiveClasses = (location: Location): boolean =>
    LocationUtils.hasActiveClasses(location);

  return {
    locations,
    isLoading: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    isLoaded: query.isFetched,
    refetch,
    getAllEquipment,
    getAllClassSchedules,
    getDefaultLocation,
    hasActiveEquipment,
    hasActiveClasses,
  };
}

/**
 * Convenience hook to get just the locations data
 */
export function useLocationData(): Location[] {
  const { locations } = useLocation();
  return locations;
}

/**
 * Convenience hook to check if locations are loading
 */
export function useLocationLoading(): boolean {
  const { isLoading } = useLocation();
  return isLoading;
}

/**
 * Convenience hook to check if locations are loaded
 */
export function useLocationLoaded(): boolean {
  const { isLoaded } = useLocation();
  return isLoaded;
}

/**
 * Convenience hook to get any location loading error
 */
export function useLocationError(): string | null {
  const { error } = useLocation();
  return error;
}

/**
 * Convenience hook to get all equipment from all locations
 */
export function useAllEquipment(): Equipment[] {
  const { getAllEquipment } = useLocation();
  return getAllEquipment();
}

/**
 * Convenience hook to get all class schedules from all locations
 */
export function useAllClassSchedules(): ClassSchedule[] {
  const { getAllClassSchedules } = useLocation();
  return getAllClassSchedules();
}

/**
 * Convenience hook to get all class schedules with location information
 */
export function useAllClassSchedulesWithLocation(): ClassScheduleWithLocation[] {
  const { locations } = useLocation();

  const schedulesWithLocation: ClassScheduleWithLocation[] = [];

  locations.forEach((location) => {
    location.class_schedules.forEach((schedule) => {
      schedulesWithLocation.push({
        ...schedule,
        location: {
          id: location.id,
          name: location.name,
        },
      });
    });
  });

  return schedulesWithLocation;
}

/**
 * Convenience hook to get the default location
 */
export function useDefaultLocation(): Location | null {
  const { getDefaultLocation } = useLocation();
  return getDefaultLocation();
}
