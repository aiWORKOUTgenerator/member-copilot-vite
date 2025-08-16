import { LocationsResponse } from '@/domain/entities';
import { LocationService } from '@/domain/interfaces/services/LocationService';

/**
 * Mock implementation of the LocationService interface for testing and development.
 * This implementation returns mock data instead of making API requests.
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

    return {
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
            {
              id: '01J2XY3EFGH1234567IJKL890',
              zone: 'Cardio Section',
              description: 'Treadmills, ellipticals, stationary bikes',
              directions: 'Central area near entrance',
              exercise_types: ['cardio', 'endurance'],
              equipment_list: ['treadmill', 'elliptical', 'bike'],
              category: 'cardio',
              is_active: true,
            },
            {
              id: '01J2XY3MNOP1234567QRST890',
              zone: 'Cable Machine Area',
              description: 'Cable crossovers, lat pulldowns, cable rows',
              directions: 'East wall corner',
              exercise_types: ['strength', 'functional'],
              equipment_list: ['cable_machine', 'pulldown', 'crossover'],
              category: 'cable_machines',
              is_active: false,
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
            {
              id: '01J2XY3UVWX1234567YZAB890',
              name: 'HIIT Training',
              description:
                'High-intensity interval training for strength and cardio',
              instructor_names: ['Jordan', 'Sam'],
              times: ['Tue/Thu 7:00pm', 'Sat 9:00am'],
              workout_type: 'hiit',
              frequency: 'weekly',
              is_active: true,
            },
            {
              id: '01J2XY3CDEF1234567GHIJ890',
              name: 'Pilates Core',
              description: 'Core-focused Pilates class',
              instructor_names: ['Taylor'],
              times: ['Wed 12:00pm'],
              workout_type: 'pilates',
              frequency: 'weekly',
              is_active: false,
            },
          ],
        },
      ],
    };
  }
}
