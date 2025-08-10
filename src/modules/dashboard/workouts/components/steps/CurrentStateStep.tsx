import React from 'react';
import { CUSTOMIZATION_CONFIG } from '../customizations';
import type { PerWorkoutOptions } from '../types';

export interface CurrentStateStepProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
}

export const CurrentStateStep: React.FC<CurrentStateStepProps> = ({
  options,
  onChange,
  errors,
  disabled = false,
}) => {
  // Get components for this step
  const stepConfigs = CUSTOMIZATION_CONFIG.filter((config) =>
    [
      'customization_energy',
      'customization_stress',
      'customization_sleep',
      'customization_soreness',
    ].includes(config.key)
  );

  const formatCurrentSelection = (
    config: (typeof CUSTOMIZATION_CONFIG)[0],
    value: unknown
  ): string | null => {
    if (!value) return null;

    switch (config.key) {
      case 'customization_soreness': {
        const soreAreas = value as string[];
        if (soreAreas.length === 0) return null;
        if (soreAreas.length === 1) {
          return soreAreas[0]
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
        }
        return `${soreAreas.length} areas`;
      }

      case 'customization_sleep': {
        const rating = value as number;
        const labels = ['', 'Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'];
        return `${labels[rating]} (${rating}/5)`;
      }

      case 'customization_energy': {
        const rating = value as number;
        const labels = ['', 'Very Low', 'Low', 'Moderate', 'High', 'Very High'];
        return `${labels[rating]} (${rating}/5)`;
      }

      case 'customization_stress': {
        const rating = value as number;
        const labels = ['', 'Very Low', 'Low', 'Moderate', 'High', 'Very High'];
        return `${labels[rating]} (${rating}/5)`;
      }

      default:
        return String(value);
    }
  };

  return (
    <div className="space-y-8" data-testid="current-state-step">
      {/* Step Header - matching Quick mode pattern */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-base-content mb-2">
          Current State
        </h3>
        <p className="text-base-content/70">
          Help us understand your current physical and mental state so we can
          tailor your workout to how you're feeling today.
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
                    {config.key === 'customization_sleep' &&
                      'How well did you sleep last night?'}
                    {config.key === 'customization_energy' &&
                      'How energetic are you feeling today?'}
                    {config.key === 'customization_stress' &&
                      "What's your current stress level?"}
                    {config.key === 'customization_soreness' &&
                      'Are you experiencing any soreness?'}
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
