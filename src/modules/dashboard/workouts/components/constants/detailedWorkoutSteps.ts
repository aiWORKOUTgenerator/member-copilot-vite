import { Target, Activity, Heart } from 'lucide-react';
import type { PerWorkoutOptions } from '../types';
import type { ComponentType } from 'react';

export interface DetailedWorkoutStep {
  id: string;
  label: string;
  description: string;
  category: string;
  fields: (keyof PerWorkoutOptions)[];
  icon: ComponentType<{ className?: string }>;
  validation?: (options: PerWorkoutOptions) => {
    isValid: boolean;
    completionPercentage: number;
    missingFields: string[];
  };
}

export const DETAILED_WORKOUT_STEPS: DetailedWorkoutStep[] = [
  {
    id: 'workout-structure',
    label: 'Workout Structure',
    description: 'Duration, focus, and target areas',
    category: 'Workout Goals & Structure',
    fields: [
      'customization_duration',
      'customization_focus',
      'customization_areas',
    ],
    icon: Target,
    validation: (options) => {
      const fields = [
        'customization_duration',
        'customization_focus',
        'customization_areas',
      ] as const;
      const filledFields = fields.filter((field) => {
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
      });

      return {
        isValid: true, // All optional, so always valid
        completionPercentage: Math.round(
          (filledFields.length / fields.length) * 100
        ),
        missingFields: fields.filter((field) => !filledFields.includes(field)),
      };
    },
  },
  {
    id: 'equipment-preferences',
    label: 'Equipment & Preferences',
    description: 'Available equipment and exercise preferences',
    category: 'Physical Focus & Equipment',
    fields: [
      'customization_equipment',
      'customization_include',
      'customization_exclude',
    ],
    icon: Activity,
    validation: (options) => {
      const fields = [
        'customization_equipment',
        'customization_include',
        'customization_exclude',
      ] as const;
      const filledFields = fields.filter((field) => {
        const value = options[field];
        return (
          value !== undefined &&
          value !== null &&
          (Array.isArray(value) ? value.length > 0 : value !== '')
        );
      });

      return {
        isValid: true,
        completionPercentage: Math.round(
          (filledFields.length / fields.length) * 100
        ),
        missingFields: fields.filter((field) => !filledFields.includes(field)),
      };
    },
  },
  {
    id: 'current-state',
    label: 'Current State',
    description: 'Energy, stress, sleep, and recovery status',
    category: 'Current State & Wellness',
    fields: [
      'customization_energy',
      'customization_stress',
      'customization_sleep',
      'customization_soreness',
    ],
    icon: Heart,
    validation: (options) => {
      const fields = [
        'customization_energy',
        'customization_stress',
        'customization_sleep',
        'customization_soreness',
      ] as const;
      const filledFields = fields.filter((field) => {
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
      });

      return {
        isValid: true,
        completionPercentage: Math.round(
          (filledFields.length / fields.length) * 100
        ),
        missingFields: fields.filter((field) => !filledFields.includes(field)),
      };
    },
  },
];

// Helper functions
export const getStepById = (id: string): DetailedWorkoutStep | undefined => {
  return DETAILED_WORKOUT_STEPS.find((step) => step.id === id);
};

export const getNextStep = (
  currentStepId: string
): DetailedWorkoutStep | undefined => {
  const currentIndex = DETAILED_WORKOUT_STEPS.findIndex(
    (step) => step.id === currentStepId
  );
  return currentIndex >= 0 && currentIndex < DETAILED_WORKOUT_STEPS.length - 1
    ? DETAILED_WORKOUT_STEPS[currentIndex + 1]
    : undefined;
};

export const getPreviousStep = (
  currentStepId: string
): DetailedWorkoutStep | undefined => {
  const currentIndex = DETAILED_WORKOUT_STEPS.findIndex(
    (step) => step.id === currentStepId
  );
  return currentIndex > 0
    ? DETAILED_WORKOUT_STEPS[currentIndex - 1]
    : undefined;
};
