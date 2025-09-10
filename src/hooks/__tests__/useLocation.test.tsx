import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import { Location, Equipment, ClassSchedule } from '@/domain/entities';
import { useLocationService } from '@/hooks/useLocationService';

vi.mock('@/hooks/useLocationService');
vi.mock('@/hooks/auth', () => ({
  useAuth: () => ({ isSignedIn: true, isLoaded: true }),
}));

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
  times_with_instructors: [{ name: 'Alex', time: 'Mon/Wed/Fri 6:00am' }],
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

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const mockedService = vi.mocked(useLocationService);

beforeEach(() => {
  vi.resetAllMocks();
});

describe('useLocation hooks', () => {
  describe('useLocation', () => {
    it('returns location state when loaded', async () => {
      mockedService.mockReturnValue({
        getLocations: vi.fn().mockResolvedValue({ locations: [mockLocation] }),
      } as unknown as ReturnType<typeof useLocationService>);

      const { result } = renderHook(() => useLocation(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoaded).toBe(true));
      expect(result.current.locations).toEqual([mockLocation]);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
      // Derived utils
      expect(result.current.getAllEquipment()).toEqual([mockEquipment]);
      expect(result.current.getAllClassSchedules()).toEqual([
        mockClassSchedule,
      ]);
      expect(result.current.getDefaultLocation()).toEqual(mockLocation);
      expect(result.current.hasActiveEquipment(mockLocation)).toBe(true);
      expect(result.current.hasActiveClasses(mockLocation)).toBe(true);
    });
  });

  describe('useLocationData', () => {
    it('returns locations array', async () => {
      mockedService.mockReturnValue({
        getLocations: vi.fn().mockResolvedValue({ locations: [mockLocation] }),
      } as unknown as ReturnType<typeof useLocationService>);
      const { result } = renderHook(() => useLocationData(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current).toEqual([mockLocation]));
    });
  });

  describe('useLocationLoading', () => {
    it('returns loading state', () => {
      const { result } = renderHook(() => useLocationLoading(), {
        wrapper: createWrapper(),
      });
      expect(typeof result.current).toBe('boolean');
    });
  });

  describe('useLocationLoaded', () => {
    it('returns loaded state', async () => {
      mockedService.mockReturnValue({
        getLocations: vi.fn().mockResolvedValue({ locations: [mockLocation] }),
      } as unknown as ReturnType<typeof useLocationService>);
      const { result } = renderHook(() => useLocationLoaded(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current).toBe(true));
    });
  });

  describe('useLocationError', () => {
    it('returns error state', () => {
      const errorMessage = 'Failed to load locations';
      mockedService.mockReturnValue({
        getLocations: vi.fn().mockRejectedValue(new Error(errorMessage)),
      } as unknown as ReturnType<typeof useLocationService>);
      const { result } = renderHook(() => useLocationError(), {
        wrapper: createWrapper(),
      });
      return waitFor(() => expect(result.current).toBe(errorMessage));
    });

    it('returns null when no error', () => {
      const { result } = renderHook(() => useLocationError(), {
        wrapper: createWrapper(),
      });
      expect(result.current).toBeNull();
    });
  });

  describe('useAllEquipment', () => {
    it('returns all equipment from locations', async () => {
      mockedService.mockReturnValue({
        getLocations: vi.fn().mockResolvedValue({ locations: [mockLocation] }),
      } as unknown as ReturnType<typeof useLocationService>);
      const { result } = renderHook(() => useAllEquipment(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current).toEqual([mockEquipment]));
    });
  });

  describe('useAllClassSchedules', () => {
    it('returns all class schedules from locations', async () => {
      mockedService.mockReturnValue({
        getLocations: vi.fn().mockResolvedValue({ locations: [mockLocation] }),
      } as unknown as ReturnType<typeof useLocationService>);
      const { result } = renderHook(() => useAllClassSchedules(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current).toEqual([mockClassSchedule]));
    });
  });

  describe('useDefaultLocation', () => {
    it('returns default location from locations', async () => {
      mockedService.mockReturnValue({
        getLocations: vi.fn().mockResolvedValue({ locations: [mockLocation] }),
      } as unknown as ReturnType<typeof useLocationService>);
      const { result } = renderHook(() => useDefaultLocation(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current).toEqual(mockLocation));
    });
  });
});
