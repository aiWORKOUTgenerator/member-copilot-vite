import { describe, it, expect } from 'vitest';
import {
  Location,
  LocationsResponse,
  isLocation,
  isLocationsResponse,
  LocationUtils,
} from '../location';
import { Equipment } from '../equipment';
import { ClassSchedule } from '../classSchedule';

describe('Location', () => {
  const mockEquipment: Equipment = {
    id: '01J2XY3ABCD1234567EFGH890',
    zone: 'Free Weights Area',
    description: 'Dumbbells 5–100 lbs, benches, squat racks',
    directions: 'West wall near mirrors',
    exercise_types: ['strength', 'hypertrophy'],
    equipment_list: ['bench', 'dumbbells', 'rack'],
    category: 'free_weights',
    is_active: true,
  };

  const mockInactiveEquipment: Equipment = {
    ...mockEquipment,
    id: '01J2XY3EFGH1234567IJKL890',
    is_active: false,
  };

  const mockClassSchedule: ClassSchedule = {
    id: '01J2XY3IJKL1234567MNOP890',
    name: 'Yoga Flow',
    description: 'Vinyasa-style class focusing on flexibility and breath',
    times_with_instructors: [{ name: 'Alex', time: 'Mon/Wed/Fri 6:00am' }],
    workout_type: 'yoga',
    frequency: 'weekly',
    is_active: true,
  };

  const mockInactiveSchedule: ClassSchedule = {
    ...mockClassSchedule,
    id: '01J2XY3UVWX1234567YZAB890',
    is_active: false,
  };

  const mockLocation: Location = {
    id: null,
    contact_id: null,
    name: 'Default',
    equipment: [mockEquipment, mockInactiveEquipment],
    class_schedules: [mockClassSchedule, mockInactiveSchedule],
  };

  const mockUserLocation: Location = {
    id: 'location-123',
    contact_id: 'contact-456',
    name: "User's Gym",
    equipment: [mockEquipment],
    class_schedules: [mockClassSchedule],
  };

  const mockLocationsResponse: LocationsResponse = {
    locations: [mockLocation, mockUserLocation],
  };

  describe('isLocation', () => {
    it('returns true for valid location object', () => {
      expect(isLocation(mockLocation)).toBe(true);
    });

    it('returns true for location with string id and contact_id', () => {
      expect(isLocation(mockUserLocation)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isLocation(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isLocation(undefined)).toBe(false);
    });

    it('returns false for object missing required fields', () => {
      const invalidLocation = {
        id: null,
        name: 'test',
        // missing other required fields
      };
      expect(isLocation(invalidLocation)).toBe(false);
    });

    it('returns false when equipment is not an array', () => {
      const invalidLocation = {
        ...mockLocation,
        equipment: 'not an array',
      };
      expect(isLocation(invalidLocation)).toBe(false);
    });

    it('returns false when class_schedules is not an array', () => {
      const invalidLocation = {
        ...mockLocation,
        class_schedules: 'not an array',
      };
      expect(isLocation(invalidLocation)).toBe(false);
    });
  });

  describe('isLocationsResponse', () => {
    it('returns true for valid locations response', () => {
      expect(isLocationsResponse(mockLocationsResponse)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isLocationsResponse(null)).toBe(false);
    });

    it('returns false for object missing locations field', () => {
      const invalidResponse = {
        data: [],
      };
      expect(isLocationsResponse(invalidResponse)).toBe(false);
    });

    it('returns false when locations is not an array', () => {
      const invalidResponse = {
        locations: 'not an array',
      };
      expect(isLocationsResponse(invalidResponse)).toBe(false);
    });
  });

  describe('LocationUtils', () => {
    const locationList = [mockLocation, mockUserLocation];

    describe('getAllEquipment', () => {
      it('returns all equipment from all locations', () => {
        const allEquipment = LocationUtils.getAllEquipment(locationList);
        expect(allEquipment).toHaveLength(3);
        expect(allEquipment).toContain(mockEquipment);
        expect(allEquipment).toContain(mockInactiveEquipment);
      });

      it('returns empty array for empty location list', () => {
        const allEquipment = LocationUtils.getAllEquipment([]);
        expect(allEquipment).toHaveLength(0);
      });
    });

    describe('getAllClassSchedules', () => {
      it('returns all class schedules from all locations', () => {
        const allSchedules = LocationUtils.getAllClassSchedules(locationList);
        expect(allSchedules).toHaveLength(3);
        expect(allSchedules).toContain(mockClassSchedule);
        expect(allSchedules).toContain(mockInactiveSchedule);
      });

      it('returns empty array for empty location list', () => {
        const allSchedules = LocationUtils.getAllClassSchedules([]);
        expect(allSchedules).toHaveLength(0);
      });
    });

    describe('filterByContact', () => {
      it('filters locations by contact id', () => {
        const userLocations = LocationUtils.filterByContact(
          locationList,
          'contact-456'
        );
        expect(userLocations).toHaveLength(1);
        expect(userLocations[0]).toBe(mockUserLocation);
      });

      it('filters locations by null contact id (global)', () => {
        const globalLocations = LocationUtils.filterByContact(
          locationList,
          null
        );
        expect(globalLocations).toHaveLength(1);
        expect(globalLocations[0]).toBe(mockLocation);
      });

      it('returns empty array when no locations match contact', () => {
        const noLocations = LocationUtils.filterByContact(
          locationList,
          'nonexistent'
        );
        expect(noLocations).toHaveLength(0);
      });
    });

    describe('getDefaultLocation', () => {
      it('returns default location with null contact_id', () => {
        const defaultLocation = LocationUtils.getDefaultLocation(locationList);
        expect(defaultLocation).toBe(mockLocation);
      });

      it('returns null when no default location exists', () => {
        const userOnlyList = [mockUserLocation];
        const defaultLocation = LocationUtils.getDefaultLocation(userOnlyList);
        expect(defaultLocation).toBeNull();
      });
    });

    describe('hasActiveEquipment', () => {
      it('returns true when location has active equipment', () => {
        expect(LocationUtils.hasActiveEquipment(mockLocation)).toBe(true);
        expect(LocationUtils.hasActiveEquipment(mockUserLocation)).toBe(true);
      });

      it('returns false when location has no active equipment', () => {
        const locationWithoutActiveEquipment: Location = {
          ...mockLocation,
          equipment: [mockInactiveEquipment],
        };
        expect(
          LocationUtils.hasActiveEquipment(locationWithoutActiveEquipment)
        ).toBe(false);
      });

      it('returns false when location has no equipment', () => {
        const locationWithoutEquipment: Location = {
          ...mockLocation,
          equipment: [],
        };
        expect(LocationUtils.hasActiveEquipment(locationWithoutEquipment)).toBe(
          false
        );
      });
    });

    describe('hasActiveClasses', () => {
      it('returns true when location has active class schedules', () => {
        expect(LocationUtils.hasActiveClasses(mockLocation)).toBe(true);
        expect(LocationUtils.hasActiveClasses(mockUserLocation)).toBe(true);
      });

      it('returns false when location has no active class schedules', () => {
        const locationWithoutActiveClasses: Location = {
          ...mockLocation,
          class_schedules: [mockInactiveSchedule],
        };
        expect(
          LocationUtils.hasActiveClasses(locationWithoutActiveClasses)
        ).toBe(false);
      });

      it('returns false when location has no class schedules', () => {
        const locationWithoutClasses: Location = {
          ...mockLocation,
          class_schedules: [],
        };
        expect(LocationUtils.hasActiveClasses(locationWithoutClasses)).toBe(
          false
        );
      });
    });
  });
});
