/**
 * Type-safe field keys for workout customization
 *
 * This centralizes all field key constants to prevent typos and enable
 * better TypeScript support throughout the validation system.
 */

export const CUSTOMIZATION_FIELD_KEYS = {
  FOCUS: 'customization_focus',
  ENERGY: 'customization_energy',
  DURATION: 'customization_duration',
  EQUIPMENT: 'customization_equipment',
  AREAS: 'customization_areas',
  SORENESS: 'customization_soreness',
  STRESS: 'customization_stress',
  SLEEP: 'customization_sleep',
  INCLUDE: 'customization_include',
  EXCLUDE: 'customization_exclude',
} as const;

export type CustomizationFieldKey =
  (typeof CUSTOMIZATION_FIELD_KEYS)[keyof typeof CUSTOMIZATION_FIELD_KEYS];

/**
 * Step-specific field key groups for easier validation
 */
export const STEP_FIELD_KEYS = {
  FOCUS_ENERGY: [
    CUSTOMIZATION_FIELD_KEYS.FOCUS,
    CUSTOMIZATION_FIELD_KEYS.ENERGY,
  ] as const,
  DURATION_EQUIPMENT: [
    CUSTOMIZATION_FIELD_KEYS.DURATION,
    CUSTOMIZATION_FIELD_KEYS.EQUIPMENT,
  ] as const,
} as const;

/**
 * Helper function to get field keys for a specific step
 */
export function getStepFieldKeys(
  step: 'focus-energy' | 'duration-equipment'
): readonly CustomizationFieldKey[] {
  return step === 'focus-energy'
    ? STEP_FIELD_KEYS.FOCUS_ENERGY
    : STEP_FIELD_KEYS.DURATION_EQUIPMENT;
}
