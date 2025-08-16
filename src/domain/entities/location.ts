import { Equipment } from './equipment';
import { ClassSchedule } from './classSchedule';

/**
 * Location entity representing a gym location with equipment and class schedules
 */
export interface Location {
  id: string | null;
  contact_id: string | null;
  name: string;
  equipment: Equipment[];
  class_schedules: ClassSchedule[];
}

/**
 * API response wrapper for location data
 */
export interface LocationsResponse {
  locations: Location[];
}

/**
 * Type guard to check if an object is valid Location
 */
export function isLocation(obj: unknown): obj is Location {
  return !!(
    obj &&
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'contact_id' in obj &&
    'name' in obj &&
    'equipment' in obj &&
    'class_schedules' in obj &&
    ((obj as Location).id === null ||
      typeof (obj as Location).id === 'string') &&
    ((obj as Location).contact_id === null ||
      typeof (obj as Location).contact_id === 'string') &&
    typeof (obj as Location).name === 'string' &&
    Array.isArray((obj as Location).equipment) &&
    Array.isArray((obj as Location).class_schedules)
  );
}

/**
 * Type guard to check if an object is valid LocationsResponse
 */
export function isLocationsResponse(obj: unknown): obj is LocationsResponse {
  return !!(
    obj &&
    typeof obj === 'object' &&
    obj !== null &&
    'locations' in obj &&
    Array.isArray((obj as LocationsResponse).locations)
  );
}

/**
 * Helper functions for location operations
 */
export const LocationUtils = {
  /**
   * Get all equipment from all locations
   */
  getAllEquipment(locations: Location[]): Equipment[] {
    return locations.flatMap((location) => location.equipment);
  },

  /**
   * Get all class schedules from all locations
   */
  getAllClassSchedules(locations: Location[]): ClassSchedule[] {
    return locations.flatMap((location) => location.class_schedules);
  },

  /**
   * Filter locations by contact (null for global locations)
   */
  filterByContact(locations: Location[], contactId: string | null): Location[] {
    return locations.filter((location) => location.contact_id === contactId);
  },

  /**
   * Get default/global location (where contact_id is null)
   */
  getDefaultLocation(locations: Location[]): Location | null {
    return locations.find((location) => location.contact_id === null) || null;
  },

  /**
   * Check if location has active equipment
   */
  hasActiveEquipment(location: Location): boolean {
    return location.equipment.some((equipment) => equipment.is_active);
  },

  /**
   * Check if location has active class schedules
   */
  hasActiveClasses(location: Location): boolean {
    return location.class_schedules.some((schedule) => schedule.is_active);
  },
};
