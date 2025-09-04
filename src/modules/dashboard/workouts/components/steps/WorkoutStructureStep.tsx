import React, { useCallback, useEffect, useRef } from 'react';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { validateDetailedStep } from '../../validation/detailedValidation';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';
import {
  EnhancedWorkoutDurationCustomization,
  EnhancedWorkoutFocusCustomization,
  EnhancedFocusAreaCustomization,
} from '../customizations/enhanced';

export interface WorkoutStructureStepProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
  variant?: 'simple' | 'detailed';
}

export const WorkoutStructureStep: React.FC<WorkoutStructureStepProps> = ({
  options,
  onChange,
  errors,
  disabled = false,
  variant = 'detailed',
}) => {
  // Analytics integration for tracking user interactions
  const { trackStepCompletion, trackValidationError } = useWorkoutAnalytics();
  const startTime = useRef(Date.now());

  // Track step completion when component unmounts
  useEffect(() => {
    return () => {
      const duration = Date.now() - startTime.current;
      const fieldsCompleted = [
        options.customization_duration,
        options.customization_focus,
        (options.customization_areas?.length ?? 0) > 0,
      ].filter(Boolean).length;

      trackStepCompletion(
        'workout-structure',
        duration,
        'detailed',
        (fieldsCompleted / 3) * 100,
        fieldsCompleted
      );
    };
  }, [
    options.customization_duration,
    options.customization_focus,
    options.customization_areas,
    trackStepCompletion,
  ]);

  // Enhanced onChange handler with validation integration
  const handleChange = useCallback(
    (key: keyof PerWorkoutOptions, value: unknown) => {
      // Update the value
      onChange(key, value);

      // Run step validation for real-time feedback
      const stepErrors = validateDetailedStep('workout-structure', {
        ...options,
        [key]: value,
      });

      // Track validation errors for analytics
      const errorMessage =
        stepErrors.errors[key as keyof typeof stepErrors.errors];
      if (errorMessage) {
        trackValidationError(key, errorMessage, 'detailed', value);
      }
    },
    [options, onChange, trackValidationError]
  );

  return (
    <div className="space-y-6 mt-4" data-testid="workout-structure-step">
      {/* Enhanced Customization Options */}
      <div className="space-y-6">
        {/* Duration Selection */}
        <div className="space-y-4">
          <EnhancedWorkoutDurationCustomization
            value={options.customization_duration}
            onChange={(duration) =>
              handleChange(CUSTOMIZATION_FIELD_KEYS.DURATION, duration)
            }
            disabled={disabled}
            error={errors.customization_duration}
            variant={variant}
          />
        </div>

        {/* Focus Selection */}
        <div className="space-y-4">
          <EnhancedWorkoutFocusCustomization
            value={options.customization_focus}
            onChange={(focus) =>
              handleChange(CUSTOMIZATION_FIELD_KEYS.FOCUS, focus)
            }
            disabled={disabled}
            error={errors.customization_focus}
            variant={variant}
          />
        </div>

        {/* Focus Areas */}
        <div className="space-y-4">
          <EnhancedFocusAreaCustomization
            value={options.customization_areas}
            onChange={(areas) =>
              handleChange(CUSTOMIZATION_FIELD_KEYS.AREAS, areas)
            }
            disabled={disabled}
            error={errors.customization_areas}
            variant={variant}
          />
        </div>
      </div>
    </div>
  );
};
