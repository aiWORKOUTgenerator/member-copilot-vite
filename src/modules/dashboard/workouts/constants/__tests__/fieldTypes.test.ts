/**
 * Tests for field type mapping system
 */

import { describe, it, expect } from 'vitest';
import {
  FIELD_TYPE_MAP,
  getFieldType,
  isRatingField,
  isMultiSelectField,
  isTextField,
  isDurationField,
  type FieldType,
} from '../fieldTypes';
import { CUSTOMIZATION_FIELD_KEYS } from '../fieldKeys';

describe('FIELD_TYPE_MAP', () => {
  it('should contain all expected field mappings', () => {
    expect(FIELD_TYPE_MAP[CUSTOMIZATION_FIELD_KEYS.ENERGY]).toBe('rating');
    expect(FIELD_TYPE_MAP[CUSTOMIZATION_FIELD_KEYS.SLEEP]).toBe('rating');
    expect(FIELD_TYPE_MAP[CUSTOMIZATION_FIELD_KEYS.STRESS]).toBe('rating');
    expect(FIELD_TYPE_MAP[CUSTOMIZATION_FIELD_KEYS.DURATION]).toBe('duration');
    expect(FIELD_TYPE_MAP[CUSTOMIZATION_FIELD_KEYS.FOCUS]).toBe(
      'single-select'
    );
    expect(FIELD_TYPE_MAP[CUSTOMIZATION_FIELD_KEYS.AREAS]).toBe('multi-select');
    expect(FIELD_TYPE_MAP[CUSTOMIZATION_FIELD_KEYS.SORENESS]).toBe(
      'multi-select'
    );
    expect(FIELD_TYPE_MAP[CUSTOMIZATION_FIELD_KEYS.EQUIPMENT]).toBe(
      'multi-select'
    );
    expect(FIELD_TYPE_MAP[CUSTOMIZATION_FIELD_KEYS.INCLUDE]).toBe('text');
    expect(FIELD_TYPE_MAP[CUSTOMIZATION_FIELD_KEYS.EXCLUDE]).toBe('text');
  });

  it('should have correct type annotations', () => {
    // TypeScript compilation test - if this compiles, types are correct
    const fieldType: FieldType =
      FIELD_TYPE_MAP[CUSTOMIZATION_FIELD_KEYS.ENERGY];
    expect(fieldType).toBe('rating');
  });
});

describe('getFieldType', () => {
  it('should return correct field types for known fields', () => {
    expect(getFieldType(CUSTOMIZATION_FIELD_KEYS.ENERGY)).toBe('rating');
    expect(getFieldType(CUSTOMIZATION_FIELD_KEYS.SLEEP)).toBe('rating');
    expect(getFieldType(CUSTOMIZATION_FIELD_KEYS.STRESS)).toBe('rating');
    expect(getFieldType(CUSTOMIZATION_FIELD_KEYS.DURATION)).toBe('duration');
    expect(getFieldType(CUSTOMIZATION_FIELD_KEYS.FOCUS)).toBe('single-select');
    expect(getFieldType(CUSTOMIZATION_FIELD_KEYS.AREAS)).toBe('multi-select');
    expect(getFieldType(CUSTOMIZATION_FIELD_KEYS.SORENESS)).toBe(
      'multi-select'
    );
    expect(getFieldType(CUSTOMIZATION_FIELD_KEYS.EQUIPMENT)).toBe(
      'multi-select'
    );
    expect(getFieldType(CUSTOMIZATION_FIELD_KEYS.INCLUDE)).toBe('text');
    expect(getFieldType(CUSTOMIZATION_FIELD_KEYS.EXCLUDE)).toBe('text');
  });

  it('should return undefined for unknown fields', () => {
    expect(getFieldType('unknown_field')).toBeUndefined();
    expect(getFieldType('')).toBeUndefined();
    expect(getFieldType('customization_unknown')).toBeUndefined();
  });
});

