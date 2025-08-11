import React from 'react';
import { CUSTOMIZATION_CONFIG } from '../customizations';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { SelectionBadge } from '@/ui/shared/atoms';

export interface EquipmentPreferencesStepProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
}

export const EquipmentPreferencesStep: React.FC<
  EquipmentPreferencesStepProps
> = ({ options, onChange, errors, disabled = false }) => {
  // Get components for this step
  const stepConfigs = CUSTOMIZATION_CONFIG.filter((config) =>
    (
      [
        CUSTOMIZATION_FIELD_KEYS.EQUIPMENT,
        CUSTOMIZATION_FIELD_KEYS.INCLUDE,
        CUSTOMIZATION_FIELD_KEYS.EXCLUDE,
      ] as string[]
    ).includes(config.key)
  );

  const formatCurrentSelection = (
    config: (typeof CUSTOMIZATION_CONFIG)[0],
    value: unknown
  ): string | null => {
    if (!value) return null;

    switch (config.key) {
      case CUSTOMIZATION_FIELD_KEYS.EQUIPMENT: {
        const equipment = value as string[];
        if (equipment.length === 0) return null;
        if (equipment.length === 1) {
          const formatted = equipment[0]
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
          return formatted === 'Bodyweight Only'
            ? 'Bodyweight Only'
            : formatted;
        }
        return `${equipment.length} items`;
      }

      case CUSTOMIZATION_FIELD_KEYS.INCLUDE: {
        const exercises = value as string;
        const exerciseList = exercises
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e.length > 0);
        if (exerciseList.length === 0) return null;
        if (exerciseList.length === 1) {
          return exerciseList[0];
        }
        return `${exerciseList.length} exercises`;
      }

      case CUSTOMIZATION_FIELD_KEYS.EXCLUDE: {
        const exercises = value as string;
        const exerciseList = exercises
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e.length > 0);
        if (exerciseList.length === 0) return null;
        if (exerciseList.length === 1) {
          return exerciseList[0];
        }
        return `${exerciseList.length} exercises`;
      }

      default:
        return String(value);
    }
  };

  return (
    <div className="space-y-8" data-testid="equipment-preferences-step">
      {/* Step Header - matching Quick mode pattern */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-base-content mb-2">
          Equipment & Preferences
        </h3>
        <p className="text-base-content/70">
          Tell us about your available equipment and any specific exercises
          you'd like to include or avoid in your workout.
        </p>
      </div>

      {/* Customization Options - using space-y-8 like Quick mode */}
      <div className="space-y-8">
        {stepConfigs.map((config) => {
          const IconComponent = config.icon;
          const CustomizationComponent = config.component;
          const value = options[config.key];
          const error = errors[config.key];
          const currentSelection = formatCurrentSelection(config, value);

          return (
            <div key={config.key} className="space-y-4">
              {/* Header with Icon - matching Quick mode DetailedSelector header pattern */}
              <div className="flex items-center space-x-3">
                <IconComponent className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="font-medium text-base-content">
                    {config.label}
                  </h4>
                  <p className="text-sm text-base-content/70">
                    {config.key === CUSTOMIZATION_FIELD_KEYS.EQUIPMENT &&
                      'Tell us what equipment you have available'}
                    {config.key === CUSTOMIZATION_FIELD_KEYS.INCLUDE &&
                      'Specify exercises you definitely want in your workout'}
                    {config.key === CUSTOMIZATION_FIELD_KEYS.EXCLUDE &&
                      'Specify exercises you want to avoid'}
                  </p>
                </div>
                <SelectionBadge value={currentSelection} size="sm" />
              </div>

              {/* Customization Component */}
              {!config.comingSoon ? (
                <CustomizationComponent
                  value={value}
                  onChange={(newValue) => onChange(config.key, newValue)}
                  disabled={disabled}
                  error={error}
                />
              ) : (
                <p className="text-sm text-base-content/50">
                  This customization option is coming soon! Stay tuned for
                  updates.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
