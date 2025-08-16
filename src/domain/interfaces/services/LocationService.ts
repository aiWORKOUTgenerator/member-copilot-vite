import { LocationsResponse } from '@/domain/entities';

/**
 * Interface for LocationService
 * Following Interface Segregation Principle from SOLID
 */
export interface LocationService {
  /**
   * Get all locations accessible to the authenticated member
   * @returns Promise<LocationsResponse> - Locations with nested equipment and class schedules
   */
  getLocations(): Promise<LocationsResponse>;
}
