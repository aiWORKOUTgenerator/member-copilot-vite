import React, { useCallback, useEffect, useRef } from 'react';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { SelectionBadge } from '@/ui/shared/atoms';
import { formatSelectionValue } from '../../utils/selectionFormatters';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';
import { EnhancedAvailableEquipmentCustomization } from '../customizations/enhanced';
// Keep legacy components for text input fields
import {
  IncludeExercisesCustomization,
  ExcludeExercisesCustomization,
} from '../customizations';

export interface EquipmentPreferencesStepProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
  variant?: 'simple' | 'detailed';
}

export const EquipmentPreferencesStep: React.FC<
  EquipmentPreferencesStepProps
> = ({ options, onChange, errors, disabled = false, variant = 'detailed' }) => {
  const { trackStepCompletion } = useWorkoutAnalytics();
  const startTime = useRef(Date.now());

  // Track step completion
  useEffect(() => {
    return () => {
      const duration = Date.now() - startTime.current;
      const fieldsCompleted = [
        (options.customization_equipment?.length ?? 0) > 0,
        options.customization_include,
        options.customization_exclude,
      ].filter(Boolean).length;

      trackStepCompletion(
        'equipment-preferences',
        duration,
        'detailed',
        (fieldsCompleted / 3) * 100
      );
    };
  }, []);

  const handleChange = useCallback(
    (key: keyof PerWorkoutOptions, value: unknown) => {
      onChange(key, value);
    },
    [onChange]
  );

  // Format functions for text fields
  const formatIncludeExercises = (value: string | undefined): string | null => {
    if (!value) return null;
    const exercises = value
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);
    if (exercises.length === 0) return null;
    if (exercises.length === 1) return exercises[0];
    return `${exercises.length} exercises`;
  };

  const formatExcludeExercises = (value: string | undefined): string | null => {
    if (!value) return null;
    const exercises = value
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);
    if (exercises.length === 0) return null;
    if (exercises.length === 1) return exercises[0];
    return `${exercises.length} exercises`;
  };

  return (
    <div className="space-y-8" data-testid="equipment-preferences-step">
      {/* Step Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-base-content mb-2">
          Equipment & Preferences
        </h3>
        <p className="text-base-content/70">
          Tell us about your available equipment and exercise preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Equipment - Enhanced Component */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">
                Available Equipment
              </h4>
              <p className="text-sm text-base-content/70">
                What equipment do you have available?
              </p>
            </div>
            <SelectionBadge
              value={formatSelectionValue(
                CUSTOMIZATION_FIELD_KEYS.EQUIPMENT,
                options.customization_equipment
              )}
              size="sm"
            />
          </div>

          <EnhancedAvailableEquipmentCustomization
            value={options.customization_equipment}
            onChange={(equipment) =>
              handleChange(CUSTOMIZATION_FIELD_KEYS.EQUIPMENT, equipment)
            }
            disabled={disabled}
            error={errors.customization_equipment}
            variant={variant}
          />
        </div>

        {/* Include Exercises - Keep Legacy (Text Input) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">
                Include Exercises
              </h4>
              <p className="text-sm text-base-content/70">
                Specify exercises you want in your workout (optional)
              </p>
            </div>
            <SelectionBadge
              value={formatIncludeExercises(options.customization_include)}
              size="sm"
            />
          </div>

          <IncludeExercisesCustomization
            value={options.customization_include}
            onChange={(include) =>
              handleChange(CUSTOMIZATION_FIELD_KEYS.INCLUDE, include)
            }
            disabled={disabled}
            error={errors.customization_include}
          />
        </div>

        {/* Exclude Exercises - Keep Legacy (Text Input) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">
                Exclude Exercises
              </h4>
              <p className="text-sm text-base-content/70">
                Specify exercises you want to avoid (optional)
              </p>
            </div>
            <SelectionBadge
              value={formatExcludeExercises(options.customization_exclude)}
              size="sm"
            />
          </div>

          <ExcludeExercisesCustomization
            value={options.customization_exclude}
            onChange={(exclude) =>
              handleChange(CUSTOMIZATION_FIELD_KEYS.EXCLUDE, exclude)
            }
            disabled={disabled}
            error={errors.customization_exclude}
          />
        </div>
      </div>
    </div>
  );
};
