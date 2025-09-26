/**
 * Workout analytics tracking hook
 *
 * Provides analytics tracking functionality specifically for workout customization
 * interactions, including field selections, step completions, and validation errors.
 * Integrates with the existing analytics service to provide consistent event tracking.
 */

import { useCallback } from 'react';
import { useAnalyticsWithTenant } from '@/hooks/useAnalytics';
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

  // Additional essential tracking events
  workout_setup_started: {
    mode: 'quick' | 'detailed';
    timestamp: number;
  };

  workout_generated: {
    mode: 'quick' | 'detailed';
    workoutId?: string;
    duration: number;
    totalFields: number;
    timestamp: number;
  };

  trainer_persona_created: {
    personaId?: string;
    timestamp: number;
  };

  user_satisfaction_rating: {
    rating: number;
    context: string;
    workoutId?: string;
    timestamp: number;
  };

  // Engagement and feature adoption events
  workout_path_selected: {
    path: 'quick' | 'detailed';
    timestamp: number;
  };

  setup_step_completed: {
    step: string;
    stepTiming: number;
    mode: 'quick' | 'detailed';
    timestamp: number;
  };

  workout_regenerated: {
    workoutId?: string;
    previousWorkoutId?: string;
    mode: 'quick' | 'detailed';
    timestamp: number;
  };

  exercise_swapped: {
    workoutId?: string;
    exerciseName: string;
    newExerciseName: string;
    timestamp: number;
  };

  workout_log_started: {
    workoutId: string;
    timestamp: number;
  };

  exercise_marked_as_complete: {
    workoutId: string;
    exerciseName: string;
    sets?: number;
    reps?: number;
    timestamp: number;
  };

  audio_play_started: {
    exerciseName: string;
    workoutId?: string;
    timestamp: number;
  };

  audio_play_finished: {
    exerciseName: string;
    duration: number;
    workoutId?: string;
    timestamp: number;
  };

  structured_workout_viewed: {
    workoutId: string;
    timestamp: number;
  };

  short_workout_viewed: {
    workoutId: string;
    timestamp: number;
  };

  step_by_step_workout_viewed: {
    workoutId: string;
    timestamp: number;
  };

  workout_shared: {
    workoutId: string;
    shareMethod: 'copy' | 'social' | 'email';
    timestamp: number;
  };
}

/**
 * Hook for tracking workout-specific analytics events
 */
