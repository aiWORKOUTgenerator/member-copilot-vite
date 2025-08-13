/**
 * Selection value formatters for workout customization fields
 *
 * Provides consistent formatting of selection values across all workout customization
 * components, ensuring unified display of user selections in badges and summaries.
 */

import { CUSTOMIZATION_FIELD_KEYS } from '../constants/fieldKeys';

/**
 * Format a selection value for display based on field type
 * @param fieldKey - The field key to format for
 * @param value - The raw value to format
 * @returns Formatted string for display, or null if no meaningful display value
 */
export const formatSelectionValue = (
  fieldKey: string,
  value: unknown
): string | null => {
  // Special handling for soreness field - null/undefined should return 'None'
  if (fieldKey === CUSTOMIZATION_FIELD_KEYS.SORENESS && value == null) {
    return 'None';
  }

  // Handle null/undefined values for other fields
  if (value == null) return null;

  const formatters: Record<string, (val: unknown) => string | null> = {
    [CUSTOMIZATION_FIELD_KEYS.DURATION]: (val) => {
      const duration = Number(val);
      if (isNaN(duration) || duration <= 0) return null;

      if (duration >= 60) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return minutes
          ? `${hours}h ${minutes}m`
          : `${hours} hour${hours > 1 ? 's' : ''}`;
      }
      return `${duration} min`;
    },

    [CUSTOMIZATION_FIELD_KEYS.ENERGY]: (val) => {
      const energy = Number(val);
      if (isNaN(energy) || energy < 1 || energy > 6) return null;

      const labels = [
        '',
        'Very Low',
        'Low',
        'Moderate',
        'Somewhat High',
        'High',
        'Very High',
      ];
      return `${labels[energy]} (${energy}/6)`;
    },

    [CUSTOMIZATION_FIELD_KEYS.SLEEP]: (val) => {
      const sleep = Number(val);
      if (isNaN(sleep) || sleep < 1 || sleep > 6) return null;

      const labels = [
        '',
        'Very Poor',
        'Poor',
        'Fair',
        'Good',
        'Very Good',
        'Excellent',
      ];
      return labels[sleep];
    },

    [CUSTOMIZATION_FIELD_KEYS.STRESS]: (val) => {
      const stress = Number(val);
      if (isNaN(stress) || stress < 1 || stress > 6) return null;

      const labels = [
        '',
        'Very Low',
        'Low',
        'Moderate',
        'High',
        'Very High',
        'Extreme',
      ];
      return labels[stress];
    },

    [CUSTOMIZATION_FIELD_KEYS.AREAS]: (val) => {
      const areas = Array.isArray(val) ? val : [];
      if (areas.length === 0) return null;

      if (areas.length === 1) {
        return formatAreaName(areas[0]);
      }
      return `${areas.length} areas selected`;
    },

    [CUSTOMIZATION_FIELD_KEYS.SORENESS]: (val) => {
      // Handle null/undefined as 'None' for soreness
      if (val == null) return 'None';

      const areas = Array.isArray(val) ? val : [];
      if (areas.length === 0) return 'None';

      if (areas.length === 1) {
        return formatAreaName(areas[0]);
      }
      return `${areas.length} areas`;
    },

    [CUSTOMIZATION_FIELD_KEYS.FOCUS]: (val) => {
      if (typeof val !== 'string') return null;
      return formatFocusName(val);
    },

    [CUSTOMIZATION_FIELD_KEYS.EQUIPMENT]: (val) => {
      const equipment = Array.isArray(val) ? val : [];
      if (equipment.length === 0) return null;

      if (equipment.length === 1) {
        return formatEquipmentName(equipment[0]);
      }
      return `${equipment.length} items`;
    },

    [CUSTOMIZATION_FIELD_KEYS.INCLUDE]: (val) => {
      if (typeof val !== 'string' || !val.trim()) return null;

      const exercises = val
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);
      if (exercises.length === 0) return null;
      if (exercises.length === 1) return exercises[0];
      return `${exercises.length} exercises`;
    },

    [CUSTOMIZATION_FIELD_KEYS.EXCLUDE]: (val) => {
      if (typeof val !== 'string' || !val.trim()) return null;

      const exercises = val
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);
      if (exercises.length === 0) return null;
      if (exercises.length === 1) return exercises[0];
      return `${exercises.length} exercises`;
    },
  };

  const formatter = formatters[fieldKey];
  if (!formatter) return null;

  try {
    return formatter(value);
  } catch (error) {
    console.warn(`Error formatting selection value for ${fieldKey}:`, error);
    return null;
  }
};

/**
 * Format area names for display (converts snake_case to Title Case)
 */
const formatAreaName = (areaValue: string): string => {
  if (typeof areaValue !== 'string') return '';

  return areaValue.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Format focus names for display (converts snake_case to Title Case)
 */
const formatFocusName = (focusValue: string): string => {
  if (typeof focusValue !== 'string') return '';

  // Special cases for better display
  const specialCases: Record<string, string> = {
    energizing_boost: 'Energizing Boost',
    improve_posture: 'Improve Posture',
    stress_reduction: 'Stress Reduction',
    quick_sweat: 'Quick Sweat',
    gentle_recovery: 'Gentle Recovery',
    core_abs: 'Core & Abs',
  };

  return specialCases[focusValue] || formatAreaName(focusValue);
};

/**
 * Format equipment names for display (converts snake_case to Title Case)
 */
const formatEquipmentName = (equipmentValue: string): string => {
  if (typeof equipmentValue !== 'string') return '';

  // Special cases for better display
  const specialCases: Record<string, string> = {
    bodyweight: 'Body Weight',
    available_equipment: 'Available Equipment',
    full_gym: 'Full Gym',
  };

  return specialCases[equipmentValue] || formatAreaName(equipmentValue);
};

/**
 * Get a summary of all selected values for display
 * @param options - The workout options object
 * @returns Array of formatted selection summaries
 */
export const getSelectionSummary = (
  options: Record<string, unknown>
): Array<{ field: string; value: string }> => {
  const summary: Array<{ field: string; value: string }> = [];

  Object.values(CUSTOMIZATION_FIELD_KEYS).forEach((fieldKey) => {
    // Only include fields that exist in the options object
    if (!(fieldKey in options)) return;

    const value = options[fieldKey];
    const formatted = formatSelectionValue(fieldKey, value);

    if (formatted) {
      summary.push({
        field: fieldKey,
        value: formatted,
      });
    }
  });

  return summary;
};
