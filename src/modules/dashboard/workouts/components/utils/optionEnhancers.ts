/**
 * Performance-optimized option enhancers for workout customization
 *
 * Provides enhanced option transformations with caching and memoization
 * to improve performance and provide consistent visual indicators across
 * Quick and Detailed workout setup modes.
 */

import { useMemo, createElement } from 'react';
import { LevelDots } from '@/ui/shared/atoms';
import {
  QUICK_WORKOUT_FOCUS_OPTIONS,
  DETAILED_WORKOUT_FOCUS_OPTIONS,
  ENERGY_LEVEL_OPTIONS,
  QUICK_WORKOUT_DURATION_OPTIONS,
  DETAILED_WORKOUT_DURATION_OPTIONS,
  QUICK_WORKOUT_EQUIPMENT_OPTIONS,
  FOCUS_AREA_OPTIONS,
  SLEEP_QUALITY_OPTIONS,
  STRESS_LEVEL_OPTIONS,
  SORENESS_AREA_OPTIONS,
} from '../../constants';

// Performance optimization: Cache expensive option transformations
const enhancedOptionsCache = new Map<string, unknown>();

/**
 * Cache expensive option transformations to avoid re-computation
 * @param key - Unique cache key
 * @param enhancer - Function that generates the enhanced options
 * @returns Cached or newly generated enhanced options
 */
export const getCachedEnhancedOptions = <T>(
  key: string,
  enhancer: () => T
): T => {
  if (!enhancedOptionsCache.has(key)) {
    enhancedOptionsCache.set(key, enhancer());
  }
  return enhancedOptionsCache.get(key) as T;
};

/**
 * Clear the options cache (useful for testing or memory management)
 */
export const clearOptionsCache = (): void => {
  enhancedOptionsCache.clear();
};

/**
 * Enhanced focus options with intensity indicators (existing Quick mode)
 */
export const enhanceFocusOptionsWithIntensity = () => {
  return getCachedEnhancedOptions('focusWithIntensity', () =>
    QUICK_WORKOUT_FOCUS_OPTIONS.map((option) => {
      // Assign intensity levels based on workout type
      let intensityLevel: number;
      switch (option.id) {
        case 'gentle_recovery':
        case 'stress_reduction':
          intensityLevel = 2; // Low intensity
          break;
        case 'improve_posture':
        case 'core_abs':
          intensityLevel = 4; // Medium intensity
          break;
        case 'energizing_boost':
        case 'quick_sweat':
          intensityLevel = 6; // High intensity
          break;
        default:
          intensityLevel = 3; // Default medium
      }

      return {
        ...option,
        tertiary: createElement(LevelDots, {
          count: 6,
          activeIndex: intensityLevel - 1,
          size: 'sm',
        }),
      };
    })
  );
};

/**
 * Enhanced detailed workout focus options for session intent
 */
export const enhanceDetailedWorkoutFocusOptions = () => {
  return getCachedEnhancedOptions('detailedWorkoutFocus', () =>
    DETAILED_WORKOUT_FOCUS_OPTIONS.map((option) => ({
      id: option.id,
      title: option.title,
      description: option.description,
    }))
  );
};

/**
 * Enhanced energy options with LevelDots indicators (existing Quick mode)
 */
export const enhanceEnergyOptionsWithDots = () => {
  return getCachedEnhancedOptions('energyWithDots', () =>
    ENERGY_LEVEL_OPTIONS.map((option) => ({
      ...option,
      tertiary: createElement(LevelDots, {
        count: 6,
        activeIndex: parseInt(option.id) - 1,
        size: 'sm',
      }),
    }))
  );
};

/**
 * Enhanced duration options with subtitles (existing Quick mode)
 */
export const enhanceDurationOptionsWithSubtitles = () => {
  return getCachedEnhancedOptions('durationWithSubtitles', () =>
    QUICK_WORKOUT_DURATION_OPTIONS.map((option) => ({
      id: option.id,
      title: option.title,
      description: option.description,
      tertiary: option.subtitle,
    }))
  );
};

/**
 * Enhanced detailed duration options with comprehensive descriptions
 */
export const enhanceDetailedDurationOptionsWithSubtitles = () => {
  return getCachedEnhancedOptions('detailedDurationWithSubtitles', () =>
    DETAILED_WORKOUT_DURATION_OPTIONS.map((option) => ({
      id: option.id,
      title: option.title,
      description: option.description,
      tertiary: option.subtitle,
    }))
  );
};

/**
 * Enhanced equipment options (existing Quick mode)
 */
export const enhanceEquipmentOptions = () => {
  return getCachedEnhancedOptions('equipment', () =>
    QUICK_WORKOUT_EQUIPMENT_OPTIONS.map((option) => ({
      id: option.id,
      title: option.title,
      description: option.description,
      // No tertiary content needed for equipment
    }))
  );
};

// New enhanced options for Detailed mode

/**
 * Enhanced focus area options for detailed setup
 */
