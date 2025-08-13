/**
 * Tests for validation messages and helper functions
 */

import { describe, it, expect } from 'vitest';
import {
  DETAILED_VALIDATION_MESSAGES,
  FIELD_VALIDATION_MESSAGES,
  STEP_VALIDATION_MESSAGES,
  getValidationMessage,
  getStepValidationMessage,
  ValidationMessageHelpers,
} from '../validationMessages';
import { CUSTOMIZATION_FIELD_KEYS } from '../fieldKeys';

describe('DETAILED_VALIDATION_MESSAGES', () => {
  it('should contain all required validation messages', () => {
    expect(DETAILED_VALIDATION_MESSAGES.FIELD_REQUIRED).toBe(
      'This field is required'
    );
    expect(DETAILED_VALIDATION_MESSAGES.ENERGY_RANGE).toBe(
      'Energy level must be between 1 and 6'
    );
    expect(DETAILED_VALIDATION_MESSAGES.SLEEP_RANGE).toBe(
      'Sleep quality must be between 1 and 6'
    );
    expect(DETAILED_VALIDATION_MESSAGES.STRESS_RANGE).toBe(
      'Stress level must be between 1 and 6'
    );
    expect(DETAILED_VALIDATION_MESSAGES.AREAS_MAX).toBe(
      'Select up to 5 focus areas'
    );
    expect(DETAILED_VALIDATION_MESSAGES.SORENESS_MAX).toBe(
      'Select up to 5 soreness areas'
    );
  });

  it('should have consistent message formatting', () => {
    // Check that all messages are non-empty strings
    Object.values(DETAILED_VALIDATION_MESSAGES).forEach((message) => {
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });
  });
});

describe('FIELD_VALIDATION_MESSAGES', () => {
  it('should contain mappings for all customization fields', () => {
    const expectedFields = [
      CUSTOMIZATION_FIELD_KEYS.FOCUS,
      CUSTOMIZATION_FIELD_KEYS.ENERGY,
      CUSTOMIZATION_FIELD_KEYS.DURATION,
      CUSTOMIZATION_FIELD_KEYS.EQUIPMENT,
      CUSTOMIZATION_FIELD_KEYS.SLEEP,
      CUSTOMIZATION_FIELD_KEYS.STRESS,
      CUSTOMIZATION_FIELD_KEYS.AREAS,
      CUSTOMIZATION_FIELD_KEYS.SORENESS,
      CUSTOMIZATION_FIELD_KEYS.INCLUDE,
      CUSTOMIZATION_FIELD_KEYS.EXCLUDE,
    ];

    expectedFields.forEach((fieldKey) => {
      expect(FIELD_VALIDATION_MESSAGES[fieldKey]).toBeDefined();
      expect(typeof FIELD_VALIDATION_MESSAGES[fieldKey]).toBe('object');
    });
  });

  it('should have appropriate validation types for each field', () => {
    // Rating fields should have required, range, and invalid messages
    expect(
      FIELD_VALIDATION_MESSAGES[CUSTOMIZATION_FIELD_KEYS.ENERGY]
    ).toHaveProperty('required');
    expect(
      FIELD_VALIDATION_MESSAGES[CUSTOMIZATION_FIELD_KEYS.ENERGY]
    ).toHaveProperty('range');
    expect(
      FIELD_VALIDATION_MESSAGES[CUSTOMIZATION_FIELD_KEYS.ENERGY]
    ).toHaveProperty('invalid');

    // Multi-select fields should have min/max validation
    expect(
      FIELD_VALIDATION_MESSAGES[CUSTOMIZATION_FIELD_KEYS.AREAS]
    ).toHaveProperty('min');
    expect(
      FIELD_VALIDATION_MESSAGES[CUSTOMIZATION_FIELD_KEYS.AREAS]
    ).toHaveProperty('max');

    // Text fields should have maxLength validation
    expect(
      FIELD_VALIDATION_MESSAGES[CUSTOMIZATION_FIELD_KEYS.INCLUDE]
    ).toHaveProperty('maxLength');
    expect(
      FIELD_VALIDATION_MESSAGES[CUSTOMIZATION_FIELD_KEYS.EXCLUDE]
    ).toHaveProperty('maxLength');
  });
});

