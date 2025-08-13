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
  ENERGY_LEVEL_OPTIONS,
  QUICK_WORKOUT_DURATION_OPTIONS,
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
      description: getAreaDescription(option.value),
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
      description: getAreaDescription(option.value),
      // No tertiary content for body areas
    }))
  );
};

/**
 * Get area descriptions for focus areas and soreness areas
 */
const getAreaDescription = (areaValue: string): string => {
  const descriptions: Record<string, string> = {
    // Focus areas
    upper_body: 'Chest, shoulders, arms, and back',
    lower_body: 'Legs, glutes, and calves',
    core: 'Abdominals and lower back',
    back: 'Upper and lower back muscles',
    shoulders: 'Deltoids and rotator cuff',
    chest: 'Pectorals and surrounding muscles',
    arms: 'Biceps, triceps, and forearms',
    mobility_flexibility: 'Joint mobility and muscle flexibility',
    cardio: 'Cardiovascular endurance',
    recovery_stretching: 'Gentle recovery and stretching',

    // Soreness areas
    neck_shoulders: 'Neck and shoulder region',
    upper_back: 'Upper back and trapezius',
    lower_back: 'Lower back and lumbar region',
    glutes: 'Gluteal muscles',
    quads: 'Front of thighs',
    hamstrings: 'Back of thighs',
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
