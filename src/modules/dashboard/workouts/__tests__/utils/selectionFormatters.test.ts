/**
 * Unit tests for selection formatters utility
 */

import {
  formatSelectionValue,
  getSelectionSummary,
} from '../../utils/selectionFormatters';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';

describe('formatSelectionValue', () => {
  describe('DURATION field', () => {
    const fieldKey = CUSTOMIZATION_FIELD_KEYS.DURATION;

    it('should format minutes correctly', () => {
      expect(formatSelectionValue(fieldKey, 15)).toBe('15 min');
      expect(formatSelectionValue(fieldKey, 30)).toBe('30 min');
      expect(formatSelectionValue(fieldKey, 45)).toBe('45 min');
    });

    it('should format hours correctly', () => {
      expect(formatSelectionValue(fieldKey, 60)).toBe('1 hour');
      expect(formatSelectionValue(fieldKey, 120)).toBe('2 hours');
      expect(formatSelectionValue(fieldKey, 90)).toBe('1h 30m');
      expect(formatSelectionValue(fieldKey, 150)).toBe('2h 30m');
    });

    it('should handle invalid values', () => {
      expect(formatSelectionValue(fieldKey, null)).toBeNull();
      expect(formatSelectionValue(fieldKey, undefined)).toBeNull();
      expect(formatSelectionValue(fieldKey, 0)).toBeNull();
      expect(formatSelectionValue(fieldKey, -5)).toBeNull();
      expect(formatSelectionValue(fieldKey, 'invalid')).toBeNull();
    });
  });

  describe('ENERGY field', () => {
    const fieldKey = CUSTOMIZATION_FIELD_KEYS.ENERGY;

    it('should format energy levels correctly', () => {
      expect(formatSelectionValue(fieldKey, 1)).toBe('Very Low (1/6)');
      expect(formatSelectionValue(fieldKey, 2)).toBe('Low (2/6)');
      expect(formatSelectionValue(fieldKey, 3)).toBe('Moderate (3/6)');
      expect(formatSelectionValue(fieldKey, 4)).toBe('Somewhat High (4/6)');
      expect(formatSelectionValue(fieldKey, 5)).toBe('High (5/6)');
      expect(formatSelectionValue(fieldKey, 6)).toBe('Very High (6/6)');
    });

    it('should handle invalid values', () => {
      expect(formatSelectionValue(fieldKey, 0)).toBeNull();
      expect(formatSelectionValue(fieldKey, 7)).toBeNull();
      expect(formatSelectionValue(fieldKey, null)).toBeNull();
      expect(formatSelectionValue(fieldKey, 'invalid')).toBeNull();
    });
  });

  describe('SLEEP field', () => {
    const fieldKey = CUSTOMIZATION_FIELD_KEYS.SLEEP;

    it('should format sleep quality correctly', () => {
      expect(formatSelectionValue(fieldKey, 1)).toBe('Very Poor');
      expect(formatSelectionValue(fieldKey, 2)).toBe('Poor');
      expect(formatSelectionValue(fieldKey, 3)).toBe('Fair');
      expect(formatSelectionValue(fieldKey, 4)).toBe('Good');
      expect(formatSelectionValue(fieldKey, 5)).toBe('Excellent');
    });

    it('should handle invalid values', () => {
      expect(formatSelectionValue(fieldKey, 0)).toBeNull();
      expect(formatSelectionValue(fieldKey, 6)).toBeNull();
      expect(formatSelectionValue(fieldKey, null)).toBeNull();
    });
  });

  describe('STRESS field', () => {
    const fieldKey = CUSTOMIZATION_FIELD_KEYS.STRESS;

    it('should format stress levels correctly', () => {
      expect(formatSelectionValue(fieldKey, 1)).toBe('Very Low');
      expect(formatSelectionValue(fieldKey, 2)).toBe('Low');
      expect(formatSelectionValue(fieldKey, 3)).toBe('Moderate');
      expect(formatSelectionValue(fieldKey, 4)).toBe('High');
      expect(formatSelectionValue(fieldKey, 5)).toBe('Very High');
    });

    it('should handle invalid values', () => {
      expect(formatSelectionValue(fieldKey, 0)).toBeNull();
      expect(formatSelectionValue(fieldKey, 6)).toBeNull();
      expect(formatSelectionValue(fieldKey, null)).toBeNull();
    });
  });

  describe('AREAS field', () => {
    const fieldKey = CUSTOMIZATION_FIELD_KEYS.AREAS;

    it('should format single area correctly', () => {
      expect(formatSelectionValue(fieldKey, ['upper_body'])).toBe('Upper Body');
      expect(formatSelectionValue(fieldKey, ['core'])).toBe('Core');
      expect(formatSelectionValue(fieldKey, ['mobility_flexibility'])).toBe(
        'Mobility Flexibility'
      );
    });

    it('should format multiple areas correctly', () => {
      expect(formatSelectionValue(fieldKey, ['upper_body', 'core'])).toBe(
        '2 areas selected'
      );
      expect(
        formatSelectionValue(fieldKey, ['upper_body', 'core', 'back'])
      ).toBe('3 areas selected');
    });

    it('should handle empty arrays', () => {
      expect(formatSelectionValue(fieldKey, [])).toBeNull();
      expect(formatSelectionValue(fieldKey, null)).toBeNull();
      expect(formatSelectionValue(fieldKey, undefined)).toBeNull();
    });
  });

  describe('SORENESS field', () => {
    const fieldKey = CUSTOMIZATION_FIELD_KEYS.SORENESS;

    it('should format single soreness area correctly', () => {
      expect(formatSelectionValue(fieldKey, ['neck_shoulders'])).toBe(
        'Neck Shoulders'
      );
      expect(formatSelectionValue(fieldKey, ['lower_back'])).toBe('Lower Back');
    });

    it('should format multiple soreness areas correctly', () => {
      expect(
        formatSelectionValue(fieldKey, ['neck_shoulders', 'lower_back'])
      ).toBe('2 areas');
      expect(
        formatSelectionValue(fieldKey, [
          'neck_shoulders',
          'lower_back',
          'quads',
        ])
      ).toBe('3 areas');
    });

    it('should handle empty arrays as "None"', () => {
      expect(formatSelectionValue(fieldKey, [])).toBe('None');
      expect(formatSelectionValue(fieldKey, null)).toBe('None');
      expect(formatSelectionValue(fieldKey, undefined)).toBe('None');
    });
  });

  describe('FOCUS field', () => {
    const fieldKey = CUSTOMIZATION_FIELD_KEYS.FOCUS;

    it('should format focus values correctly', () => {
      expect(formatSelectionValue(fieldKey, 'energizing_boost')).toBe(
        'Energizing Boost'
      );
      expect(formatSelectionValue(fieldKey, 'improve_posture')).toBe(
        'Improve Posture'
      );
      expect(formatSelectionValue(fieldKey, 'stress_reduction')).toBe(
        'Stress Reduction'
      );
      expect(formatSelectionValue(fieldKey, 'quick_sweat')).toBe('Quick Sweat');
      expect(formatSelectionValue(fieldKey, 'gentle_recovery')).toBe(
        'Gentle Recovery'
      );
      expect(formatSelectionValue(fieldKey, 'core_abs')).toBe('Core & Abs');
    });

    it('should handle unknown focus values', () => {
      expect(formatSelectionValue(fieldKey, 'unknown_focus')).toBe(
        'Unknown Focus'
      );
    });

    it('should handle invalid values', () => {
      expect(formatSelectionValue(fieldKey, null)).toBeNull();
      expect(formatSelectionValue(fieldKey, undefined)).toBeNull();
      expect(formatSelectionValue(fieldKey, 123)).toBeNull();
    });
  });

  describe('EQUIPMENT field', () => {
    const fieldKey = CUSTOMIZATION_FIELD_KEYS.EQUIPMENT;

    it('should format single equipment correctly', () => {
      expect(formatSelectionValue(fieldKey, ['bodyweight'])).toBe(
        'Body Weight'
      );
      expect(formatSelectionValue(fieldKey, ['available_equipment'])).toBe(
        'Available Equipment'
      );
      expect(formatSelectionValue(fieldKey, ['full_gym'])).toBe('Full Gym');
    });

    it('should format multiple equipment correctly', () => {
      expect(formatSelectionValue(fieldKey, ['bodyweight', 'full_gym'])).toBe(
        '2 items'
      );
      expect(
        formatSelectionValue(fieldKey, [
          'bodyweight',
          'available_equipment',
          'full_gym',
        ])
      ).toBe('3 items');
    });

    it('should handle empty arrays', () => {
      expect(formatSelectionValue(fieldKey, [])).toBeNull();
      expect(formatSelectionValue(fieldKey, null)).toBeNull();
    });
  });

  describe('INCLUDE field', () => {
    const fieldKey = CUSTOMIZATION_FIELD_KEYS.INCLUDE;

    it('should format single exercise correctly', () => {
      expect(formatSelectionValue(fieldKey, 'push-ups')).toBe('push-ups');
      expect(formatSelectionValue(fieldKey, 'squats')).toBe('squats');
    });

    it('should format multiple exercises correctly', () => {
      expect(formatSelectionValue(fieldKey, 'push-ups, squats')).toBe(
        '2 exercises'
      );
      expect(formatSelectionValue(fieldKey, 'push-ups, squats, lunges')).toBe(
        '3 exercises'
      );
    });

    it('should handle empty or whitespace strings', () => {
      expect(formatSelectionValue(fieldKey, '')).toBeNull();
      expect(formatSelectionValue(fieldKey, '   ')).toBeNull();
      expect(formatSelectionValue(fieldKey, null)).toBeNull();
    });
  });

  describe('EXCLUDE field', () => {
    const fieldKey = CUSTOMIZATION_FIELD_KEYS.EXCLUDE;

    it('should format single exercise correctly', () => {
      expect(formatSelectionValue(fieldKey, 'burpees')).toBe('burpees');
    });

    it('should format multiple exercises correctly', () => {
      expect(formatSelectionValue(fieldKey, 'burpees, jumping jacks')).toBe(
        '2 exercises'
      );
    });

    it('should handle empty strings', () => {
      expect(formatSelectionValue(fieldKey, '')).toBeNull();
      expect(formatSelectionValue(fieldKey, null)).toBeNull();
    });
  });

  describe('Unknown fields', () => {
    it('should return null for unknown field keys', () => {
      expect(formatSelectionValue('unknown_field', 'value')).toBeNull();
      expect(formatSelectionValue('', 'value')).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should handle invalid input gracefully', () => {
      // Test that invalid objects return null without throwing errors
      expect(
        formatSelectionValue(CUSTOMIZATION_FIELD_KEYS.DURATION, {
          invalid: 'object',
        })
      ).toBeNull();
      expect(
        formatSelectionValue(CUSTOMIZATION_FIELD_KEYS.ENERGY, {
          invalid: 'object',
        })
      ).toBeNull();
      expect(
        formatSelectionValue(CUSTOMIZATION_FIELD_KEYS.AREAS, 'not-an-array')
      ).toBeNull();

      // Test that function doesn't crash on edge cases
      expect(formatSelectionValue('', null)).toBeNull();
      expect(
        formatSelectionValue(CUSTOMIZATION_FIELD_KEYS.FOCUS, null)
      ).toBeNull();
    });
  });
});

