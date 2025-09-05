import React, { useCallback, useEffect, useRef } from 'react';
import type { PerWorkoutOptions } from '../types';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';
import { PromptInputWithExamples } from '@/ui/shared/molecules/PromptInputWithExamples';
import { WORKOUT_PROMPT_EXAMPLES } from '../../constants/promptExamples';

export interface AdditionalContextStepProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
  variant?: 'simple' | 'detailed';
}

export const AdditionalContextStep: React.FC<AdditionalContextStepProps> = ({
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
        options.customization_prompt &&
          options.customization_prompt.trim() !== '',
      ].filter(Boolean).length;

      trackStepCompletion(
        'additional-context',
        duration,
        'detailed',
        (fieldsCompleted / 1) * 100,
        fieldsCompleted
      );
    };
  }, [options.customization_prompt, trackStepCompletion]);

  // Enhanced onChange handler with validation integration
  const handleChange = useCallback(
    (key: keyof PerWorkoutOptions, value: unknown) => {
      // Update the value
      onChange(key, value);

      // Track validation errors if any
      if (errors[key]) {
        trackValidationError(key, errors[key]!, 'detailed');
      }
    },
    [onChange, errors, trackValidationError]
  );

  // Handle prompt input changes
  const handlePromptChange = useCallback(
    (value: string) => {
      handleChange('customization_prompt', value);
    },
    [handleChange]
  );

  return (
    <div className="space-y-6" data-testid="additional-context-step">
      {/* Step Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-base-content mb-2">
          Additional Context
        </h3>
        <p className="text-base-content/70">
          Add any specific requirements, modifications, or goals to customize
          your workout
        </p>
      </div>

      {/* Prompt Input with Examples */}
      <PromptInputWithExamples
        value={options.customization_prompt || ''}
        onChange={handlePromptChange}
        examples={WORKOUT_PROMPT_EXAMPLES}
        disabled={disabled}
        placeholder="Describe any additional requirements, modifications, or specific goals..."
        label="Workout Description"
        optional={true}
        description="Select from the examples below or type your own additional context to generate a personalized workout."
        className="w-full"
      />

      {/* Error Display */}
      {errors.customization_prompt && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{errors.customization_prompt}</span>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-base-200/50 rounded-lg p-4">
        <h4 className="font-medium text-base-content mb-2">
          💡 Tips for Better Results
        </h4>
        <ul className="text-sm text-base-content/70 space-y-1">
          <li>
            • Be specific about your environment (apartment, gym, outdoor)
          </li>
          <li>• Mention any physical limitations or modifications needed</li>
          <li>• Include your current energy level or mood</li>
          <li>• Specify any equipment preferences or restrictions</li>
        </ul>
      </div>
    </div>
  );
};

export default AdditionalContextStep;
