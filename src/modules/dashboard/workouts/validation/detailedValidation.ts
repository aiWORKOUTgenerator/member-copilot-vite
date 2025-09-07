/**
 * Progressive validation system for detailed workout customization
 *
 * Implements intelligent validation that only shows errors when appropriate,
 * provides helpful feedback, and guides users through the workout setup process.
 * Built on top of the foundation validation utilities from PR #1.
 */

import { validateFieldValue } from '../types/detailedOptions';
import { FIELD_TYPE_MAP } from '../constants/fieldTypes';
import {
  getValidationMessage,
  ValidationMessageHelpers,
  DETAILED_VALIDATION_MESSAGES,
} from '../constants/validationMessages';

/**
 * Interface for workout options (matches existing PerWorkoutOptions)
 */
export interface WorkoutOptions {
  customization_focus?: string;
  customization_energy?: number;
  customization_duration?: number;
  customization_equipment?: string[];
  customization_areas?: string[];
  customization_soreness?: string[];
  customization_stress?: number;
  customization_sleep?: number;
  customization_include?: string;
  customization_exclude?: string;
  customization_prompt?: string;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof WorkoutOptions, string>>;
  warnings: Partial<Record<keyof WorkoutOptions, string>>;
  suggestions: string[];
}

/**
 * Step-specific validation configuration
 */
export interface StepValidationConfig {
  requiredFields?: (keyof WorkoutOptions)[];
  optionalFields?: (keyof WorkoutOptions)[];
  progressiveGroups?: {
    name: string;
    fields: (keyof WorkoutOptions)[];
    requireAll?: boolean;
    requireAny?: boolean;
  }[];
}

/**
 * Step validation configurations
 */
const STEP_VALIDATION_CONFIGS: Record<string, StepValidationConfig> = {
  'workout-structure': {
    optionalFields: [
      'customization_focus',
      'customization_duration',
      'customization_areas',
    ],
  },
  'current-state': {
    optionalFields: [
      'customization_energy',
      'customization_sleep',
      'customization_stress',
      'customization_soreness',
    ],
    progressiveGroups: [
      {
        name: 'wellness',
        fields: [
          'customization_energy',
          'customization_sleep',
          'customization_stress',
        ],
        requireAll: false, // Progressive: if one is selected, encourage all
      },
    ],
  },
  'equipment-preferences': {
    optionalFields: [
      'customization_equipment',
      'customization_include',
      'customization_exclude',
    ],
  },
  'additional-context': {
    optionalFields: ['customization_prompt'],
  },
};

/**
 * Validate a single field using the foundation validation system
 */
export const validateSingleField = (
  fieldKey: keyof WorkoutOptions,
  value: unknown
): { isValid: boolean; error?: string } => {
  // Use shared field type mapping for consistency with analytics
  const fieldType = FIELD_TYPE_MAP[fieldKey];
  if (!fieldType) {
    return { isValid: true }; // Unknown fields pass validation
  }

  // Use foundation validation system
  const result = validateFieldValue(fieldKey, fieldType, value);

  // Enhance error message if needed
  if (!result.isValid && result.error) {
    const enhancedMessage = getValidationMessage(
      fieldKey,
      'invalid',
      result.error
    );
    return { isValid: false, error: enhancedMessage };
  }

  return result;
};

/**
 * Progressive validation for wellness fields
 * Only shows errors/warnings when the user has started filling out the wellness group
 */
