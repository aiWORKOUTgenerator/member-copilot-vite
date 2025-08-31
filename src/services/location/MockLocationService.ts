import { LocationsResponse, Location } from '@/domain/entities';
import { LocationService } from '@/domain/interfaces/services/LocationService';

/**
 * Mock implementation of the LocationService interface for testing and development.
 * This implementation returns mock data instead of making API requests.
 * Updated with real data from admin tenant - only Free Weight Zone with individual equipment.
 */
export class MockLocationService implements LocationService {
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Fetches all locations accessible to the authenticated member
   * @returns Promise resolving to mock locations with nested equipment and class schedules
   */
  async getLocations(): Promise<LocationsResponse> {
    await this.delay(200); // Simulate network delay

    const mockLocations: Location[] = [
      {
        id: '01K3C4W1ZCH33KFWKM8Z5FAZG0',
        contact_id: null,
        name: 'Full Gym',
        equipment: [
          {
            id: 'free-weights-zone',
            category: 'free_weights',
            zone: 'Free Weight Zone',
            description: 'Complete free weight equipment area',
            directions: 'Located in the main gym area, near the cardio section',
            exercise_types: ['strength', 'powerlifting', 'bodybuilding'],
            is_active: true,
            equipment_list: [
              'Dumbbells - 5 lbs',
              'Dumbbells - 10 lbs',
              'Dumbbells - 15 lbs',
              'Dumbbells - 20 lbs',
              'Dumbbells - 25 lbs',
              'Dumbbells - 30 lbs',
              'Dumbbells - 35 lbs',
              'Dumbbells - 40 lbs',
              'Dumbbells - 45 lbs',
              'Dumbbells - 50 lbs',
              'Dumbbells - 55 lbs',
              'Dumbbells - 60 lbs',
              'Dumbbells - 65 lbs',
              'Dumbbells - 70 lbs',
              'Dumbbells - 75 lbs',
              'Dumbbells - 80 lbs',
              'Dumbbells - 85 lbs',
              'Dumbbells - 90 lbs',
              'Dumbbells - 95 lbs',
              'Dumbbells - 100 lbs',
              'Olympic Barbell - 45 lbs',
              'Weight Plates - 2.5 lbs',
              'Weight Plates - 5 lbs',
              'Weight Plates - 10 lbs',
              'Weight Plates - 25 lbs',
              'Weight Plates - 35 lbs',
              'Weight Plates - 45 lbs',
              'Flat Bench',
              'Adjustable Bench',
              'Power Rack',
              'Squat Rack',
              'Deadlift Platform',
              'EZ Curl Bar - 25 lbs',
              'Kettlebells - 10 lbs',
              'Kettlebells - 15 lbs',
              'Kettlebells - 20 lbs',
              'Kettlebells - 25 lbs',
              'Kettlebells - 30 lbs',
              'Kettlebells - 35 lbs',
              'Kettlebells - 40 lbs',
              'Kettlebells - 45 lbs',
              'Kettlebells - 50 lbs',
              'Lifting Mats',
              'Rubber Flooring',
              'Collars/Clips',
              'Mirror Walls',
            ],
          },
        ],
        class_schedules: [],
      },
    ];

    return {
      locations: mockLocations,
    };
  }
}
