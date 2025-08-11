import { useCallback } from 'react';
import { Target, Battery, Clock, Dumbbell } from 'lucide-react';
import type { PerWorkoutOptions } from '../components/types';

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
 * Reusable hook for tracking and formatting form selections across steps
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
      const value = formatters?.focus
        ? formatters.focus(options.customization_focus)
        : options.customization_focus
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());

      if (value) {
        selections.push({
          key: 'focus',
          label: 'Focus',
          value,
          icon: Target,
        });
      }
    }

    // Energy selection
    if (options.customization_energy) {
      const labels = ['', 'Very Low', 'Low', 'Moderate', 'High', 'Very High'];
      const value = formatters?.energy
        ? formatters.energy(options.customization_energy)
        : `${labels[options.customization_energy]} (${options.customization_energy}/5)`;

      if (value) {
        selections.push({
          key: 'energy',
          label: 'Energy',
          value,
          icon: Battery,
        });
      }
    }

    // Duration selection
    if (options.customization_duration) {
      const duration = options.customization_duration;
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

    // Equipment selection
    if (options.customization_equipment?.length) {
      const equipment = options.customization_equipment;
      let value: string;

      if (formatters?.equipment) {
        value = formatters.equipment(equipment) || '';
      } else {
        if (equipment.length === 1) {
          const formatted = equipment[0]
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
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

    return selections;
  }, [options, formatters]);

  const selections = getSelectionSummary();

  return {
    selections,
    hasSelections: selections.length > 0,
  };
};
