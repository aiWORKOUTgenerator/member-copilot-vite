import React, { useCallback, useEffect, useRef } from 'react';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { SelectionBadge } from '@/ui/shared/atoms';
import { formatSelectionValue } from '../../utils/selectionFormatters';
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
}

export const WorkoutStructureStep: React.FC<WorkoutStructureStepProps> = ({
  options,
  onChange,
  errors,
  disabled = false,
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

      {/* Enhanced Customization Options */}
      <div className="space-y-8">
        {/* Duration Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">
                Workout Duration
              </h4>
              <p className="text-sm text-base-content/70">
                Choose how long you want your workout to be
              </p>
            </div>
            <SelectionBadge
              value={formatSelectionValue(
                CUSTOMIZATION_FIELD_KEYS.DURATION,
                options.customization_duration
              )}
              size="sm"
            />
          </div>

          <EnhancedWorkoutDurationCustomization
            value={options.customization_duration}
            onChange={(duration) =>
              handleChange(CUSTOMIZATION_FIELD_KEYS.DURATION, duration)
            }
            disabled={disabled}
            error={errors.customization_duration}
          />
        </div>

        {/* Focus Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">Workout Focus</h4>
              <p className="text-sm text-base-content/70">
                What's your main focus for this workout session?
              </p>
            </div>
            <SelectionBadge
              value={formatSelectionValue(
                CUSTOMIZATION_FIELD_KEYS.FOCUS,
                options.customization_focus
              )}
              size="sm"
            />
          </div>

          <EnhancedWorkoutFocusCustomization
            value={options.customization_focus}
            onChange={(focus) =>
              handleChange(CUSTOMIZATION_FIELD_KEYS.FOCUS, focus)
            }
            disabled={disabled}
            error={errors.customization_focus}
          />
        </div>

        {/* Focus Areas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">Target Areas</h4>
              <p className="text-sm text-base-content/70">
                Which body areas do you want to focus on?
              </p>
            </div>
            <SelectionBadge
              value={formatSelectionValue(
                CUSTOMIZATION_FIELD_KEYS.AREAS,
                options.customization_areas
              )}
              size="sm"
            />
          </div>

          <EnhancedFocusAreaCustomization
            value={options.customization_areas}
            onChange={(areas) =>
              handleChange(CUSTOMIZATION_FIELD_KEYS.AREAS, areas)
            }
            disabled={disabled}
            error={errors.customization_areas}
          />
        </div>
      </div>
    </div>
  );
};