const validateWellnessGroup = (
  options: WorkoutOptions
): {
  errors: Partial<Record<keyof WorkoutOptions, string>>;
  warnings: Partial<Record<keyof WorkoutOptions, string>>;
  suggestions: string[];
} => {
  const errors: Partial<Record<keyof WorkoutOptions, string>> = {};
  const warnings: Partial<Record<keyof WorkoutOptions, string>> = {};
  const suggestions: string[] = [];

  const wellnessFields = [
    'customization_energy',
    'customization_sleep',
    'customization_stress',
  ] as const;
  const completedWellnessFields = wellnessFields.filter(
    (field) => options[field] != null
  );

  // If no wellness fields are completed, no validation needed
  if (completedWellnessFields.length === 0) {
    return { errors, warnings, suggestions };
  }

  // If some but not all wellness fields are completed, provide progressive guidance
  if (
    completedWellnessFields.length > 0 &&
    completedWellnessFields.length < wellnessFields.length
  ) {
    const incompleteFields = wellnessFields.filter(
      (field) => options[field] == null
    );

    // Add suggestions instead of hard errors for better UX
    suggestions.push(
      ValidationMessageHelpers.getWellnessGroupMessage(
        completedWellnessFields,
        wellnessFields as unknown as string[]
      )
    );

    // Add warnings for incomplete fields (non-blocking)
    incompleteFields.forEach((field) => {
      warnings[field] = getValidationMessage(field, 'suggested');
    });
  }

  // Validate completed wellness fields
  completedWellnessFields.forEach((field) => {
    const validation = validateSingleField(field, options[field]);
    if (!validation.isValid && validation.error) {
      errors[field] = validation.error;
    }
  });

  return { errors, warnings, suggestions };
};

/**
 * Validate a specific step with progressive logic
 */
export const validateDetailedStep = (
  step:
    | 'workout-structure'
    | 'current-state'
    | 'equipment-preferences'
    | 'additional-context',
  options: WorkoutOptions
): ValidationResult => {
  const config = STEP_VALIDATION_CONFIGS[step];
  const errors: Partial<Record<keyof WorkoutOptions, string>> = {};
  const warnings: Partial<Record<keyof WorkoutOptions, string>> = {};
  let suggestions: string[] = [];

  if (!config) {
    return { isValid: true, errors, warnings, suggestions };
  }

  // Validate required fields
  if (config.requiredFields) {
    config.requiredFields.forEach((fieldKey) => {
      const value = options[fieldKey];

      // Check if field is empty
      if (
        value == null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        errors[fieldKey] = getValidationMessage(fieldKey, 'required');
        return;
      }

      // Validate field value
      const validation = validateSingleField(fieldKey, value);
      if (!validation.isValid && validation.error) {
        errors[fieldKey] = validation.error;
      }
    });
  }

  // Validate optional fields (only if they have values)
  if (config.optionalFields) {
    config.optionalFields.forEach((fieldKey) => {
      const value = options[fieldKey];

      // Skip validation for empty optional fields
      if (
        value == null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return;
      }

      // Validate non-empty optional fields
      const validation = validateSingleField(fieldKey, value);
      if (!validation.isValid && validation.error) {
        errors[fieldKey] = validation.error;
      }
    });
  }

  // Handle progressive groups (like wellness fields)
  if (config.progressiveGroups) {
    config.progressiveGroups.forEach((group) => {
      if (group.name === 'wellness') {
        const wellnessValidation = validateWellnessGroup(options);
        Object.assign(errors, wellnessValidation.errors);
        Object.assign(warnings, wellnessValidation.warnings);
        suggestions = [...suggestions, ...wellnessValidation.suggestions];
      }
    });
  }

  // Special validation for current-state step
  if (step === 'current-state') {
    // Validate soreness areas count
    if (
      options.customization_soreness &&
      options.customization_soreness.length > 5
    ) {
      errors.customization_soreness = DETAILED_VALIDATION_MESSAGES.SORENESS_MAX;
    }
  }

  // Special validation for workout-structure step
  if (step === 'workout-structure') {
    // Validate focus areas count
    if (options.customization_areas && options.customization_areas.length > 5) {
      errors.customization_areas = DETAILED_VALIDATION_MESSAGES.AREAS_MAX;
    }
  }

  // Special validation for equipment-preferences step
  if (step === 'equipment-preferences') {
    // Validate equipment selection
    if (
      options.customization_equipment &&
      options.customization_equipment.length > 10
    ) {
      errors.customization_equipment =
        DETAILED_VALIDATION_MESSAGES.EQUIPMENT_MAX;
    }

    // Validate text fields length
    if (
      options.customization_include &&
      options.customization_include.length > 500
    ) {
      errors.customization_include =
        DETAILED_VALIDATION_MESSAGES.INCLUDE_MAX_LENGTH;
    }

    if (
      options.customization_exclude &&
      options.customization_exclude.length > 500
    ) {
      errors.customization_exclude =
        DETAILED_VALIDATION_MESSAGES.EXCLUDE_MAX_LENGTH;
    }
  }

  // Special validation for additional-context step
  if (step === 'additional-context') {
    // Validate prompt length
    if (
      options.customization_prompt &&
      options.customization_prompt.length > 500
    ) {
      errors.customization_prompt =
        DETAILED_VALIDATION_MESSAGES.PROMPT_MAX_LENGTH;
    }

    if (
      options.customization_prompt &&
      options.customization_prompt.trim().length > 0 &&
      options.customization_prompt.trim().length < 10
    ) {
      errors.customization_prompt =
        DETAILED_VALIDATION_MESSAGES.PROMPT_MIN_LENGTH;
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    warnings,
    suggestions: suggestions.filter(Boolean),
  };
};

/**
 * Validate the entire detailed workout setup
 */
export const validateCompleteWorkoutSetup = (
  options: WorkoutOptions
): ValidationResult => {
  const allErrors: Partial<Record<keyof WorkoutOptions, string>> = {};
  const allWarnings: Partial<Record<keyof WorkoutOptions, string>> = {};
  const allSuggestions: string[] = [];

  // Validate each step
  const steps: Array<
    'workout-structure' | 'current-state' | 'equipment-preferences'
  > = ['workout-structure', 'current-state', 'equipment-preferences'];

  steps.forEach((step) => {
    const stepValidation = validateDetailedStep(step, options);
    Object.assign(allErrors, stepValidation.errors);
    Object.assign(allWarnings, stepValidation.warnings);
    allSuggestions.push(...stepValidation.suggestions);
  });

  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: allErrors,
    warnings: allWarnings,
    suggestions: allSuggestions.filter(Boolean),
  };
};

