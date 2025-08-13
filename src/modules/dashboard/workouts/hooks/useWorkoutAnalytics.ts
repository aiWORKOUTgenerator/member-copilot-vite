/**
 * Workout analytics tracking hook
 *
 * Provides analytics tracking functionality specifically for workout customization
 * interactions, including field selections, step completions, and validation errors.
 * Integrates with the existing analytics service to provide consistent event tracking.
 */

import { useCallback } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { AnalyticsService } from '@/services/analytics';
import { getFieldType } from '../constants/fieldTypes';

/**
 * Analytics events specific to workout customization
 */
export interface WorkoutAnalyticsEvents {
  // Field selection events
  workout_field_selected: {
    field: string;
    value: unknown;
    valueType:
      | 'single-select'
      | 'multi-select'
      | 'rating'
      | 'duration'
      | 'text';
    mode: 'quick' | 'detailed';
    timestamp: number;
  };

  // Step completion events
  workout_step_completed: {
    step: string;
    duration: number;
    mode: 'quick' | 'detailed';
    completionRate: number;
    fieldCount: number;
    timestamp: number;
  };

  // Validation error events
  workout_validation_error: {
    field: string;
    error: string;
    mode: 'quick' | 'detailed';
    value: unknown;
    timestamp: number;
  };

  // Workflow completion events
  workout_setup_completed: {
    mode: 'quick' | 'detailed';
    totalDuration: number;
    fieldsCompleted: number;
    totalFields: number;
    completionRate: number;
    timestamp: number;
  };

  // Workflow abandonment events
  workout_setup_abandoned: {
    mode: 'quick' | 'detailed';
    lastStep: string;
    duration: number;
    fieldsCompleted: number;
    totalFields: number;
    completionRate: number;
    timestamp: number;
  };
}

/**
 * Hook for tracking workout-specific analytics events
 */
export const useWorkoutAnalytics = () => {
  const analytics: AnalyticsService = useAnalytics();

  /**
   * Track field selection events
   */
  const trackSelection = useCallback(
    (fieldKey: string, value: unknown, mode: 'quick' | 'detailed') => {
      try {
        // Determine value type for better analytics using shared field type mapping
        let valueType: WorkoutAnalyticsEvents['workout_field_selected']['valueType'];

        if (Array.isArray(value)) {
          valueType = 'multi-select';
        } else {
          const fieldType = getFieldType(fieldKey);
          if (fieldType) {
            valueType = fieldType;
          } else {
            // Fallback for unknown fields
            valueType = 'single-select';
          }
        }

        analytics.track('workout_field_selected', {
          field: fieldKey,
          value: Array.isArray(value) ? value.length : value,
          valueType,
          mode,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track workout field selection:', error);
      }
    },
    [analytics]
  );

  /**
   * Track step completion events
   */
  const trackStepCompletion = useCallback(
    (
      step: string,
      duration: number,
      mode: 'quick' | 'detailed',
      completionRate: number,
      fieldCount: number = 0
    ) => {
      try {
        analytics.track('workout_step_completed', {
          step,
          duration,
          mode,
          completionRate,
          fieldCount,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track workout step completion:', error);
      }
    },
    [analytics]
  );

  /**
   * Track validation error events
   */
  const trackValidationError = useCallback(
    (
      fieldKey: string,
      errorMessage: string,
      mode: 'quick' | 'detailed',
      value: unknown = null
    ) => {
      try {
        analytics.track('workout_validation_error', {
          field: fieldKey,
          error: errorMessage,
          mode,
          value: Array.isArray(value) ? value.length : value,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track workout validation error:', error);
      }
    },
    [analytics]
  );

  /**
   * Track workout setup completion
   */
  const trackWorkoutSetupCompleted = useCallback(
    (
      mode: 'quick' | 'detailed',
      totalDuration: number,
      fieldsCompleted: number,
      totalFields: number
    ) => {
      try {
        const completionRate =
          totalFields > 0 ? (fieldsCompleted / totalFields) * 100 : 0;

        analytics.track('workout_setup_completed', {
          mode,
          totalDuration,
          fieldsCompleted,
          totalFields,
          completionRate,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track workout setup completion:', error);
      }
    },
    [analytics]
  );

  /**
   * Track workout setup abandonment
   */
  const trackWorkoutSetupAbandoned = useCallback(
    (
      mode: 'quick' | 'detailed',
      lastStep: string,
      duration: number,
      fieldsCompleted: number,
      totalFields: number
    ) => {
      try {
        const completionRate =
          totalFields > 0 ? (fieldsCompleted / totalFields) * 100 : 0;

        analytics.track('workout_setup_abandoned', {
          mode,
          lastStep,
          duration,
          fieldsCompleted,
          totalFields,
          completionRate,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track workout setup abandonment:', error);
      }
    },
    [analytics]
  );

  return {
    trackSelection,
    trackStepCompletion,
    trackValidationError,
    trackWorkoutSetupCompleted,
    trackWorkoutSetupAbandoned,
  };
};

/**
 * Type-safe analytics tracking for specific workout fields
 */
export const useWorkoutFieldAnalytics = () => {
  const { trackSelection } = useWorkoutAnalytics();

  return {
    /**
     * Track focus selection (quick mode)
     */
    trackFocusSelection: useCallback(
      (focus: string) => {
        trackSelection('customization_focus', focus, 'quick');
      },
      [trackSelection]
    ),

    /**
     * Track energy level selection
     */
    trackEnergySelection: useCallback(
      (energy: number, mode: 'quick' | 'detailed' = 'quick') => {
        trackSelection('customization_energy', energy, mode);
      },
      [trackSelection]
    ),

    /**
     * Track duration selection
     */
    trackDurationSelection: useCallback(
      (duration: number, mode: 'quick' | 'detailed' = 'quick') => {
        trackSelection('customization_duration', duration, mode);
      },
      [trackSelection]
    ),

    /**
     * Track equipment selection
     */
    trackEquipmentSelection: useCallback(
      (equipment: string[], mode: 'quick' | 'detailed' = 'quick') => {
        trackSelection('customization_equipment', equipment, mode);
      },
      [trackSelection]
    ),

    /**
     * Track focus areas selection (detailed mode)
     */
    trackFocusAreasSelection: useCallback(
      (areas: string[]) => {
        trackSelection('customization_areas', areas, 'detailed');
      },
      [trackSelection]
    ),

    /**
     * Track sleep quality selection (detailed mode)
     */
    trackSleepQualitySelection: useCallback(
      (sleep: number) => {
        trackSelection('customization_sleep', sleep, 'detailed');
      },
      [trackSelection]
    ),

    /**
     * Track stress level selection (detailed mode)
     */
    trackStressLevelSelection: useCallback(
      (stress: number) => {
        trackSelection('customization_stress', stress, 'detailed');
      },
      [trackSelection]
    ),

    /**
     * Track soreness areas selection (detailed mode)
     */
    trackSorenessSelection: useCallback(
      (soreness: string[]) => {
        trackSelection('customization_soreness', soreness, 'detailed');
      },
      [trackSelection]
    ),
  };
};