describe('STEP_VALIDATION_MESSAGES', () => {
  it('should contain all step configurations', () => {
    const expectedSteps = [
      'workout-structure',
      'current-state',
      'equipment-preferences',
    ];

    expectedSteps.forEach((step) => {
      expect(STEP_VALIDATION_MESSAGES[step]).toBeDefined();
      expect(STEP_VALIDATION_MESSAGES[step]).toHaveProperty('incomplete');
      expect(STEP_VALIDATION_MESSAGES[step]).toHaveProperty('title');
      expect(STEP_VALIDATION_MESSAGES[step]).toHaveProperty('description');
    });
  });

  it('should have wellness group message for current-state step', () => {
    expect(STEP_VALIDATION_MESSAGES['current-state']).toHaveProperty(
      'wellnessGroup'
    );
    expect(typeof STEP_VALIDATION_MESSAGES['current-state'].wellnessGroup).toBe(
      'string'
    );
  });
});

describe('getValidationMessage', () => {
  it('should return custom message when provided', () => {
    const customMessage = 'Custom error message';
    const result = getValidationMessage('any-field', 'any-type', customMessage);
    expect(result).toBe(customMessage);
  });

  it('should return field-specific message when available', () => {
    const result = getValidationMessage(
      CUSTOMIZATION_FIELD_KEYS.ENERGY,
      'required'
    );
    expect(result).toBe(DETAILED_VALIDATION_MESSAGES.ENERGY_REQUIRED);
  });

  it('should return general message for required fields', () => {
    const result = getValidationMessage('unknown-field', 'required');
    expect(result).toBe(DETAILED_VALIDATION_MESSAGES.FIELD_REQUIRED);
  });

  it('should return general message for invalid fields', () => {
    const result = getValidationMessage('unknown-field', 'invalid');
    expect(result).toBe(DETAILED_VALIDATION_MESSAGES.INVALID_VALUE);
  });

  it('should return network error message', () => {
    const result = getValidationMessage('any-field', 'network');
    expect(result).toBe(DETAILED_VALIDATION_MESSAGES.NETWORK_ERROR);
  });

  it('should return unexpected error message for unknown types', () => {
    const result = getValidationMessage('any-field', 'unknown-type');
    expect(result).toBe(DETAILED_VALIDATION_MESSAGES.UNEXPECTED_ERROR);
  });
});

describe('getStepValidationMessage', () => {
  it('should return step-specific message when available', () => {
    const result = getStepValidationMessage('workout-structure', 'incomplete');
    expect(result).toBe(DETAILED_VALIDATION_MESSAGES.STRUCTURE_STEP_INCOMPLETE);
  });

  it('should return step title', () => {
    const result = getStepValidationMessage('current-state', 'title');
    expect(result).toBe('Current State');
  });

  it('should return unexpected error for unknown step', () => {
    const result = getStepValidationMessage('unknown-step', 'incomplete');
    expect(result).toBe(DETAILED_VALIDATION_MESSAGES.UNEXPECTED_ERROR);
  });

  it('should return unexpected error for unknown message type', () => {
    const result = getStepValidationMessage(
      'workout-structure',
      'unknown-type'
    );
    expect(result).toBe(DETAILED_VALIDATION_MESSAGES.UNEXPECTED_ERROR);
  });
});

