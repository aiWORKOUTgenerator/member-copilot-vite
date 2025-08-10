import React from 'react';
import { CUSTOMIZATION_CONFIG } from '../customizations';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';

export interface WorkoutStructureStepProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
}

export const WorkoutStructureStep: React.FC<WorkoutStructureStepProps> = ({
  options,
  onChange,
  errors,
  disabled = false,
}) => {
  // Get components for this step - matching Quick mode pattern
  const stepConfigs = CUSTOMIZATION_CONFIG.filter((config) =>
    (
      [
        CUSTOMIZATION_FIELD_KEYS.DURATION,
        CUSTOMIZATION_FIELD_KEYS.FOCUS,
        CUSTOMIZATION_FIELD_KEYS.AREAS,
      ] as string[]
    ).includes(config.key)
  );

  const formatCurrentSelection = (
    config: (typeof CUSTOMIZATION_CONFIG)[0],
    value: unknown
  ): string | null => {
    if (!value) return null;

    switch (config.key) {
      case CUSTOMIZATION_FIELD_KEYS.DURATION: {
        const duration = value as number;
        if (duration >= 60) {
          const hours = Math.floor(duration / 60);
          const minutes = duration % 60;
          if (minutes === 0) {
            return `${hours} hour${hours > 1 ? 's' : ''}`;
          } else {
            return `${hours}h ${minutes}m`;
          }
        }
        return `${duration} min`;
      }

      case CUSTOMIZATION_FIELD_KEYS.AREAS: {
        const areas = value as string[];
        if (areas.length === 0) return null;
        if (areas.length === 1) {
          return areas[0]
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
        }
        return `${areas.length} areas`;
      }

      case CUSTOMIZATION_FIELD_KEYS.FOCUS: {
        const focus = value as string;
        return focus
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }

      default:
        return String(value);
    }
  };

  return (
    <div className="space-y-8" data-testid="workout-structure-step">
      {/* Step Header - matching Quick mode pattern */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-base-content mb-2">
          Workout Structure
        </h3>
        <p className="text-base-content/70">
          Define your workout's core parameters: how long you want to work out,
          what your main focus is, and which body areas you'd like to target.
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
                    {config.key === CUSTOMIZATION_FIELD_KEYS.DURATION &&
                      'Choose how long you want your workout to be'}
                    {config.key === CUSTOMIZATION_FIELD_KEYS.AREAS &&
                      'Select the body parts or workout types you want to focus on'}
                    {config.key === CUSTOMIZATION_FIELD_KEYS.FOCUS &&
                      "What's your main goal for this workout?"}
                  </p>
                </div>
                {currentSelection && (
                  <span className="badge badge-primary badge-sm ml-auto">
                    {currentSelection}
                  </span>
                )}
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
