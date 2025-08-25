/**
 * @vitest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  useWorkoutAnalytics,
  useWorkoutFieldAnalytics,
} from '../useWorkoutAnalytics';
import { useAnalytics } from '@/hooks/useAnalytics';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';

// Mock the analytics service
vi.mock('@/hooks/useAnalytics');

const mockAnalytics = {
  track: vi.fn(),
  page: vi.fn(),
  identify: vi.fn(),
  reset: vi.fn(),
  initialize: vi.fn(),
};

const mockedUseAnalytics = useAnalytics as ReturnType<
  typeof vi.mocked<typeof useAnalytics>
>;

describe('useWorkoutAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAnalytics.mockReturnValue(mockAnalytics);
    // Mock Date.now() for consistent timestamps
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('field type detection', () => {
    it('should correctly detect rating field types', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackSelection(
          CUSTOMIZATION_FIELD_KEYS.ENERGY,
          4,
          'detailed'
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_field_selected',
        {
          field: CUSTOMIZATION_FIELD_KEYS.ENERGY,
          value: 4,
          valueType: 'rating',
          mode: 'detailed',
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should correctly detect duration field types', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackSelection(
          CUSTOMIZATION_FIELD_KEYS.DURATION,
          30,
          'detailed'
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_field_selected',
        {
          field: CUSTOMIZATION_FIELD_KEYS.DURATION,
          value: 30,
          valueType: 'duration',
          mode: 'detailed',
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should correctly detect text field types', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackSelection(
          CUSTOMIZATION_FIELD_KEYS.INCLUDE,
          'pushups, squats',
          'detailed'
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_field_selected',
        {
          field: CUSTOMIZATION_FIELD_KEYS.INCLUDE,
          value: 'pushups, squats',
          valueType: 'text',
          mode: 'detailed',
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should correctly detect single-select field types', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackSelection(
          CUSTOMIZATION_FIELD_KEYS.FOCUS,
          'strength',
          'detailed'
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_field_selected',
        {
          field: CUSTOMIZATION_FIELD_KEYS.FOCUS,
          value: 'strength',
          valueType: 'single-select',
          mode: 'detailed',
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should correctly detect multi-select field types for arrays', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackSelection(
          CUSTOMIZATION_FIELD_KEYS.AREAS,
          ['upper_body', 'core'],
          'detailed'
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_field_selected',
        {
          field: CUSTOMIZATION_FIELD_KEYS.AREAS,
          value: 2, // Array length for multi-select
          valueType: 'multi-select',
          mode: 'detailed',
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should fallback to single-select for unknown fields', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackSelection(
          'unknown_field',
          'some_value',
          'detailed'
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_field_selected',
        {
          field: 'unknown_field',
          value: 'some_value',
          valueType: 'single-select',
          mode: 'detailed',
          eventTimestamp: 1234567890,
        }
      );
    });
  });

  describe('trackSelection', () => {
    it('should track single-select field selections correctly', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackSelection(
          'customization_focus',
          'strength',
          'quick'
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_field_selected',
        {
          field: 'customization_focus',
          value: 'strength',
          valueType: 'single-select',
          mode: 'quick',
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should track multi-select field selections correctly', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackSelection(
          'customization_areas',
          ['upper_body', 'core'],
          'detailed'
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_field_selected',
        {
          field: 'customization_areas',
          value: 2, // Array length
          valueType: 'multi-select',
          mode: 'detailed',
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should track rating field selections correctly', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackSelection('customization_energy', 4, 'quick');
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_field_selected',
        {
          field: 'customization_energy',
          value: 4,
          valueType: 'rating',
          mode: 'quick',
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should track duration field selections correctly', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackSelection('customization_duration', 30, 'quick');
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_field_selected',
        {
          field: 'customization_duration',
          value: 30,
          valueType: 'duration',
          mode: 'quick',
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should track text field selections correctly', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackSelection(
          'customization_include',
          'push-ups, squats',
          'detailed'
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_field_selected',
        {
          field: 'customization_include',
          value: 'push-ups, squats',
          valueType: 'text',
          mode: 'detailed',
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should handle analytics errors gracefully', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      mockAnalytics.track.mockImplementation(() => {
        throw new Error('Analytics service error');
      });

      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackSelection(
          'customization_focus',
          'strength',
          'quick'
        );
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to track workout field selection:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('trackStepCompletion', () => {
    it('should track step completion events correctly', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackStepCompletion(
          'workout-structure',
          5000,
          'detailed',
          75,
          3
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_step_completed',
        {
          step: 'workout-structure',
          duration: 5000,
          mode: 'detailed',
          completionRate: 75,
          fieldCount: 3,
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should handle analytics errors gracefully', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      mockAnalytics.track.mockImplementation(() => {
        throw new Error('Analytics service error');
      });

      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackStepCompletion(
          'current-state',
          3000,
          'detailed',
          50,
          2
        );
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to track workout step completion:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('trackValidationError', () => {
    it('should track validation error events correctly', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackValidationError(
          'customization_energy',
          'Energy level must be between 1 and 6',
          'detailed',
          7
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_validation_error',
        {
          field: 'customization_energy',
          error: 'Energy level must be between 1 and 6',
          mode: 'detailed',
          value: 7,
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should handle array values in validation errors', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackValidationError(
          'customization_areas',
          'Select up to 5 areas',
          'detailed',
          ['upper_body', 'lower_body', 'core', 'back', 'shoulders', 'chest']
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_validation_error',
        {
          field: 'customization_areas',
          error: 'Select up to 5 areas',
          mode: 'detailed',
          value: 6, // Array length
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should handle null values in validation errors', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackValidationError(
          'customization_focus',
          'This field is required',
          'quick'
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_validation_error',
        {
          field: 'customization_focus',
          error: 'This field is required',
          mode: 'quick',
          value: null,
          eventTimestamp: 1234567890,
        }
      );
    });
  });

  describe('trackWorkoutSetupCompleted', () => {
    it('should track workout setup completion correctly', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackWorkoutSetupCompleted('detailed', 45000, 8, 10);
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_setup_completed',
        {
          mode: 'detailed',
          totalDuration: 45000,
          fieldsCompleted: 8,
          totalFields: 10,
          completionRate: 80,
          eventTimestamp: 1234567890,
        }
      );
    });

    it('should handle zero total fields', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackWorkoutSetupCompleted('quick', 10000, 0, 0);
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_setup_completed',
        {
          mode: 'quick',
          totalDuration: 10000,
          fieldsCompleted: 0,
          totalFields: 0,
          completionRate: 0,
          eventTimestamp: 1234567890,
        }
      );
    });
  });

  describe('trackWorkoutSetupAbandoned', () => {
    it('should track workout setup abandonment correctly', () => {
      const { result } = renderHook(() => useWorkoutAnalytics());

      act(() => {
        result.current.trackWorkoutSetupAbandoned(
          'detailed',
          'current-state',
          20000,
          3,
          10
        );
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith(
        'workout_setup_abandoned',
        {
          mode: 'detailed',
          lastStep: 'current-state',
          duration: 20000,
          fieldsCompleted: 3,
          totalFields: 10,
          completionRate: 30,
          eventTimestamp: 1234567890,
        }
      );
    });
  });
});

describe('useWorkoutFieldAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAnalytics.mockReturnValue(mockAnalytics);
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should track focus selection correctly', () => {
    const { result } = renderHook(() => useWorkoutFieldAnalytics());

    act(() => {
      result.current.trackFocusSelection('strength');
    });

    expect(mockAnalytics.track).toHaveBeenCalledWith('workout_field_selected', {
      field: 'customization_focus',
      value: 'strength',
      valueType: 'single-select',
      mode: 'quick',
      eventTimestamp: 1234567890,
    });
  });

  it('should track energy selection with default mode', () => {
    const { result } = renderHook(() => useWorkoutFieldAnalytics());

    act(() => {
      result.current.trackEnergySelection(4);
    });

    expect(mockAnalytics.track).toHaveBeenCalledWith('workout_field_selected', {
      field: 'customization_energy',
      value: 4,
      valueType: 'rating',
      mode: 'quick',
      eventTimestamp: 1234567890,
    });
  });

  it('should track energy selection with specified mode', () => {
    const { result } = renderHook(() => useWorkoutFieldAnalytics());

    act(() => {
      result.current.trackEnergySelection(3, 'detailed');
    });

    expect(mockAnalytics.track).toHaveBeenCalledWith('workout_field_selected', {
      field: 'customization_energy',
      value: 3,
      valueType: 'rating',
      mode: 'detailed',
      eventTimestamp: 1234567890,
    });
  });

  it('should track duration selection correctly', () => {
    const { result } = renderHook(() => useWorkoutFieldAnalytics());

    act(() => {
      result.current.trackDurationSelection(30);
    });

    expect(mockAnalytics.track).toHaveBeenCalledWith('workout_field_selected', {
      field: 'customization_duration',
      value: 30,
      valueType: 'duration',
      mode: 'quick',
      eventTimestamp: 1234567890,
    });
  });

  it('should track equipment selection correctly', () => {
    const { result } = renderHook(() => useWorkoutFieldAnalytics());

    act(() => {
      result.current.trackEquipmentSelection(['dumbbells', 'resistance_bands']);
    });

    expect(mockAnalytics.track).toHaveBeenCalledWith('workout_field_selected', {
      field: 'customization_equipment',
      value: 2, // Array length
      valueType: 'multi-select',
      mode: 'quick',
      eventTimestamp: 1234567890,
    });
  });

  it('should track focus areas selection (detailed mode)', () => {
    const { result } = renderHook(() => useWorkoutFieldAnalytics());

    act(() => {
      result.current.trackFocusAreasSelection(['upper_body', 'core']);
    });

    expect(mockAnalytics.track).toHaveBeenCalledWith('workout_field_selected', {
      field: 'customization_areas',
      value: 2, // Array length
      valueType: 'multi-select',
      mode: 'detailed',
      eventTimestamp: 1234567890,
    });
  });

  it('should track sleep quality selection correctly', () => {
    const { result } = renderHook(() => useWorkoutFieldAnalytics());

    act(() => {
      result.current.trackSleepQualitySelection(5);
    });

    expect(mockAnalytics.track).toHaveBeenCalledWith('workout_field_selected', {
      field: 'customization_sleep',
      value: 5,
      valueType: 'rating',
      mode: 'detailed',
      eventTimestamp: 1234567890,
    });
  });

  it('should track stress level selection correctly', () => {
    const { result } = renderHook(() => useWorkoutFieldAnalytics());

    act(() => {
      result.current.trackStressLevelSelection(2);
    });

    expect(mockAnalytics.track).toHaveBeenCalledWith('workout_field_selected', {
      field: 'customization_stress',
      value: 2,
      valueType: 'rating',
      mode: 'detailed',
      eventTimestamp: 1234567890,
    });
  });

  it('should track soreness selection correctly', () => {
    const { result } = renderHook(() => useWorkoutFieldAnalytics());

    act(() => {
      result.current.trackSorenessSelection(['lower_back', 'shoulders']);
    });

    expect(mockAnalytics.track).toHaveBeenCalledWith('workout_field_selected', {
      field: 'customization_soreness',
      value: 2, // Array length
      valueType: 'multi-select',
      mode: 'detailed',
      eventTimestamp: 1234567890,
    });
  });
});
