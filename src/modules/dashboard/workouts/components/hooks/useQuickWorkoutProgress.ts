import { useMemo } from 'react';
import type { PerWorkoutOptions } from '../types';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';

export interface QuickWorkoutProgressReturn {
  /** Overall progress percentage (0-100) */
  overallProgress: number;
  /** Progress for Focus & Energy step (0-100) */
  focusEnergyProgress: number;
  /** Progress for Duration & Equipment step (0-100) */
  durationEquipmentProgress: number;
  /** Total number of required fields */
  totalFields: number;
  /** Number of completed fields */
  completedFields: number;
}

/**
 * Hook to calculate progress for Quick Workout Setup
 * Tracks completion of required fields across both steps
 */
export const useQuickWorkoutProgress = (
  options: PerWorkoutOptions
): QuickWorkoutProgressReturn => {
  return useMemo(() => {
    // Define required fields for each step
    const focusEnergyFields = [
      CUSTOMIZATION_FIELD_KEYS.FOCUS,
      CUSTOMIZATION_FIELD_KEYS.ENERGY,
    ];

    const durationEquipmentFields = [
      CUSTOMIZATION_FIELD_KEYS.DURATION,
      CUSTOMIZATION_FIELD_KEYS.EQUIPMENT,
    ];

    const allRequiredFields = [
      ...focusEnergyFields,
      ...durationEquipmentFields,
    ];

    // Helper function to check if a field is completed
    const isFieldCompleted = (field: keyof PerWorkoutOptions): boolean => {
      const value = options[field];
      return (
        value !== undefined &&
        value !== null &&
        (Array.isArray(value)
          ? value.length > 0
          : typeof value === 'string'
            ? value !== ''
            : typeof value === 'number'
              ? value !== 0
              : Boolean(value))
      );
    };

    // Calculate completed fields for each step
    const completedFocusEnergyFields =
      focusEnergyFields.filter(isFieldCompleted);
    const completedDurationEquipmentFields =
      durationEquipmentFields.filter(isFieldCompleted);
    const totalCompletedFields = [
      ...completedFocusEnergyFields,
      ...completedDurationEquipmentFields,
    ];

    // Calculate progress percentages
    const focusEnergyProgress = Math.round(
      (completedFocusEnergyFields.length / focusEnergyFields.length) * 100
    );

    const durationEquipmentProgress = Math.round(
      (completedDurationEquipmentFields.length /
        durationEquipmentFields.length) *
        100
    );

    const overallProgress = Math.round(
      (totalCompletedFields.length / allRequiredFields.length) * 100
    );

    return {
      overallProgress,
      focusEnergyProgress,
      durationEquipmentProgress,
      totalFields: allRequiredFields.length,
      completedFields: totalCompletedFields.length,
    };
  }, [options]);
};