export const enhanceFocusAreaOptions = () => {
  return getCachedEnhancedOptions('focusAreas', () =>
    FOCUS_AREA_OPTIONS.map((option) => ({
      id: option.value,
      title: option.label,
      description: getFocusAreaDescription(option.value),
      // No tertiary content needed for areas
    }))
  );
};

/**
 * Enhanced sleep quality options with LevelDots
 */
export const enhanceSleepQualityOptions = () => {
  return getCachedEnhancedOptions('sleepQuality', () =>
    SLEEP_QUALITY_OPTIONS.map((option) => ({
      id: option.value.toString(),
      title: option.label,
      description: option.description,
      tertiary: createElement(LevelDots, {
        count: 6,
        activeIndex: option.value - 1,
        size: 'sm',
      }),
    }))
  );
};

/**
 * Enhanced stress level options with LevelDots
 */
export const enhanceStressLevelOptions = () => {
  return getCachedEnhancedOptions('stressLevel', () =>
    STRESS_LEVEL_OPTIONS.map((option) => ({
      id: option.value.toString(),
      title: option.label,
      description: option.description,
      tertiary: createElement(LevelDots, {
        count: 6,
        activeIndex: option.value - 1,
        size: 'sm',
      }),
    }))
  );
};

/**
 * Enhanced soreness area options for detailed setup
 */
export const enhanceSorenessAreaOptions = () => {
  return getCachedEnhancedOptions('sorenessAreas', () =>
    SORENESS_AREA_OPTIONS.map((option) => ({
      id: option.value,
      title: option.label,
      description: getSorenessAreaDescription(option.value),
      // No tertiary content for body areas
    }))
  );
};

/**
 * Get descriptions for focus areas
 */
const getFocusAreaDescription = (areaValue: string): string => {
  const descriptions: Record<string, string> = {
    full_body: 'Balanced training across all major muscle groups',
    upper_body: 'Chest, shoulders, back, arms',
    lower_body: 'Quads, hamstrings, glutes, calves',
    core: 'Abdominals, obliques, lower back',
    chest_triceps: 'Classic push-day split',
    back_biceps: 'Classic pull-day split',
    legs: 'Dedicated lower-body day (quads, glutes, hamstrings, calves)',
    shoulders_arms: 'Delts, biceps, triceps, forearms',
    push: 'Compound push-day training',
    pull: 'Compound pull-day training',
    chest_back:
      'Chest and upper-back training for a balanced push/pull workout',
    arms_only:
      'Focused training for all arm muscles (biceps, triceps, and forearms)',
    back: 'Upper and lower back muscles',
    shoulders: 'Deltoids and rotator cuff',
    mobility_flexibility: 'Joint mobility and muscle flexibility',
    cardio: 'Cardiovascular endurance',
    recovery_stretching: 'Gentle recovery and stretching',
  };

  return descriptions[areaValue] || '';
};

/**
 * Get descriptions for soreness areas
 */
const getSorenessAreaDescription = (areaValue: string): string => {
  const descriptions: Record<string, string> = {
    neck_shoulders: 'Neck and shoulder region (traps, delts)',
    upper_back: 'Upper back and trapezius',
    lower_back: 'Lumbar region and spinal erectors',
    chest: 'Pectoral muscles',
    arms_biceps_triceps: 'Front and back of upper arms',
    forearms: 'Lower arm muscles and grip',
    core: 'Abdominals, obliques, and deep core stabilizers',
    glutes: 'Gluteal muscles',
    quads: 'Front of thighs',
    hamstrings: 'Back of thighs',
    adductors: 'Groin and inner thigh muscles',
    calves: 'Lower leg muscles',
  };

  return descriptions[areaValue] || '';
};

/**
 * Hook to get all enhanced options with memoization
 * This ensures options are only computed once per component render cycle
 */
export const useEnhancedOptions = () => {
  return useMemo(
    () => ({
      // Existing Quick mode options
      focusOptions: enhanceFocusOptionsWithIntensity(),
      energyOptions: enhanceEnergyOptionsWithDots(),
      durationOptions: enhanceDurationOptionsWithSubtitles(),
      equipmentOptions: enhanceEquipmentOptions(),

      // New Detailed mode options
      focusAreaOptions: enhanceFocusAreaOptions(),
      sleepQualityOptions: enhanceSleepQualityOptions(),
      stressLevelOptions: enhanceStressLevelOptions(),
      sorenessAreaOptions: enhanceSorenessAreaOptions(),
      detailedDurationOptions: enhanceDetailedDurationOptionsWithSubtitles(),
      detailedWorkoutFocusOptions: enhanceDetailedWorkoutFocusOptions(),
    }),
    []
  );
};

/**
 * Get cache statistics for debugging and monitoring
 */
export const getCacheStats = () => {
  return {
    size: enhancedOptionsCache.size,
    keys: Array.from(enhancedOptionsCache.keys()),
  };
};
