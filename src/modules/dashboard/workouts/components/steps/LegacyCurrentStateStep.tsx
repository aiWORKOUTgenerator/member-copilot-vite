import React from 'react';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { SelectionBadge } from '@/ui/shared/atoms';
import EnergyLevelCustomization from '../customizations/EnergyLevelCustomization';
import {
  EnhancedSleepQualityCustomization,
  EnhancedStressLevelCustomization,
  EnhancedSorenessCustomization,
} from '../customizations/enhanced';
import { Zap, Moon, Brain, AlertTriangle } from 'lucide-react';

// Fields that should have minimal UI (no icon, title, or description)
const MINIMAL_UI_FIELDS: string[] = [
  CUSTOMIZATION_FIELD_KEYS.SLEEP,
  CUSTOMIZATION_FIELD_KEYS.STRESS,
  CUSTOMIZATION_FIELD_KEYS.SORENESS,
];

// Define step components directly to avoid CUSTOMIZATION_CONFIG issues
const stepComponents = [
  {
    key: CUSTOMIZATION_FIELD_KEYS.ENERGY,
    component: EnergyLevelCustomization,
    label: 'Energy Level',
    icon: Zap,
  },
  {
    key: CUSTOMIZATION_FIELD_KEYS.SLEEP,
    component: EnhancedSleepQualityCustomization,
    label: 'Sleep Quality',
    icon: Moon,
  },
  {
    key: CUSTOMIZATION_FIELD_KEYS.STRESS,
    component: EnhancedStressLevelCustomization,
    label: 'Stress Level',
    icon: Brain,
  },
  {
    key: CUSTOMIZATION_FIELD_KEYS.SORENESS,
    component: EnhancedSorenessCustomization,
    label: 'Current Soreness',
    icon: AlertTriangle,
  },
];

export interface LegacyCurrentStateStepProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
}

/**
 * Legacy CurrentStateStep Implementation
 *
 * This is the original implementation preserved as a fallback for the feature flag.
 * It uses the CUSTOMIZATION_CONFIG pattern with legacy components for backward compatibility.
 *
 * This component will be removed once the enhanced implementation is fully stable.
 */
export const LegacyCurrentStateStep: React.FC<LegacyCurrentStateStepProps> = ({
  options,
  onChange,
  errors,
  disabled = false,
}) => {
  const formatCurrentSelection = (
    config: { key: string; label: string },
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
        const labels = [
          '',
          'Very Poor',
          'Poor',
          'Fair',
          'Good',
          'Very Good',
          'Excellent',
        ];
        return `${labels[rating]} (${rating}/6)`;
      }

      case CUSTOMIZATION_FIELD_KEYS.ENERGY: {
        const rating = value as number;
        const labels = [
          '',
          'Very Low',
          'Low',
          'Moderate',
          'High',
          'Very High',
          'Maximum',
        ];
        return `${labels[rating]} (${rating}/6)`;
      }

      case CUSTOMIZATION_FIELD_KEYS.STRESS: {
        const rating = value as number;
        const labels = [
          '',
          'Very Low',
          'Low',
          'Moderate',
          'High',
          'Very High',
          'Extreme',
        ];
        return `${labels[rating]} (${rating}/6)`;
      }

      default:
        return String(value);
    }
  };

  return (
    <div className="space-y-8" data-testid="legacy-current-state-step">
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
        {stepComponents.map((config) => {
          const IconComponent = config.icon;
          const value = options[config.key as keyof PerWorkoutOptions];
          const error = errors[config.key as keyof PerWorkoutOptions];
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
              {config.key === CUSTOMIZATION_FIELD_KEYS.ENERGY ? (
                <EnergyLevelCustomization
                  value={value as number | undefined}
                  onChange={(newValue) =>
                    onChange(config.key as keyof PerWorkoutOptions, newValue)
                  }
                  disabled={disabled}
                  error={error}
                />
              ) : config.key === CUSTOMIZATION_FIELD_KEYS.SLEEP ? (
                <EnhancedSleepQualityCustomization
                  value={value as number | undefined}
                  onChange={(newValue) =>
                    onChange(config.key as keyof PerWorkoutOptions, newValue)
                  }
                  disabled={disabled}
                  error={error}
                  variant="detailed"
                />
              ) : config.key === CUSTOMIZATION_FIELD_KEYS.STRESS ? (
                <EnhancedStressLevelCustomization
                  value={value as number | undefined}
                  onChange={(newValue) =>
                    onChange(config.key as keyof PerWorkoutOptions, newValue)
                  }
                  disabled={disabled}
                  error={error}
                  variant="detailed"
                />
              ) : config.key === CUSTOMIZATION_FIELD_KEYS.SORENESS ? (
                <EnhancedSorenessCustomization
                  value={value as string[] | undefined}
                  onChange={(newValue) =>
                    onChange(config.key as keyof PerWorkoutOptions, newValue)
                  }
                  disabled={disabled}
                  error={error}
                  variant="detailed"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