export const useWorkoutAnalytics = () => {
  const analytics: AnalyticsService = useAnalyticsWithTenant();

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
          eventTimestamp: Date.now(),
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
          eventTimestamp: Date.now(),
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
          eventTimestamp: Date.now(),
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
          eventTimestamp: Date.now(),
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
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track workout setup abandonment:', error);
      }
    },
    [analytics]
  );

  /**
   * Track workout setup start
   */
  const trackWorkoutSetupStarted = useCallback(
    (mode: 'quick' | 'detailed') => {
      try {
        analytics.track('workout_setup_started', {
          mode,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track workout setup start:', error);
      }
    },
    [analytics]
  );

  /**
   * Track workout generation
   */
  const trackWorkoutGenerated = useCallback(
    (
      mode: 'quick' | 'detailed',
      duration: number,
      totalFields: number,
      workoutId?: string
    ) => {
      try {
        analytics.track('workout_generated', {
          mode,
          workoutId,
          duration,
          totalFields,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track workout generation:', error);
      }
    },
    [analytics]
  );

  /**
   * Track trainer persona creation
   */
  const trackTrainerPersonaCreated = useCallback(
    (personaId?: string) => {
      try {
        analytics.track('trainer_persona_created', {
          personaId,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track trainer persona creation:', error);
      }
    },
    [analytics]
  );

  /**
   * Track user satisfaction rating
   */
  const trackUserSatisfactionRating = useCallback(
    (rating: number, context: string, workoutId?: string) => {
      try {
        analytics.track('user_satisfaction_rating', {
          rating,
          context,
          workoutId,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track user satisfaction rating:', error);
      }
    },
    [analytics]
  );

  /**
   * Track workout path selection
   */
  const trackWorkoutPathSelected = useCallback(
    (path: 'quick' | 'detailed') => {
      try {
        analytics.track('workout_path_selected', {
          path,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track workout path selection:', error);
      }
    },
    [analytics]
  );

  /**
   * Track setup step completion with timing
   */
  const trackSetupStepCompleted = useCallback(
    (step: string, stepTiming: number, mode: 'quick' | 'detailed') => {
      try {
        analytics.track('setup_step_completed', {
          step,
          stepTiming,
          mode,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track setup step completion:', error);
      }
    },
    [analytics]
  );

  /**
   * Track workout regeneration
   */
  const trackWorkoutRegenerated = useCallback(
    (
      mode: 'quick' | 'detailed',
      workoutId?: string,
      previousWorkoutId?: string
    ) => {
      try {
        analytics.track('workout_regenerated', {
          workoutId,
          previousWorkoutId,
          mode,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track workout regeneration:', error);
      }
    },
    [analytics]
  );

  /**
   * Track exercise swap
   */
  const trackExerciseSwapped = useCallback(
    (exerciseName: string, newExerciseName: string, workoutId?: string) => {
      try {
        analytics.track('exercise_swapped', {
          workoutId,
          exerciseName,
          newExerciseName,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track exercise swap:', error);
      }
    },
    [analytics]
  );

  /**
   * Track workout log started
   */
  const trackWorkoutLogStarted = useCallback(
    (workoutId: string) => {
      try {
        analytics.track('workout_log_started', {
          workoutId,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track workout log start:', error);
      }
    },
    [analytics]
  );

  /**
   * Track exercise marked as complete
   */
  const trackExerciseMarkedAsComplete = useCallback(
    (workoutId: string, exerciseName: string, sets?: number, reps?: number) => {
      try {
        analytics.track('exercise_marked_as_complete', {
          workoutId,
          exerciseName,
          sets,
          reps,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track exercise completion:', error);
      }
    },
    [analytics]
  );

  /**
   * Track audio play events
   */
  const trackAudioPlayStarted = useCallback(
    (exerciseName: string, workoutId?: string) => {
      try {
        analytics.track('audio_play_started', {
          exerciseName,
          workoutId,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track audio play start:', error);
      }
    },
    [analytics]
  );

  const trackAudioPlayFinished = useCallback(
    (exerciseName: string, duration: number, workoutId?: string) => {
      try {
        analytics.track('audio_play_finished', {
          exerciseName,
          duration,
          workoutId,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track audio play finish:', error);
      }
    },
    [analytics]
  );

  /**
   * Track workout view events
   */
  const trackStructuredWorkoutViewed = useCallback(
    (workoutId: string) => {
      try {
        analytics.track('structured_workout_viewed', {
          workoutId,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track structured workout view:', error);
      }
    },
    [analytics]
  );

  const trackShortWorkoutViewed = useCallback(
    (workoutId: string) => {
      try {
        analytics.track('short_workout_viewed', {
          workoutId,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track short workout view:', error);
      }
    },
    [analytics]
  );

  const trackStepByStepWorkoutViewed = useCallback(
    (workoutId: string) => {
      try {
        analytics.track('step_by_step_workout_viewed', {
          workoutId,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track step by step workout view:', error);
      }
    },
    [analytics]
  );

  /**
   * Track workout sharing
   */
  const trackWorkoutShared = useCallback(
    (workoutId: string, shareMethod: 'copy' | 'social' | 'email') => {
      try {
        analytics.track('workout_shared', {
          workoutId,
          shareMethod,
          eventTimestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track workout share:', error);
      }
    },
    [analytics]
  );

  return {
    // Existing functions
    trackSelection,
    trackStepCompletion,
    trackValidationError,
    trackWorkoutSetupCompleted,
    trackWorkoutSetupAbandoned,

    // Essential tracking events
    trackWorkoutSetupStarted,
    trackWorkoutGenerated,
    trackTrainerPersonaCreated,
    trackUserSatisfactionRating,

    // Engagement and feature adoption events
    trackWorkoutPathSelected,
    trackSetupStepCompleted,
    trackWorkoutRegenerated,
    trackExerciseSwapped,
    trackWorkoutLogStarted,
    trackExerciseMarkedAsComplete,
    trackAudioPlayStarted,
    trackAudioPlayFinished,
    trackStructuredWorkoutViewed,
    trackShortWorkoutViewed,
    trackStepByStepWorkoutViewed,
    trackWorkoutShared,
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
