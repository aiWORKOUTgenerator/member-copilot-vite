import { useCallback } from 'react';
import { Target, Battery, Clock, Dumbbell } from 'lucide-react';
import type { PerWorkoutOptions } from '../components/types';
import { SelectionCounter } from '../selectionCountingLogic';
import { CUSTOMIZATION_FIELD_KEYS } from '../constants/fieldKeys';

/**
 * Helper function to format focus or equipment values by replacing underscores
 * with spaces and capitalizing each word.
 */
const formatFocusOrEquipmentValue = (value: string): string => {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

export interface SelectionSummaryItem {
  key: string;
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface UseSelectionSummaryReturn {
  selections: SelectionSummaryItem[];
  hasSelections: boolean;
}

/**
 * Reusable hook for tracking and formatting form selections across steps.
 * Uses existing validation logic from SelectionCounter to ensure data integrity.
 *
 * @param options - The current form options/data
 * @param formatters - Custom formatters for each field type
 * @returns Object with selections array and hasSelections boolean
 */
export const useSelectionSummary = (
  options: PerWorkoutOptions,
  formatters?: Record<string, (value: unknown) => string | null>
): UseSelectionSummaryReturn => {
  const getSelectionSummary = useCallback((): SelectionSummaryItem[] => {
    const selections: SelectionSummaryItem[] = [];

    // Focus selection
    if (options.customization_focus) {
      const focusFieldState = SelectionCounter.getFieldSelectionState(
        CUSTOMIZATION_FIELD_KEYS.FOCUS,
        options.customization_focus
      );

      if (focusFieldState.hasValue) {
        const value = formatters?.focus
          ? formatters.focus(options.customization_focus)
          : formatFocusOrEquipmentValue(options.customization_focus);

        if (value) {
          selections.push({
            key: 'focus',
            label: 'Focus',
            value,
            icon: Target,
          });
        }
      }
    }

    // Energy selection
    if (options.customization_energy) {
      const energyFieldState = SelectionCounter.getFieldSelectionState(
        CUSTOMIZATION_FIELD_KEYS.ENERGY,
        options.customization_energy
      );

      if (energyFieldState.hasValue) {
        const labels = ['', 'Very Low', 'Low', 'Moderate', 'High', 'Very High'];
        const energy = Number(options.customization_energy);

        const value = formatters?.energy
          ? formatters.energy(options.customization_energy)
          : energyFieldState.isValid && energy >= 1 && energy <= 5
            ? `${labels[energy]} (${energy}/5)`
            : `Energy Level ${energy}`;

        if (value) {
          selections.push({
            key: 'energy',
            label: 'Energy',
            value,
            icon: Battery,
          });
        }
      }
    }

    // Duration selection
    if (options.customization_duration) {
      const durationFieldState = SelectionCounter.getFieldSelectionState(
        CUSTOMIZATION_FIELD_KEYS.DURATION,
        options.customization_duration
      );

      if (durationFieldState.hasValue) {
        const duration = Number(options.customization_duration);
        let value: string;

        if (formatters?.duration) {
          value = formatters.duration(duration) || '';
        } else {
          if (duration >= 60) {
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            if (minutes === 0) {
              value = `${hours} hour${hours > 1 ? 's' : ''}`;
            } else {
              value = `${hours}h ${minutes}m`;
            }
          } else {
            value = `${duration} min`;
          }
        }

        if (value) {
          selections.push({
            key: 'duration',
            label: 'Duration',
            value,
            icon: Clock,
          });
        }
      }
    }

    // Equipment selection
    if (options.customization_equipment?.length) {
      const equipmentFieldState = SelectionCounter.getFieldSelectionState(
        CUSTOMIZATION_FIELD_KEYS.EQUIPMENT,
        options.customization_equipment
      );

      if (equipmentFieldState.hasValue) {
        const equipment = options.customization_equipment;
        let value: string;

        if (formatters?.equipment) {
          value = formatters.equipment(equipment) || '';
        } else {
          if (equipment.length === 1) {
            const formatted = formatFocusOrEquipmentValue(equipment[0]);
            value =
              formatted === 'Bodyweight Only' ? 'Bodyweight Only' : formatted;
          } else {
            value = `${equipment.length} items`;
          }
        }

        if (value) {
          selections.push({
            key: 'equipment',
            label: 'Equipment',
            value,
            icon: Dumbbell,
          });
        }
      }
    }

    return selections;
  }, [options, formatters]);

  const selections = getSelectionSummary();

  return {
    selections,
    hasSelections: selections.length > 0,
  };
};
