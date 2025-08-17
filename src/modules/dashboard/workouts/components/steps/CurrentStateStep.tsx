import React, { useCallback, useEffect, useRef } from 'react';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { validateDetailedStep } from '../../validation/detailedValidation';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';
import {
  EnhancedEnergyLevelCustomization,
  EnhancedSleepQualityCustomization,
  EnhancedStressLevelCustomization,
  EnhancedSorenessCustomization,
} from '../customizations/enhanced';
// Enhanced current state step - no longer using feature flag
// All enhanced components are stable and ready for production

export interface CurrentStateStepProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
  variant?: 'simple' | 'detailed';
}

export const CurrentStateStep: React.FC<CurrentStateStepProps> = ({
  options,
  onChange,
  errors,
  disabled = false,
  variant = 'detailed',
}) => {
  // Always call hooks first to avoid conditional hook calls
  const { trackStepCompletion } = useWorkoutAnalytics();
  const startTime = useRef(Date.now());

  // Enhanced change handler with validation
  const handleChange = useCallback(
    (key: keyof PerWorkoutOptions, value: unknown) => {
      onChange(key, value);

      // Run progressive validation for this step
      const stepErrors = validateDetailedStep('current-state', {
        ...options,
        [key]: value,
      });

      // Log validation errors for debugging
      if (
        stepErrors.errors &&
        stepErrors.errors[key as keyof typeof stepErrors.errors]
      ) {
        console.warn(
          `Validation error for ${key}:`,
          stepErrors.errors[key as keyof typeof stepErrors.errors]
        );
      }
    },
    [options, onChange]
  );

  // Track step completion on unmount
  useEffect(() => {
    const currentStartTime = startTime.current; // Copy ref value to avoid stale closure

    return () => {
      const duration = Date.now() - currentStartTime;
      const fieldsCompleted = [
        options.customization_energy,
        options.customization_sleep,
        options.customization_stress,
        options.customization_soreness?.length &&
          options.customization_soreness.length > 0,
      ].filter(Boolean).length;

      trackStepCompletion(
        'current-state',
        duration,
        'detailed',
        (fieldsCompleted / 4) * 100,
        fieldsCompleted
      );
    };
  }, [
    trackStepCompletion,
    options.customization_energy,
    options.customization_sleep,
    options.customization_stress,
    options.customization_soreness,
  ]);

  return (
    <div className="space-y-8" data-testid="current-state-step">
      {/* Step Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-base-content mb-2">
          Current State
        </h3>
        <p className="text-base-content/70">
          Help us understand your current physical and mental state.
        </p>
      </div>

      <div className="space-y-8">
        {/* Energy Level */}
        <div className="space-y-4">
          <EnhancedEnergyLevelCustomization
            value={options.customization_energy}
            onChange={(energy) =>
              handleChange(CUSTOMIZATION_FIELD_KEYS.ENERGY, energy)
            }
            disabled={disabled}
            error={errors.customization_energy}
            variant={variant}
          />
        </div>

        {/* Sleep Quality */}
        <div className="space-y-4">
          <EnhancedSleepQualityCustomization
            value={options.customization_sleep}
            onChange={(sleep) =>
              handleChange(CUSTOMIZATION_FIELD_KEYS.SLEEP, sleep)
            }
            disabled={disabled}
            error={errors.customization_sleep}
            variant={variant}
          />
        </div>

        {/* Stress Level */}
        <div className="space-y-4">
          <EnhancedStressLevelCustomization
            value={options.customization_stress}
            onChange={(stress) =>
              handleChange(CUSTOMIZATION_FIELD_KEYS.STRESS, stress)
            }
            disabled={disabled}
            error={errors.customization_stress}
            variant={variant}
          />
        </div>

        {/* Soreness */}
        <div className="space-y-4">
          <EnhancedSorenessCustomization
            value={options.customization_soreness}
            onChange={(soreness) =>
              handleChange(CUSTOMIZATION_FIELD_KEYS.SORENESS, soreness)
            }
            disabled={disabled}
            error={errors.customization_soreness}
            variant={variant}
          />
        </div>
      </div>
    </div>
  );
};