describe('isRatingField', () => {
  it('should correctly identify rating fields', () => {
    expect(isRatingField(CUSTOMIZATION_FIELD_KEYS.ENERGY)).toBe(true);
    expect(isRatingField(CUSTOMIZATION_FIELD_KEYS.SLEEP)).toBe(true);
    expect(isRatingField(CUSTOMIZATION_FIELD_KEYS.STRESS)).toBe(true);
  });

  it('should return false for non-rating fields', () => {
    expect(isRatingField(CUSTOMIZATION_FIELD_KEYS.DURATION)).toBe(false);
    expect(isRatingField(CUSTOMIZATION_FIELD_KEYS.FOCUS)).toBe(false);
    expect(isRatingField(CUSTOMIZATION_FIELD_KEYS.AREAS)).toBe(false);
    expect(isRatingField(CUSTOMIZATION_FIELD_KEYS.INCLUDE)).toBe(false);
    expect(isRatingField('unknown_field')).toBe(false);
  });
});

describe('isMultiSelectField', () => {
  it('should correctly identify multi-select fields', () => {
    expect(isMultiSelectField(CUSTOMIZATION_FIELD_KEYS.AREAS)).toBe(true);
    expect(isMultiSelectField(CUSTOMIZATION_FIELD_KEYS.SORENESS)).toBe(true);
    expect(isMultiSelectField(CUSTOMIZATION_FIELD_KEYS.EQUIPMENT)).toBe(true);
  });

  it('should return false for non-multi-select fields', () => {
    expect(isMultiSelectField(CUSTOMIZATION_FIELD_KEYS.ENERGY)).toBe(false);
    expect(isMultiSelectField(CUSTOMIZATION_FIELD_KEYS.DURATION)).toBe(false);
    expect(isMultiSelectField(CUSTOMIZATION_FIELD_KEYS.FOCUS)).toBe(false);
    expect(isMultiSelectField(CUSTOMIZATION_FIELD_KEYS.INCLUDE)).toBe(false);
    expect(isMultiSelectField('unknown_field')).toBe(false);
  });
});

describe('isTextField', () => {
  it('should correctly identify text fields', () => {
    expect(isTextField(CUSTOMIZATION_FIELD_KEYS.INCLUDE)).toBe(true);
    expect(isTextField(CUSTOMIZATION_FIELD_KEYS.EXCLUDE)).toBe(true);
  });

  it('should return false for non-text fields', () => {
    expect(isTextField(CUSTOMIZATION_FIELD_KEYS.ENERGY)).toBe(false);
    expect(isTextField(CUSTOMIZATION_FIELD_KEYS.DURATION)).toBe(false);
    expect(isTextField(CUSTOMIZATION_FIELD_KEYS.AREAS)).toBe(false);
    expect(isTextField(CUSTOMIZATION_FIELD_KEYS.FOCUS)).toBe(false);
    expect(isTextField('unknown_field')).toBe(false);
  });
});

describe('isDurationField', () => {
  it('should correctly identify duration fields', () => {
    expect(isDurationField(CUSTOMIZATION_FIELD_KEYS.DURATION)).toBe(true);
  });

  it('should return false for non-duration fields', () => {
    expect(isDurationField(CUSTOMIZATION_FIELD_KEYS.ENERGY)).toBe(false);
    expect(isDurationField(CUSTOMIZATION_FIELD_KEYS.FOCUS)).toBe(false);
    expect(isDurationField(CUSTOMIZATION_FIELD_KEYS.AREAS)).toBe(false);
    expect(isDurationField(CUSTOMIZATION_FIELD_KEYS.INCLUDE)).toBe(false);
    expect(isDurationField('unknown_field')).toBe(false);
  });
});

describe('Field type coverage', () => {
  it('should have field type mappings for all customization field keys', () => {
    // Ensure we don't miss any fields when adding new ones
    const allFieldKeys = Object.values(CUSTOMIZATION_FIELD_KEYS);
    const mappedFields = Object.keys(FIELD_TYPE_MAP);

    allFieldKeys.forEach((fieldKey) => {
      expect(mappedFields).toContain(fieldKey);
      expect(getFieldType(fieldKey)).toBeDefined();
    });
  });

  it('should only contain valid field types', () => {
    const validTypes: FieldType[] = [
      'rating',
      'multi-select',
      'single-select',
      'duration',
      'text',
    ];
    const allMappedTypes = Object.values(FIELD_TYPE_MAP);

    allMappedTypes.forEach((fieldType) => {
      expect(validTypes).toContain(fieldType);
    });
  });
});
