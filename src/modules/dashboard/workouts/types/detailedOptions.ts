/**
 * TypeScript discriminated unions for detailed workout options
 *
 * Provides type-safe field definitions with discriminated unions to ensure
 * proper type checking and validation throughout the workout customization system.
 */

/**
 * Discriminated union for all detailed workout field types
 * Each field type has specific value constraints and validation rules
 */
export type DetailedWorkoutField =
  | {
      type: 'rating';
      key: 'sleep' | 'stress' | 'energy';
      value: 1 | 2 | 3 | 4 | 5 | 6;
    }
  | {
      type: 'multi-select';
      key: 'areas' | 'soreness' | 'equipment';
      value: string[];
    }
  | { type: 'single-select'; key: 'focus'; value: string }
  | { type: 'duration'; key: 'duration'; value: number }
  | { type: 'text'; key: 'include' | 'exclude'; value: string };

/**
 * Type guard functions for runtime type checking
 */

export const isRatingField = (
  field: DetailedWorkoutField
): field is Extract<DetailedWorkoutField, { type: 'rating' }> =>
  field.type === 'rating';

export const isMultiSelectField = (
  field: DetailedWorkoutField
): field is Extract<DetailedWorkoutField, { type: 'multi-select' }> =>
  field.type === 'multi-select';

export const isSingleSelectField = (
  field: DetailedWorkoutField
): field is Extract<DetailedWorkoutField, { type: 'single-select' }> =>
  field.type === 'single-select';

export const isDurationField = (
  field: DetailedWorkoutField
): field is Extract<DetailedWorkoutField, { type: 'duration' }> =>
  field.type === 'duration';

export const isTextField = (
  field: DetailedWorkoutField
): field is Extract<DetailedWorkoutField, { type: 'text' }> =>
  field.type === 'text';

/**
 * Field validation constraints based on field type
 */
export interface FieldConstraints {
  rating: {
    min?: number; // Optional but defaults to 1 in validation
    max?: number; // Optional but defaults to 6 in validation
    required?: boolean;
  };
  'multi-select': {
    minSelections?: number;
    maxSelections?: number;
    required?: boolean;
  };
  'single-select': {
    required?: boolean;
    allowedValues?: string[];
  };
  duration: {
    min?: number;
    max?: number;
    required?: boolean;
  };
  text: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    pattern?: RegExp;
  };
}

/**
 * Default constraints for each field type
 */
export const DEFAULT_FIELD_CONSTRAINTS: FieldConstraints = {
  rating: {
    min: 1,
    max: 6,
    required: false,
  },
  'multi-select': {
    minSelections: 0,
    maxSelections: 5,
    required: false,
  },
  'single-select': {
    required: false,
  },
  duration: {
    min: 5,
    max: 120,
    required: false,
  },
  text: {
    minLength: 0,
    maxLength: 500,
    required: false,
  },
};

/**
 * Field-specific constraints override defaults for specific fields
 */
export const FIELD_SPECIFIC_CONSTRAINTS: Partial<
  Record<string, Partial<FieldConstraints[keyof FieldConstraints]>>
> = {
  customization_sleep: {
    min: 1,
    max: 6, // Sleep uses 1-6 scale (uniform with energy)
  },
  customization_stress: {
    min: 1,
    max: 6, // Stress uses 1-6 scale (uniform with energy)
  },
  customization_energy: {
    min: 1,
    max: 6, // Energy uses 1-6 scale
  },
  customization_areas: {
    maxSelections: 5,
  },
  customization_soreness: {
    maxSelections: 5,
  },
  customization_equipment: {
    maxSelections: 10, // More equipment options allowed
  },
};

/**
 * Get constraints for a specific field
 */