describe('getSelectionSummary', () => {
  it('should return summary of all selected values', () => {
    const options = {
      [CUSTOMIZATION_FIELD_KEYS.DURATION]: 30,
      [CUSTOMIZATION_FIELD_KEYS.ENERGY]: 4,
      [CUSTOMIZATION_FIELD_KEYS.FOCUS]: 'energizing_boost',
      [CUSTOMIZATION_FIELD_KEYS.AREAS]: ['upper_body', 'core'],
      [CUSTOMIZATION_FIELD_KEYS.SORENESS]: [],
      [CUSTOMIZATION_FIELD_KEYS.EQUIPMENT]: ['bodyweight'],
    };

    const summary = getSelectionSummary(options);

    expect(summary).toHaveLength(6); // 6 fields with meaningful values (including soreness as 'None')
    expect(summary).toContainEqual({
      field: CUSTOMIZATION_FIELD_KEYS.DURATION,
      value: '30 min',
    });
    expect(summary).toContainEqual({
      field: CUSTOMIZATION_FIELD_KEYS.ENERGY,
      value: 'Somewhat High (4/6)',
    });
    expect(summary).toContainEqual({
      field: CUSTOMIZATION_FIELD_KEYS.FOCUS,
      value: 'Energizing Boost',
    });
    expect(summary).toContainEqual({
      field: CUSTOMIZATION_FIELD_KEYS.AREAS,
      value: '2 areas selected',
    });
    expect(summary).toContainEqual({
      field: CUSTOMIZATION_FIELD_KEYS.SORENESS,
      value: 'None',
    });
    expect(summary).toContainEqual({
      field: CUSTOMIZATION_FIELD_KEYS.EQUIPMENT,
      value: 'Body Weight',
    });
  });

  it('should handle empty options object', () => {
    const summary = getSelectionSummary({});
    expect(summary).toHaveLength(0);
  });

  it('should skip fields with null/undefined values', () => {
    const options = {
      [CUSTOMIZATION_FIELD_KEYS.DURATION]: null,
      [CUSTOMIZATION_FIELD_KEYS.ENERGY]: undefined,
      [CUSTOMIZATION_FIELD_KEYS.FOCUS]: 'energizing_boost',
      [CUSTOMIZATION_FIELD_KEYS.SORENESS]: null, // Soreness with null should show as 'None'
    };

    const summary = getSelectionSummary(options);
    expect(summary).toHaveLength(2); // Focus and Soreness (as 'None')
    expect(summary).toContainEqual({
      field: CUSTOMIZATION_FIELD_KEYS.FOCUS,
      value: 'Energizing Boost',
    });
    expect(summary).toContainEqual({
      field: CUSTOMIZATION_FIELD_KEYS.SORENESS,
      value: 'None',
    });
  });
});