/**
 * Get field validation state for UI feedback
 */
export const getFieldValidationState = (
  fieldKey: keyof WorkoutOptions,
  value: unknown
): 'valid' | 'invalid' | 'warning' | 'empty' => {
  // Handle empty states
  if (
    value == null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return 'empty';
  }

  // Validate the field
  const validation = validateSingleField(fieldKey, value);

  if (!validation.isValid) {
    return 'invalid';
  }

  return 'valid';
};

/**
 * Check if a step is complete (all required fields filled and valid)
 * Since we removed required fields, all steps are considered complete for navigation
 */
export const isStepComplete = (
  step:
    | 'workout-structure'
    | 'current-state'
    | 'equipment-preferences'
    | 'additional-context',
  options: WorkoutOptions
): boolean => {
  // All steps are now considered complete for navigation purposes
  // Validation still runs for field-level feedback, but doesn't block navigation
  // Parameters are kept for API compatibility but not used for validation logic

  // Log step completion for debugging (using parameters to avoid ESLint warnings)
  if (process.env.NODE_ENV === 'development') {
    console.debug(
      `Step ${step} completion check:`,
      Object.keys(options).length > 0 ? 'has options' : 'no options'
    );
  }

  return true;
};

/**
 * Get step completion percentage
 */
export const getStepCompletionPercentage = (
  step:
    | 'workout-structure'
    | 'current-state'
    | 'equipment-preferences'
    | 'additional-context',
  options: WorkoutOptions
): number => {
  const config = STEP_VALIDATION_CONFIGS[step];
  if (!config) return 0;

  const allFields = [
    ...(config.requiredFields || []),
    ...(config.optionalFields || []),
  ];

  if (allFields.length === 0) return 100;

  const completedFields = allFields.filter((field) => {
    const value = options[field];
    return (
      value != null &&
      value !== '' &&
      (!Array.isArray(value) || value.length > 0)
    );
  });

  return Math.round((completedFields.length / allFields.length) * 100);
};

/**
 * Get overall workout setup completion percentage
 */
export const getOverallCompletionPercentage = (
  options: WorkoutOptions
): number => {
  const steps: Array<
    'workout-structure' | 'current-state' | 'equipment-preferences'
  > = ['workout-structure', 'current-state', 'equipment-preferences'];

  const stepPercentages = steps.map((step) =>
    getStepCompletionPercentage(step, options)
  );
  const averagePercentage =
    stepPercentages.reduce((sum, percentage) => sum + percentage, 0) /
    steps.length;

  return Math.round(averagePercentage);
};