export const getFieldConstraints = (
  fieldKey: string,
  fieldType: keyof FieldConstraints
): FieldConstraints[keyof FieldConstraints] => {
  const defaultConstraints = DEFAULT_FIELD_CONSTRAINTS[fieldType];
  const specificConstraints = FIELD_SPECIFIC_CONSTRAINTS[fieldKey];

  return {
    ...defaultConstraints,
    ...specificConstraints,
  };
};

/**
 * Validate a field value against its constraints
 */
export const validateFieldValue = (
  fieldKey: string,
  fieldType: keyof FieldConstraints,
  value: unknown
): { isValid: boolean; error?: string } => {
  const constraints = getFieldConstraints(fieldKey, fieldType);

  // Handle required field validation
  if (constraints.required && (value == null || value === '')) {
    return { isValid: false, error: 'This field is required' };
  }

  // Skip validation for optional empty values
  if (!constraints.required && (value == null || value === '')) {
    return { isValid: true };
  }

  switch (fieldType) {
    case 'rating': {
      const numValue = Number(value);
      const ratingConstraints = constraints as FieldConstraints['rating'];

      if (isNaN(numValue)) {
        return { isValid: false, error: 'Must be a valid number' };
      }

      // Defensive programming: ensure min/max are defined for ratings
      const minValue = ratingConstraints.min ?? 1;
      const maxValue = ratingConstraints.max ?? 6;

      if (numValue < minValue || numValue > maxValue) {
        return {
          isValid: false,
          error: `Must be between ${minValue} and ${maxValue}`,
        };
      }
      break;
    }

    case 'multi-select': {
      const arrayValue = Array.isArray(value) ? value : [];
      const multiConstraints = constraints as FieldConstraints['multi-select'];

      if (
        multiConstraints.minSelections &&
        arrayValue.length < multiConstraints.minSelections
      ) {
        return {
          isValid: false,
          error: `Select at least ${multiConstraints.minSelections} option${multiConstraints.minSelections > 1 ? 's' : ''}`,
        };
      }

      if (
        multiConstraints.maxSelections &&
        arrayValue.length > multiConstraints.maxSelections
      ) {
        return {
          isValid: false,
          error: `Select up to ${multiConstraints.maxSelections} option${multiConstraints.maxSelections > 1 ? 's' : ''}`,
        };
      }
      break;
    }

    case 'duration': {
      const numValue = Number(value);
      const durationConstraints = constraints as FieldConstraints['duration'];

      if (isNaN(numValue)) {
        return { isValid: false, error: 'Must be a valid number' };
      }

      if (durationConstraints.min && numValue < durationConstraints.min) {
        return {
          isValid: false,
          error: `Must be at least ${durationConstraints.min} minutes`,
        };
      }

      if (durationConstraints.max && numValue > durationConstraints.max) {
        return {
          isValid: false,
          error: `Must be no more than ${durationConstraints.max} minutes`,
        };
      }
      break;
    }

    case 'text': {
      const strValue = String(value);
      const textConstraints = constraints as FieldConstraints['text'];

      if (
        textConstraints.minLength &&
        strValue.length < textConstraints.minLength
      ) {
        return {
          isValid: false,
          error: `Must be at least ${textConstraints.minLength} character${textConstraints.minLength > 1 ? 's' : ''}`,
        };
      }

      if (
        textConstraints.maxLength &&
        strValue.length > textConstraints.maxLength
      ) {
        return {
          isValid: false,
          error: `Must be no more than ${textConstraints.maxLength} character${textConstraints.maxLength > 1 ? 's' : ''}`,
        };
      }

      if (textConstraints.pattern && !textConstraints.pattern.test(strValue)) {
        return { isValid: false, error: 'Invalid format' };
      }
      break;
    }

    case 'single-select': {
      const strValue = String(value);
      const selectConstraints =
        constraints as FieldConstraints['single-select'];

      if (
        selectConstraints.allowedValues &&
        !selectConstraints.allowedValues.includes(strValue)
      ) {
        return { isValid: false, error: 'Invalid selection' };
      }
      break;
    }
  }

  return { isValid: true };
};
