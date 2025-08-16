import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import {
  useLocation,
  useLocationData,
  useLocationLoading,
  useLocationLoaded,
  useLocationError,
  useAllEquipment,
  useAllClassSchedules,
  useDefaultLocation,
} from '../useLocation';
import { LocationContext, LocationState } from '../../contexts/location.types';
import { Location, Equipment, ClassSchedule } from '@/domain/entities';

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

const mockClassSchedule: ClassSchedule = {
  id: '01J2XY3IJKL1234567MNOP890',
  name: 'Yoga Flow',
  description: 'Vinyasa-style class focusing on flexibility and breath',
  instructor_names: ['Alex'],
  times: ['Mon/Wed/Fri 6:00am'],
  workout_type: 'yoga',
  frequency: 'weekly',
  is_active: true,
};

const mockLocation: Location = {
  id: null,
  contact_id: null,
  name: 'Default',
  equipment: [mockEquipment],
  class_schedules: [mockClassSchedule],
};

const mockLocationState: LocationState = {
  locations: [mockLocation],
  isLoading: false,
  error: null,
  isLoaded: true,
  refetch: vi.fn(),
  getAllEquipment: vi.fn().mockReturnValue([mockEquipment]),
  getAllClassSchedules: vi.fn().mockReturnValue([mockClassSchedule]),
  getDefaultLocation: vi.fn().mockReturnValue(mockLocation),
  hasActiveEquipment: vi.fn().mockReturnValue(true),
  hasActiveClasses: vi.fn().mockReturnValue(true),
};

const LocationProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: LocationState;
}) => (
  <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
);

describe('useLocation hooks', () => {
  describe('useLocation', () => {
    it('returns location state when used within provider', () => {
      const { result } = renderHook(() => useLocation(), {
        wrapper: ({ children }) => (
          <LocationProvider value={mockLocationState}>
            {children}
          </LocationProvider>
        ),
      });

      expect(result.current).toEqual(mockLocationState);
    });

    it('throws error when used outside provider', () => {
      expect(() => {
        renderHook(() => useLocation());
      }).toThrow('useLocation must be used within a LocationProvider');
    });
  });

  describe('useLocationData', () => {
    it('returns locations array', () => {
      const { result } = renderHook(() => useLocationData(), {
        wrapper: ({ children }) => (
          <LocationProvider value={mockLocationState}>
            {children}
          </LocationProvider>
        ),
      });

      expect(result.current).toEqual([mockLocation]);
    });
  });

  describe('useLocationLoading', () => {
    it('returns loading state', () => {
      const { result } = renderHook(() => useLocationLoading(), {
        wrapper: ({ children }) => (
          <LocationProvider value={{ ...mockLocationState, isLoading: true }}>
            {children}
          </LocationProvider>
        ),
      });

      expect(result.current).toBe(true);
    });
  });

  describe('useLocationLoaded', () => {
    it('returns loaded state', () => {
      const { result } = renderHook(() => useLocationLoaded(), {
        wrapper: ({ children }) => (
          <LocationProvider value={mockLocationState}>
            {children}
          </LocationProvider>
        ),
      });

      expect(result.current).toBe(true);
    });
  });

  describe('useLocationError', () => {
    it('returns error state', () => {
      const errorMessage = 'Failed to load locations';
      const { result } = renderHook(() => useLocationError(), {
        wrapper: ({ children }) => (
          <LocationProvider
            value={{ ...mockLocationState, error: errorMessage }}
          >
            {children}
          </LocationProvider>
        ),
      });

      expect(result.current).toBe(errorMessage);
    });

    it('returns null when no error', () => {
      const { result } = renderHook(() => useLocationError(), {
        wrapper: ({ children }) => (
          <LocationProvider value={mockLocationState}>
            {children}
          </LocationProvider>
        ),
      });

      expect(result.current).toBeNull();
    });
  });

  describe('useAllEquipment', () => {
    it('calls getAllEquipment and returns result', () => {
      const { result } = renderHook(() => useAllEquipment(), {
        wrapper: ({ children }) => (
          <LocationProvider value={mockLocationState}>
            {children}
          </LocationProvider>
        ),
      });

      expect(mockLocationState.getAllEquipment).toHaveBeenCalled();
      expect(result.current).toEqual([mockEquipment]);
    });
  });

  describe('useAllClassSchedules', () => {
    it('calls getAllClassSchedules and returns result', () => {
      const { result } = renderHook(() => useAllClassSchedules(), {
        wrapper: ({ children }) => (
          <LocationProvider value={mockLocationState}>
            {children}
          </LocationProvider>
        ),
      });

      expect(mockLocationState.getAllClassSchedules).toHaveBeenCalled();
      expect(result.current).toEqual([mockClassSchedule]);
    });
  });

  describe('useDefaultLocation', () => {
    it('calls getDefaultLocation and returns result', () => {
      const { result } = renderHook(() => useDefaultLocation(), {
        wrapper: ({ children }) => (
          <LocationProvider value={mockLocationState}>
            {children}
          </LocationProvider>
        ),
      });

      expect(mockLocationState.getDefaultLocation).toHaveBeenCalled();
      expect(result.current).toEqual(mockLocation);
    });
  });
});
