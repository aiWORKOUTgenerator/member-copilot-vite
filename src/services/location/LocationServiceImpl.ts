import { LocationsResponse } from '@/domain/entities';
import { ApiService } from '@/domain/interfaces/api/ApiService';
import { LocationService } from '@/domain/interfaces/services/LocationService';

/**
 * Implementation of the LocationService interface.
 * This class uses the ApiService to make HTTP requests for location data.
 */
export class LocationServiceImpl implements LocationService {
  private readonly apiService: ApiService;
  private readonly baseEndpoint = '/members/locations';

  /**
   * Creates a new instance of LocationServiceImpl
   * @param apiService The API service to use for HTTP requests
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  /**
   * Fetches all locations accessible to the authenticated member
   * @returns Promise resolving to locations with nested equipment and class schedules
   */
  async getLocations(): Promise<LocationsResponse> {
    try {
      const response = await this.apiService.get<LocationsResponse>(
        `${this.baseEndpoint}/`
      );
      return response;
    } catch (error) {
      console.error('❌ LocationServiceImpl: API call failed:', error);
      throw error;
    }
  }
}
