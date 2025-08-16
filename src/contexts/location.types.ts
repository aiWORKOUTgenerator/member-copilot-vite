import { Location, Equipment, ClassSchedule } from '@/domain/entities';
import { createContext } from 'react';

/**
 * LocationState interface defines the shape of our location context value.
 */
export interface LocationState {
  locations: Location[];
  isLoading: boolean;
  error: string | null;
  isLoaded: boolean;
  refetch: () => Promise<void>;
  // Utility functions for accessing nested data
  getAllEquipment: () => Equipment[];
  getAllClassSchedules: () => ClassSchedule[];
  getDefaultLocation: () => Location | null;
  hasActiveEquipment: (location: Location) => boolean;
  hasActiveClasses: (location: Location) => boolean;
}

/**
 * Create the context with a default undefined value.
 * This forces consumers to use the useLocation hook which performs a null check.
 */
export const LocationContext = createContext<LocationState | undefined>(
  undefined
);
