/**
 * Tests for detailed validation system
 */

import { describe, it, expect } from 'vitest';
import {
  validateSingleField,
  validateDetailedStep,
  validateCompleteWorkoutSetup,
  getFieldValidationState,
  isStepComplete,
  getStepCompletionPercentage,
  getOverallCompletionPercentage,
  type WorkoutOptions,
} from '../detailedValidation';
// Removed unused import

describe('validateSingleField', () => {
  describe('rating fields', () => {
    it('should validate energy field correctly', () => {
      expect(validateSingleField('customization_energy', 3)).toEqual({
        isValid: true,
      });
      expect(validateSingleField('customization_energy', 6)).toEqual({
        isValid: true,
      });
      expect(validateSingleField('customization_energy', 1)).toEqual({
        isValid: true,
      });

      const invalidResult = validateSingleField('customization_energy', 7);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toContain('between 1 and 6');
    });

    it('should validate sleep field correctly', () => {
      expect(validateSingleField('customization_sleep', 4)).toEqual({
        isValid: true,
      });

      const invalidResult = validateSingleField('customization_sleep', 0);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toContain('between 1 and 6');
    });

    it('should validate stress field correctly', () => {
      expect(validateSingleField('customization_stress', 2)).toEqual({
        isValid: true,
      });

      const invalidResult = validateSingleField('customization_stress', 8);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toContain('between 1 and 6');
    });

    it('should handle non-numeric rating values', () => {
      const result = validateSingleField('customization_energy', 'invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid number');
    });
  });

  describe('duration fields', () => {
    it('should validate duration field correctly', () => {
      expect(validateSingleField('customization_duration', 30)).toEqual({
        isValid: true,
      });
      expect(validateSingleField('customization_duration', 5)).toEqual({
        isValid: true,
      });
      expect(validateSingleField('customization_duration', 120)).toEqual({
        isValid: true,
      });
    });

    it('should reject invalid duration values', () => {
      const result1 = validateSingleField('customization_duration', 3);
      expect(result1.isValid).toBe(false);
      expect(result1.error).toContain('at least 5 minutes');

      const result2 = validateSingleField('customization_duration', 150);
      expect(result2.isValid).toBe(false);
      expect(result2.error).toContain('no more than 120 minutes');
    });
  });

  describe('multi-select fields', () => {
    it('should validate areas field correctly', () => {
      expect(
        validateSingleField('customization_areas', ['upper_body'])
      ).toEqual({ isValid: true });
      expect(
        validateSingleField('customization_areas', [
          'upper_body',
          'core',
          'lower_body',
        ])
      ).toEqual({ isValid: true });

      const result = validateSingleField('customization_areas', [
        'upper_body',
        'core',
        'lower_body',
        'back',
        'shoulders',
        'chest',
      ]);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('up to 5 option');
    });

    it('should validate soreness field correctly', () => {
      expect(validateSingleField('customization_soreness', [])).toEqual({
        isValid: true,
      });
      expect(
        validateSingleField('customization_soreness', [
          'lower_back',
          'shoulders',
        ])
      ).toEqual({ isValid: true });
    });

    it('should validate equipment field correctly', () => {
      expect(
        validateSingleField('customization_equipment', [
          'dumbbells',
          'resistance_bands',
        ])
      ).toEqual({ isValid: true });

      const tooManyItems = Array.from({ length: 11 }, (_, i) => `item_${i}`);
      const result = validateSingleField(
        'customization_equipment',
        tooManyItems
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('up to 10 option');
    });
  });

  describe('single-select fields', () => {
    it('should validate focus field correctly', () => {
      expect(validateSingleField('customization_focus', 'strength')).toEqual({
        isValid: true,
      });
      expect(validateSingleField('customization_focus', 'cardio')).toEqual({
        isValid: true,
      });
    });
  });

  describe('text fields', () => {
    it('should validate include field correctly', () => {
      expect(
        validateSingleField('customization_include', 'push-ups, squats')
      ).toEqual({ isValid: true });

      const longText = 'a'.repeat(501);
      const result = validateSingleField('customization_include', longText);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('no more than 500 character');
    });

    it('should validate exclude field correctly', () => {
      expect(validateSingleField('customization_exclude', 'burpees')).toEqual({
        isValid: true,
      });
    });
  });

  describe('unknown fields', () => {
    it('should pass validation for unknown fields', () => {
      expect(
        validateSingleField(
          'unknown_field' as keyof WorkoutOptions,
          'any_value'
        )
      ).toEqual({ isValid: true });
    });
  });
});

describe('validateDetailedStep', () => {
  describe('workout-structure step', () => {
    it('should validate complete structure step', () => {
      const options: WorkoutOptions = {
        customization_focus: 'strength',
        customization_duration: 30,
        customization_areas: ['upper_body', 'core'],
      };

      const result = validateDetailedStep('workout-structure', options);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should require focus and duration', () => {
      const options: WorkoutOptions = {};

      const result = validateDetailedStep('workout-structure', options);
      expect(result.isValid).toBe(false);
      expect(result.errors.customization_focus).toBeDefined();
      expect(result.errors.customization_duration).toBeDefined();
    });

    it('should validate areas count', () => {
      const options: WorkoutOptions = {
        customization_focus: 'strength',
        customization_duration: 30,
        customization_areas: [
          'upper_body',
          'core',
          'lower_body',
          'back',
          'shoulders',
          'chest',
        ],
      };

      const result = validateDetailedStep('workout-structure', options);
      expect(result.isValid).toBe(false);
      expect(result.errors.customization_areas).toContain('up to 5');
    });

    it('should allow empty optional fields', () => {
      const options: WorkoutOptions = {
        customization_focus: 'strength',
        customization_duration: 30,
        customization_areas: [],
      };

      const result = validateDetailedStep('workout-structure', options);
      expect(result.isValid).toBe(true);
    });
  });

  describe('current-state step', () => {
    it('should validate complete current state with all wellness fields', () => {
      const options: WorkoutOptions = {
        customization_energy: 4,
        customization_sleep: 5,
        customization_stress: 2,
        customization_soreness: ['lower_back'],
      };

      const result = validateDetailedStep('current-state', options);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should allow empty current state', () => {
      const options: WorkoutOptions = {};

      const result = validateDetailedStep('current-state', options);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should provide progressive wellness validation', () => {
      const options: WorkoutOptions = {
        customization_energy: 4,
        // Missing sleep and stress
      };

      const result = validateDetailedStep('current-state', options);
      expect(result.isValid).toBe(true); // No hard errors for progressive validation
      expect(result.suggestions.length).toBeGreaterThan(0); // Should have suggestions
    });

    it('should validate soreness count', () => {
      const options: WorkoutOptions = {
        customization_energy: 4,
        customization_sleep: 5,
        customization_stress: 2,
        customization_soreness: [
          'lower_back',
          'neck_shoulders',
          'upper_back',
          'glutes',
          'quads',
          'hamstrings',
          'calves',
          'chest',
          'arms_biceps_triceps',
          'forearms',
          'core',
          'adductors',
          'test_area_13', // This will trigger the validation error
        ],
      };

      const result = validateDetailedStep('current-state', options);
      expect(result.isValid).toBe(false);
      expect(result.errors.customization_soreness).toContain('up to 12');
    });

    it('should validate individual wellness field values', () => {
      const options: WorkoutOptions = {
        customization_energy: 7, // Invalid
        customization_sleep: 5,
        customization_stress: 2,
      };

      const result = validateDetailedStep('current-state', options);
      expect(result.isValid).toBe(false);
      expect(result.errors.customization_energy).toBeDefined();
    });
  });

  describe('equipment-preferences step', () => {
    it('should validate complete equipment preferences', () => {
      const options: WorkoutOptions = {
        customization_equipment: ['dumbbells', 'resistance_bands'],
        customization_include: 'push-ups, squats',
        customization_exclude: 'burpees',
      };

      const result = validateDetailedStep('equipment-preferences', options);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should require equipment selection', () => {
      const options: WorkoutOptions = {};

      const result = validateDetailedStep('equipment-preferences', options);
      expect(result.isValid).toBe(false);
      expect(result.errors.customization_equipment).toBeDefined();
    });

    it('should validate equipment count', () => {
      const options: WorkoutOptions = {
        customization_equipment: Array.from(
          { length: 11 },
          (_, i) => `item_${i}`
        ),
      };

      const result = validateDetailedStep('equipment-preferences', options);
      expect(result.isValid).toBe(false);
      expect(result.errors.customization_equipment).toContain('up to 10');
    });

    it('should validate text field lengths', () => {
      const longText = 'a'.repeat(501);
      const options: WorkoutOptions = {
        customization_equipment: ['dumbbells'],
        customization_include: longText,
        customization_exclude: longText,
      };

      const result = validateDetailedStep('equipment-preferences', options);
      expect(result.isValid).toBe(false);
      expect(result.errors.customization_include).toContain('too long');
      expect(result.errors.customization_exclude).toContain('too long');
    });

    it('should allow empty optional text fields', () => {
      const options: WorkoutOptions = {
        customization_equipment: ['dumbbells'],
        customization_include: '',
        customization_exclude: '',
      };

      const result = validateDetailedStep('equipment-preferences', options);
      expect(result.isValid).toBe(true);
    });
  });
});

describe('validateCompleteWorkoutSetup', () => {
  it('should validate complete workout setup', () => {
    const options: WorkoutOptions = {
      customization_focus: 'strength',
      customization_duration: 30,
      customization_areas: ['upper_body'],
      customization_energy: 4,
      customization_sleep: 5,
      customization_stress: 2,
      customization_soreness: [],
      customization_equipment: ['dumbbells'],
      customization_include: '',
      customization_exclude: '',
    };

    const result = validateCompleteWorkoutSetup(options);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should collect errors from all steps', () => {
    const options: WorkoutOptions = {
      // Missing required fields from multiple steps
    };

    const result = validateCompleteWorkoutSetup(options);
    expect(result.isValid).toBe(false);
    expect(result.errors.customization_focus).toBeDefined(); // workout-structure
    expect(result.errors.customization_duration).toBeDefined(); // workout-structure
    expect(result.errors.customization_equipment).toBeDefined(); // equipment-preferences
  });

  it('should collect suggestions from all steps', () => {
    const options: WorkoutOptions = {
      customization_focus: 'strength',
      customization_duration: 30,
      customization_equipment: ['dumbbells'],
      customization_energy: 4, // Partial wellness
    };

    const result = validateCompleteWorkoutSetup(options);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });
});

describe('getFieldValidationState', () => {
  it('should return empty for null/undefined values', () => {
    expect(getFieldValidationState('customization_energy', null)).toBe('empty');
    expect(getFieldValidationState('customization_energy', undefined)).toBe(
      'empty'
    );
    expect(getFieldValidationState('customization_areas', [])).toBe('empty');
    expect(getFieldValidationState('customization_include', '')).toBe('empty');
  });

  it('should return valid for valid values', () => {
    expect(getFieldValidationState('customization_energy', 4)).toBe('valid');
    expect(getFieldValidationState('customization_areas', ['upper_body'])).toBe(
      'valid'
    );
    expect(getFieldValidationState('customization_include', 'push-ups')).toBe(
      'valid'
    );
  });

  it('should return invalid for invalid values', () => {
    expect(getFieldValidationState('customization_energy', 7)).toBe('invalid');
    expect(
      getFieldValidationState(
        'customization_areas',
        Array.from({ length: 6 }, (_, i) => `area_${i}`)
      )
    ).toBe('invalid');
  });
});

describe('isStepComplete', () => {
  it('should return true for complete workout-structure step', () => {
    const options: WorkoutOptions = {
      customization_focus: 'strength',
      customization_duration: 30,
    };

    expect(isStepComplete('workout-structure', options)).toBe(true);
  });

  it('should return false for incomplete workout-structure step', () => {
    const options: WorkoutOptions = {
      customization_focus: 'strength',
      // Missing duration
    };

    expect(isStepComplete('workout-structure', options)).toBe(false);
  });

  it('should return true for empty current-state step', () => {
    const options: WorkoutOptions = {};
    expect(isStepComplete('current-state', options)).toBe(true);
  });

  it('should return false for incomplete equipment-preferences step', () => {
    const options: WorkoutOptions = {};
    expect(isStepComplete('equipment-preferences', options)).toBe(false);
  });
});

describe('getStepCompletionPercentage', () => {
  it('should calculate workout-structure completion correctly', () => {
    const options1: WorkoutOptions = {
      customization_focus: 'strength',
      customization_duration: 30,
      customization_areas: ['upper_body'],
    };
    expect(getStepCompletionPercentage('workout-structure', options1)).toBe(
      100
    );

    const options2: WorkoutOptions = {
      customization_focus: 'strength',
      // Missing duration and areas
    };
    expect(getStepCompletionPercentage('workout-structure', options2)).toBe(33); // 1 of 3 fields
  });

  it('should calculate current-state completion correctly', () => {
    const options1: WorkoutOptions = {
      customization_energy: 4,
      customization_sleep: 5,
      customization_stress: 2,
      customization_soreness: ['lower_back'],
    };
    expect(getStepCompletionPercentage('current-state', options1)).toBe(100);

    const options2: WorkoutOptions = {
      customization_energy: 4,
      // Missing other fields
    };
    expect(getStepCompletionPercentage('current-state', options2)).toBe(25); // 1 of 4 fields
  });

  it('should calculate equipment-preferences completion correctly', () => {
    const options1: WorkoutOptions = {
      customization_equipment: ['dumbbells'],
      customization_include: 'push-ups',
      customization_exclude: 'burpees',
    };
    expect(getStepCompletionPercentage('equipment-preferences', options1)).toBe(
      100
    );

    const options2: WorkoutOptions = {
      customization_equipment: ['dumbbells'],
      // Missing optional fields
    };
    expect(getStepCompletionPercentage('equipment-preferences', options2)).toBe(
      33
    ); // 1 of 3 fields
  });

  it('should return 0 for empty options', () => {
    expect(getStepCompletionPercentage('workout-structure', {})).toBe(0);
  });
});

describe('getOverallCompletionPercentage', () => {
  it('should calculate overall completion correctly', () => {
    const options: WorkoutOptions = {
      customization_focus: 'strength',
      customization_duration: 30,
      customization_areas: ['upper_body'],
      customization_energy: 4,
      customization_sleep: 5,
      customization_stress: 2,
      customization_soreness: ['lower_back'],
      customization_equipment: ['dumbbells'],
      customization_include: 'push-ups',
      customization_exclude: 'burpees',
    };

    expect(getOverallCompletionPercentage(options)).toBe(100);
  });

  it('should calculate partial completion correctly', () => {
    const options: WorkoutOptions = {
      customization_focus: 'strength',
      customization_duration: 30,
      // Missing some fields from each step
    };

    const percentage = getOverallCompletionPercentage(options);
    expect(percentage).toBeGreaterThan(0);
    expect(percentage).toBeLessThan(100);
  });

  it('should return 0 for empty options', () => {
    expect(getOverallCompletionPercentage({})).toBe(0);
  });
});
