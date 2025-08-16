import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationServiceImpl } from '../../location/LocationServiceImpl';
import { LocationsResponse } from '@/domain/entities';
import { ApiService } from '@/domain/interfaces/api/ApiService';

describe('LocationServiceImpl', () => {
  let locationService: LocationServiceImpl;
  let mockApiService: jest.Mocked<ApiService>;

  const mockLocationsResponse: LocationsResponse = {
    locations: [
      {
        id: null,
        contact_id: null,
        name: 'Default',
        equipment: [
          {
            id: '01J2XY3ABCD1234567EFGH890',
            zone: 'Free Weights Area',
            description: 'Dumbbells 5–100 lbs, benches, squat racks',
            directions: 'West wall near mirrors',
            exercise_types: ['strength', 'hypertrophy'],
            equipment_list: ['bench', 'dumbbells', 'rack'],
            category: 'free_weights',
            is_active: true,
          },
        ],
        class_schedules: [
          {
            id: '01J2XY3IJKL1234567MNOP890',
            name: 'Yoga Flow',
            description:
              'Vinyasa-style class focusing on flexibility and breath',
            instructor_names: ['Alex'],
            times: ['Mon/Wed/Fri 6:00am'],
            workout_type: 'yoga',
            frequency: 'weekly',
            is_active: true,
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    mockApiService = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
    locationService = new LocationServiceImpl(mockApiService);
  });

  describe('getLocations', () => {
    it('makes GET request to correct endpoint and returns locations', async () => {
      mockApiService.get.mockResolvedValue(mockLocationsResponse);

      const result = await locationService.getLocations();

      expect(mockApiService.get).toHaveBeenCalledWith('/members/locations/');
      expect(result).toEqual(mockLocationsResponse);
    });

    it('handles API errors correctly', async () => {
      const error = new Error('API Error');
      mockApiService.get.mockRejectedValue(error);

      await expect(locationService.getLocations()).rejects.toThrow('API Error');
      expect(mockApiService.get).toHaveBeenCalledWith('/members/locations/');
    });

    it('returns empty locations array when API returns empty response', async () => {
      const emptyResponse: LocationsResponse = { locations: [] };
      mockApiService.get.mockResolvedValue(emptyResponse);

      const result = await locationService.getLocations();

      expect(result).toEqual(emptyResponse);
      expect(result.locations).toHaveLength(0);
    });

    it('handles locations with null ids correctly', async () => {
      mockApiService.get.mockResolvedValue(mockLocationsResponse);

      const result = await locationService.getLocations();

      expect(result.locations[0].id).toBeNull();
      expect(result.locations[0].contact_id).toBeNull();
    });

    it('handles locations with nested equipment and schedules correctly', async () => {
      mockApiService.get.mockResolvedValue(mockLocationsResponse);

      const result = await locationService.getLocations();

      const location = result.locations[0];
      expect(location.equipment).toBeDefined();
      expect(location.equipment).toHaveLength(1);
      expect(location.equipment[0].id).toBe('01J2XY3ABCD1234567EFGH890');

      expect(location.class_schedules).toBeDefined();
      expect(location.class_schedules).toHaveLength(1);
      expect(location.class_schedules[0].id).toBe('01J2XY3IJKL1234567MNOP890');
    });

    it('handles multiple locations correctly', async () => {
      const multipleLocationsResponse: LocationsResponse = {
        locations: [
          mockLocationsResponse.locations[0],
          {
            id: 'location-123',
            contact_id: 'contact-456',
            name: "User's Gym",
            equipment: [],
            class_schedules: [],
          },
        ],
      };
      mockApiService.get.mockResolvedValue(multipleLocationsResponse);

      const result = await locationService.getLocations();

      expect(result.locations).toHaveLength(2);
      expect(result.locations[0].id).toBeNull();
      expect(result.locations[1].id).toBe('location-123');
      expect(result.locations[1].contact_id).toBe('contact-456');
    });
  });
});
