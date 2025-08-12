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
    // Focus & Energy step fields
    const focusEnergyFields = [
      CUSTOMIZATION_FIELD_KEYS.FOCUS,
      CUSTOMIZATION_FIELD_KEYS.ENERGY,
    ];

    // Duration & Equipment step fields
    const durationEquipmentFields = [
      CUSTOMIZATION_FIELD_KEYS.DURATION,
      CUSTOMIZATION_FIELD_KEYS.EQUIPMENT,
    ];

    // Helper function to check if a field is completed
    const isFieldCompleted = (fieldKey: string): boolean => {
      const value = options[fieldKey as keyof PerWorkoutOptions];
      if (value === undefined || value === null) return false;

      // Handle different value types
      if (typeof value === 'string') return value.length > 0;
      if (typeof value === 'number') return value > 0;
      if (Array.isArray(value)) return value.length > 0;

      return false;
    };

    // Calculate completion for Focus & Energy step
    const focusEnergyCompleted = focusEnergyFields.filter((field) =>
      isFieldCompleted(field)
    ).length;

    const focusEnergyProgress =
      (focusEnergyCompleted / focusEnergyFields.length) * 100;

    // Calculate completion for Duration & Equipment step
    const durationEquipmentCompleted = durationEquipmentFields.filter((field) =>
      isFieldCompleted(field)
    ).length;

    const durationEquipmentProgress =
      (durationEquipmentCompleted / durationEquipmentFields.length) * 100;

    // Calculate overall progress
    const totalFields =
      focusEnergyFields.length + durationEquipmentFields.length;
    const completedFields = focusEnergyCompleted + durationEquipmentCompleted;
    const overallProgress = (completedFields / totalFields) * 100;

    return {
      overallProgress,
      focusEnergyProgress,
      durationEquipmentProgress,
      totalFields,
      completedFields,
    };
  }, [options]);
};
