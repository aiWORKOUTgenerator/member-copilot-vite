import { WorkoutFocusConfigurationData } from '../types';

// Define literal types for metadata fields
export const INTENSITY_LEVELS = [
  'low',
  'moderate',
  'high',
  'variable',
] as const;
export type IntensityLevel = (typeof INTENSITY_LEVELS)[number];

export const EQUIPMENT_LEVELS = ['minimal', 'moderate', 'full-gym'] as const;
export type EquipmentLevel = (typeof EQUIPMENT_LEVELS)[number];

export const EXPERIENCE_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'all-levels',
] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const FOCUS_CATEGORIES = [
  'strength_power',
  'muscle_building',
  'conditioning_cardio',
  'functional_recovery',
] as const;
export type FocusCategory = (typeof FOCUS_CATEGORIES)[number];

// Default metadata configuration
export const DEFAULT_FOCUS_METADATA: WorkoutFocusConfigurationData['metadata'] =
  {
    intensity: 'moderate',
    equipment: 'minimal',
    experience: 'all-levels',
    duration_compatibility: [30, 45, 60],
    category: 'functional_recovery',
  } as const;

// Configuration types
export const CONFIGURATION_TYPES = ['focus-only', 'focus-with-format'] as const;
export type ConfigurationType = (typeof CONFIGURATION_TYPES)[number];

// Helper function to create metadata
export function createFocusMetadata(
  intensity: IntensityLevel,
  equipment: EquipmentLevel,
  experience: ExperienceLevel,
  duration_compatibility: number[],
  category: FocusCategory
): WorkoutFocusConfigurationData['metadata'] {
  return {
    intensity,
    equipment,
    experience,
    duration_compatibility,
    category,
  } as const;
}
