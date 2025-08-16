import { useContext } from 'react';
import { Location, Equipment, ClassSchedule } from '@/domain/entities';
import { LocationContext, LocationState } from '@/contexts/location.types';

/**
 * Custom hook to access the location data from the LocationContext.
 * Throws an error if used outside of a LocationProvider.
 */
export function useLocation(): LocationState {
  const context = useContext(LocationContext);

  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }

  return context;
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
 * Convenience hook to get the default location
 */
export function useDefaultLocation(): Location | null {
  const { getDefaultLocation } = useLocation();
  return getDefaultLocation();
}
