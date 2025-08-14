import React from 'react';
import { CUSTOMIZATION_CONFIG } from '../customizations';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { SelectionBadge } from '@/ui/shared/atoms';

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
  // Fields that should have minimal UI (no icon, title, or description)
  const MINIMAL_UI_FIELDS: string[] = [
    CUSTOMIZATION_FIELD_KEYS.SLEEP,
    CUSTOMIZATION_FIELD_KEYS.STRESS,
    CUSTOMIZATION_FIELD_KEYS.SORENESS,
  ];

  // Get components for this step
  const stepConfigs = CUSTOMIZATION_CONFIG.filter((config) =>
    (
      [
        CUSTOMIZATION_FIELD_KEYS.ENERGY,
        CUSTOMIZATION_FIELD_KEYS.STRESS,
        CUSTOMIZATION_FIELD_KEYS.SLEEP,
        CUSTOMIZATION_FIELD_KEYS.SORENESS,
      ] as string[]
    ).includes(config.key)
  );

  const formatCurrentSelection = (
    config: (typeof CUSTOMIZATION_CONFIG)[0],
    value: unknown
  ): string | null => {
    if (!value) return null;

    switch (config.key) {
      case CUSTOMIZATION_FIELD_KEYS.SORENESS: {
        const soreAreas = value as string[];
        if (soreAreas.length === 0) return null;
        if (soreAreas.length === 1) {
          return soreAreas[0]
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
        }
        return `${soreAreas.length} areas`;
      }

      case CUSTOMIZATION_FIELD_KEYS.SLEEP: {
        const rating = value as number;
        const labels = ['', 'Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'];
        return `${labels[rating]} (${rating}/5)`;
      }

      case CUSTOMIZATION_FIELD_KEYS.ENERGY: {
        const rating = value as number;
        const labels = ['', 'Very Low', 'Low', 'Moderate', 'High', 'Very High'];
        return `${labels[rating]} (${rating}/5)`;
      }

      case CUSTOMIZATION_FIELD_KEYS.STRESS: {
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
                {!MINIMAL_UI_FIELDS.includes(config.key) && (
                  <IconComponent className="w-5 h-5 text-primary" />
                )}
                <div>
                  <h4 className="font-medium text-base-content">
                    {MINIMAL_UI_FIELDS.includes(config.key) ? '' : config.label}
                  </h4>
                  <p className="text-sm text-base-content/70">
                    {config.key === CUSTOMIZATION_FIELD_KEYS.ENERGY &&
                      'How energetic are you feeling today?'}
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
