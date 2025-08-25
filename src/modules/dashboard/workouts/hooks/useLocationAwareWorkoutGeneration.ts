import { useCallback } from 'react';
import { useGeneratedWorkouts } from '@/hooks/useGeneratedWorkouts';
import {
  useAllEquipment,
  useDefaultLocation,
  useLocation,
} from '@/hooks/useLocation';
import { createWorkoutParamsWithLocation } from '../components/utils/locationBasedWorkoutUtils';
import { PerWorkoutOptions } from '../components/types';

/**
 * Enhanced workout generation hook that integrates location data
 * Provides location-aware workout generation with equipment validation
 */
export function useLocationAwareWorkoutGeneration() {
  const { createWorkout } = useGeneratedWorkouts();
  const { locations, isLoading: isLocationLoading } = useLocation();
  const allEquipment = useAllEquipment();
  const defaultLocation = useDefaultLocation();

  /**
   * Generate workout with location context
   */
  const generateLocationAwareWorkout = useCallback(
    async (configId: string, options: PerWorkoutOptions, prompt: string) => {
      // Extract equipment selection from options
      const selectedEquipment = options.customization_equipment || [];

      // Create base workout parameters
      const baseParams = {
        workoutType: options.customization_focus,
        workoutStructure: 'Traditional (Reps x Sets)',
        restBetweenSets: 60,
        targetMuscleGroups: options.customization_areas?.join(', '),
        includeExercises: options.customization_include,
        excludeExercises: options.customization_exclude,
        duration: options.customization_duration,
        energyLevel: options.customization_energy,
        sleepQuality: options.customization_sleep,
        stressLevel: options.customization_stress,
        soreness: options.customization_soreness?.join(', '),
      };

      // Enhance with location data
      const enhancedParams = createWorkoutParamsWithLocation(
        baseParams,
        selectedEquipment,
        allEquipment
      );

      // Add location context to prompt
      const locationContext = defaultLocation
        ? `\n\nLocation Context: User is at ${defaultLocation.name} with the following equipment available: ${allEquipment
            .filter((eq) => eq.is_active)
            .map((eq) => eq.zone)
            .join(', ')}.`
        : '';

      const enhancedPrompt = prompt + locationContext;

      return createWorkout(configId, enhancedParams, enhancedPrompt);
    },
    [createWorkout, allEquipment, defaultLocation]
  );

  /**
   * Validate equipment selection against available location equipment
   */
  const validateEquipmentSelection = useCallback(
    (selectedEquipment: string[]): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];
      const availableCategories = [
        ...new Set(
          allEquipment.filter((eq) => eq.is_active).map((eq) => eq.category)
        ),
      ];

      // Check if selected equipment is available at location
      const unavailableEquipment = selectedEquipment.filter(
        (category) => !availableCategories.includes(category)
      );

      if (unavailableEquipment.length > 0) {
        errors.push(
          `Equipment not available at your location: ${unavailableEquipment.join(', ')}`
        );
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    [allEquipment]
  );

  /**
   * Get equipment recommendations based on workout type
   */
  const getEquipmentRecommendations = useCallback(
    (workoutType: string) => {
      return allEquipment.filter(
        (equipment) =>
          equipment.is_active &&
          equipment.exercise_types.some((type) =>
            type.toLowerCase().includes(workoutType.toLowerCase())
          )
      );
    },
    [allEquipment]
  );

  return {
    generateLocationAwareWorkout,
    validateEquipmentSelection,
    getEquipmentRecommendations,
    isLocationLoading,
    hasLocationData: locations.length > 0,
    defaultLocation,
    availableEquipment: allEquipment.filter((eq) => eq.is_active),
  };
}
