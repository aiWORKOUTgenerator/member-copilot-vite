/**
 * Validation messages for detailed workout customization
 *
 * Provides consistent, user-friendly error messages for all validation scenarios
 * in the detailed workout setup flow. Messages are designed to be helpful and
 * guide users toward successful completion.
 */

import { CUSTOMIZATION_FIELD_KEYS } from './fieldKeys';

/**
 * Standard validation messages organized by validation type
 */
export const DETAILED_VALIDATION_MESSAGES = {
  // Required field messages
  FIELD_REQUIRED: 'This field is required',
  FOCUS_REQUIRED: 'Please select a workout focus',
  ENERGY_REQUIRED: 'Please rate your current energy level',
  DURATION_REQUIRED: 'Please select a workout duration',
  EQUIPMENT_REQUIRED: 'Please select available equipment',

  // Wellness validation messages
  SLEEP_REQUIRED: 'Please rate your sleep quality',
  STRESS_REQUIRED: 'Please indicate your current stress level',

  // Range validation messages
  ENERGY_RANGE: 'Energy level must be between 1 and 6',
  SLEEP_RANGE: 'Sleep quality must be between 1 and 6',
  STRESS_RANGE: 'Stress level must be between 1 and 6',
  DURATION_MIN: 'Workout duration must be at least 5 minutes',
  DURATION_MAX: 'Workout duration cannot exceed 120 minutes',

  // Selection count validation messages
  AREAS_MAX: 'Select up to 5 focus areas',
  AREAS_MIN: 'Select at least 1 focus area',
  SORENESS_MAX: 'Select up to 5 soreness areas',
  EQUIPMENT_MAX: 'Select up to 10 equipment items',
  EQUIPMENT_MIN: 'Select at least 1 equipment option',

  // Text field validation messages
  INCLUDE_MAX_LENGTH: 'Exercise list is too long (max 500 characters)',
  EXCLUDE_MAX_LENGTH: 'Exercise list is too long (max 500 characters)',
  INVALID_EXERCISE_FORMAT: 'Please separate exercises with commas',

  // Progressive validation messages
  COMPLETE_WELLNESS_GROUP:
    'Complete all wellness metrics (energy, sleep, stress) or leave all empty',
  WELLNESS_GROUP_PARTIAL:
    'If you rate one wellness metric, please rate all three for better recommendations',

  // Step-specific validation messages
  STRUCTURE_STEP_INCOMPLETE: 'Please complete the workout structure settings',
  CURRENT_STATE_INCOMPLETE: 'Please complete your current state information',
  EQUIPMENT_STEP_INCOMPLETE: 'Please complete your equipment preferences',

  // General validation messages
  INVALID_SELECTION: 'Invalid selection',
  INVALID_VALUE: 'Invalid value',
  NETWORK_ERROR: 'Unable to validate. Please check your connection.',
  UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

/**
 * Field-specific validation message mappings
 */
export const FIELD_VALIDATION_MESSAGES: Record<
  string,
  Record<string, string>
> = {
  [CUSTOMIZATION_FIELD_KEYS.FOCUS]: {
    required: DETAILED_VALIDATION_MESSAGES.FOCUS_REQUIRED,
    invalid: DETAILED_VALIDATION_MESSAGES.INVALID_SELECTION,
  },
  [CUSTOMIZATION_FIELD_KEYS.ENERGY]: {
    required: DETAILED_VALIDATION_MESSAGES.ENERGY_REQUIRED,
    range: DETAILED_VALIDATION_MESSAGES.ENERGY_RANGE,
    invalid: DETAILED_VALIDATION_MESSAGES.INVALID_VALUE,
  },
  [CUSTOMIZATION_FIELD_KEYS.DURATION]: {
    required: DETAILED_VALIDATION_MESSAGES.DURATION_REQUIRED,
    min: DETAILED_VALIDATION_MESSAGES.DURATION_MIN,
    max: DETAILED_VALIDATION_MESSAGES.DURATION_MAX,
    invalid: DETAILED_VALIDATION_MESSAGES.INVALID_VALUE,
  },
  [CUSTOMIZATION_FIELD_KEYS.EQUIPMENT]: {
    required: DETAILED_VALIDATION_MESSAGES.EQUIPMENT_REQUIRED,
    min: DETAILED_VALIDATION_MESSAGES.EQUIPMENT_MIN,
    max: DETAILED_VALIDATION_MESSAGES.EQUIPMENT_MAX,
    invalid: DETAILED_VALIDATION_MESSAGES.INVALID_SELECTION,
  },
  [CUSTOMIZATION_FIELD_KEYS.SLEEP]: {
    required: DETAILED_VALIDATION_MESSAGES.SLEEP_REQUIRED,
    range: DETAILED_VALIDATION_MESSAGES.SLEEP_RANGE,
    invalid: DETAILED_VALIDATION_MESSAGES.INVALID_VALUE,
  },
  [CUSTOMIZATION_FIELD_KEYS.STRESS]: {
    required: DETAILED_VALIDATION_MESSAGES.STRESS_REQUIRED,
    range: DETAILED_VALIDATION_MESSAGES.STRESS_RANGE,
    invalid: DETAILED_VALIDATION_MESSAGES.INVALID_VALUE,
  },
  [CUSTOMIZATION_FIELD_KEYS.AREAS]: {
    min: DETAILED_VALIDATION_MESSAGES.AREAS_MIN,
    max: DETAILED_VALIDATION_MESSAGES.AREAS_MAX,
    invalid: DETAILED_VALIDATION_MESSAGES.INVALID_SELECTION,
  },
  [CUSTOMIZATION_FIELD_KEYS.SORENESS]: {
    max: DETAILED_VALIDATION_MESSAGES.SORENESS_MAX,
    invalid: DETAILED_VALIDATION_MESSAGES.INVALID_SELECTION,
  },
  [CUSTOMIZATION_FIELD_KEYS.INCLUDE]: {
    maxLength: DETAILED_VALIDATION_MESSAGES.INCLUDE_MAX_LENGTH,
    format: DETAILED_VALIDATION_MESSAGES.INVALID_EXERCISE_FORMAT,
  },
  [CUSTOMIZATION_FIELD_KEYS.EXCLUDE]: {
    maxLength: DETAILED_VALIDATION_MESSAGES.EXCLUDE_MAX_LENGTH,
    format: DETAILED_VALIDATION_MESSAGES.INVALID_EXERCISE_FORMAT,
  },
};

/**
 * Step-specific validation message mappings
 */
export const STEP_VALIDATION_MESSAGES: Record<
  string,
  Record<string, string>
> = {
  'workout-structure': {
    incomplete: DETAILED_VALIDATION_MESSAGES.STRUCTURE_STEP_INCOMPLETE,
    title: 'Workout Structure',
    description: 'Complete your workout structure preferences',
  },
  'current-state': {
    incomplete: DETAILED_VALIDATION_MESSAGES.CURRENT_STATE_INCOMPLETE,
    title: 'Current State',
    description: 'Tell us about your current physical and mental state',
    wellnessGroup: DETAILED_VALIDATION_MESSAGES.WELLNESS_GROUP_PARTIAL,
  },
  'equipment-preferences': {
    incomplete: DETAILED_VALIDATION_MESSAGES.EQUIPMENT_STEP_INCOMPLETE,
    title: 'Equipment & Preferences',
    description: 'Configure your equipment and exercise preferences',
  },
};

/**
 * Get a validation message for a specific field and error type
 */
export const getValidationMessage = (
  fieldKey: string,
  errorType: string,
  customMessage?: string
): string => {
  // Return custom message if provided
  if (customMessage) {
    return customMessage;
  }

  // Get field-specific message
  const fieldMessages = FIELD_VALIDATION_MESSAGES[fieldKey];
  if (fieldMessages && fieldMessages[errorType]) {
    return fieldMessages[errorType];
  }

  // Fallback to general messages
  switch (errorType) {
    case 'required':
      return DETAILED_VALIDATION_MESSAGES.FIELD_REQUIRED;
    case 'invalid':
      return DETAILED_VALIDATION_MESSAGES.INVALID_VALUE;
    case 'network':
      return DETAILED_VALIDATION_MESSAGES.NETWORK_ERROR;
    default:
      return DETAILED_VALIDATION_MESSAGES.UNEXPECTED_ERROR;
  }
};

/**
 * Get a step validation message
 */
export const getStepValidationMessage = (
  stepKey: string,
  messageType: string
): string => {
  const stepMessages = STEP_VALIDATION_MESSAGES[stepKey];
  if (stepMessages && stepMessages[messageType]) {
    return stepMessages[messageType];
  }

  return DETAILED_VALIDATION_MESSAGES.UNEXPECTED_ERROR;
};

/**
 * Validation message helpers for common scenarios
 */
export const ValidationMessageHelpers = {
  /**
   * Get a range validation message for rating fields
   */
  getRangeMessage: (
    fieldKey: string,
    min: number = 1,
    max: number = 6
  ): string => {
    const fieldName = fieldKey.replace('customization_', '').replace('_', ' ');
    return `${fieldName} must be between ${min} and ${max}`;
  },

  /**
   * Get a selection count message for multi-select fields
   */
  getSelectionCountMessage: (
    fieldKey: string,
    count: number,
    max: number,
    min: number = 0
  ): string => {
    const fieldName = fieldKey.replace('customization_', '').replace('_', ' ');

    if (count > max) {
      return `Select up to ${max} ${fieldName} option${max > 1 ? 's' : ''}`;
    }

    if (count < min && min > 0) {
      return `Select at least ${min} ${fieldName} option${min > 1 ? 's' : ''}`;
    }

    return '';
  },

  /**
   * Get a progressive validation message for wellness fields
   */
  getWellnessGroupMessage: (
    completedFields: string[],
    totalFields: string[] = ['energy', 'sleep', 'stress']
  ): string => {
    if (completedFields.length === 0) {
      return '';
    }

    if (completedFields.length === totalFields.length) {
      return '';
    }

    const remaining = totalFields.filter(
      (field) => !completedFields.includes(field)
    );
    const remainingNames = remaining
      .map((field) => field.replace('customization_', '').replace('_', ' '))
      .join(', ');

    return `Please also rate your ${remainingNames} for better recommendations`;
  },

  /**
   * Format field name for user display
   */
  formatFieldName: (fieldKey: string): string => {
    return fieldKey
      .replace('customization_', '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  },
};

/**
 * Type definitions for validation messages
 */
export type ValidationMessageKey = keyof typeof DETAILED_VALIDATION_MESSAGES;
export type FieldValidationKey = keyof typeof FIELD_VALIDATION_MESSAGES;
export type StepValidationKey = keyof typeof STEP_VALIDATION_MESSAGES;