describe('ValidationMessageHelpers', () => {
  describe('getRangeMessage', () => {
    it('should generate range message with default values', () => {
      const result = ValidationMessageHelpers.getRangeMessage(
        'customization_energy'
      );
      expect(result).toBe('energy must be between 1 and 6');
    });

    it('should generate range message with custom values', () => {
      const result = ValidationMessageHelpers.getRangeMessage(
        'customization_duration',
        5,
        120
      );
      expect(result).toBe('duration must be between 5 and 120');
    });

    it('should format field names correctly', () => {
      const result = ValidationMessageHelpers.getRangeMessage(
        'customization_sleep_quality'
      );
      expect(result).toBe('sleep quality must be between 1 and 6');
    });
  });

  describe('getSelectionCountMessage', () => {
    it('should return empty string for valid selection count', () => {
      const result = ValidationMessageHelpers.getSelectionCountMessage(
        'customization_areas',
        3,
        5
      );
      expect(result).toBe('');
    });

    it('should return max selection message when count exceeds maximum', () => {
      const result = ValidationMessageHelpers.getSelectionCountMessage(
        'customization_areas',
        6,
        5
      );
      expect(result).toBe('Select up to 5 areas options');
    });

    it('should return min selection message when count below minimum', () => {
      const result = ValidationMessageHelpers.getSelectionCountMessage(
        'customization_equipment',
        0,
        10,
        1
      );
      expect(result).toBe('Select at least 1 equipment option');
    });

    it('should handle singular vs plural correctly', () => {
      const result1 = ValidationMessageHelpers.getSelectionCountMessage(
        'customization_focus',
        2,
        1
      );
      expect(result1).toBe('Select up to 1 focus option');

      const result2 = ValidationMessageHelpers.getSelectionCountMessage(
        'customization_areas',
        6,
        5
      );
      expect(result2).toBe('Select up to 5 areas options');
    });
  });

  describe('getWellnessGroupMessage', () => {
    it('should return empty string when no fields completed', () => {
      const result = ValidationMessageHelpers.getWellnessGroupMessage([]);
      expect(result).toBe('');
    });

    it('should return empty string when all fields completed', () => {
      const result = ValidationMessageHelpers.getWellnessGroupMessage([
        'energy',
        'sleep',
        'stress',
      ]);
      expect(result).toBe('');
    });

    it('should return message for partially completed wellness group', () => {
      const result = ValidationMessageHelpers.getWellnessGroupMessage([
        'energy',
      ]);
      expect(result).toBe(
        'Please also rate your sleep, stress for better recommendations'
      );
    });

    it('should handle multiple missing fields', () => {
      const result = ValidationMessageHelpers.getWellnessGroupMessage([
        'energy',
        'sleep',
      ]);
      expect(result).toBe(
        'Please also rate your stress for better recommendations'
      );
    });

    it('should work with custom field lists', () => {
      const result = ValidationMessageHelpers.getWellnessGroupMessage(
        ['customization_energy'],
        ['customization_energy', 'customization_sleep', 'customization_stress']
      );
      expect(result).toBe(
        'Please also rate your sleep, stress for better recommendations'
      );
    });
  });

  describe('formatFieldName', () => {
    it('should format field names correctly', () => {
      expect(
        ValidationMessageHelpers.formatFieldName('customization_energy')
      ).toBe('Energy');
      expect(
        ValidationMessageHelpers.formatFieldName('customization_sleep_quality')
      ).toBe('Sleep Quality');
      expect(
        ValidationMessageHelpers.formatFieldName('customization_focus_areas')
      ).toBe('Focus Areas');
    });

    it('should handle fields without customization prefix', () => {
      expect(ValidationMessageHelpers.formatFieldName('energy_level')).toBe(
        'Energy Level'
      );
      expect(ValidationMessageHelpers.formatFieldName('duration')).toBe(
        'Duration'
      );
    });

    it('should handle single word fields', () => {
      expect(ValidationMessageHelpers.formatFieldName('focus')).toBe('Focus');
      expect(
        ValidationMessageHelpers.formatFieldName('customization_stress')
      ).toBe('Stress');
    });
  });
});
