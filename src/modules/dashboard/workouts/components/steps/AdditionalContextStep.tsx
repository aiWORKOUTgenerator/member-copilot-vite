import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type { PerWorkoutOptions } from '../types';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';
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

  // Group examples by category for rendering chips/cards
  const examplesByCategory = useMemo(() => {
    return WORKOUT_PROMPT_EXAMPLES.reduce<Record<string, string[]>>(
      (acc, ex) => {
        if (!acc[ex.category]) acc[ex.category] = [];
        acc[ex.category].push(ex.text);
        return acc;
      },
      {}
    );
  }, []);

  // Insert/Replace helpers
  const insertSuggestion = useCallback(
    (text: string) => {
      const current = (options.customization_prompt || '').trim();
      const separator =
        current.length > 0 && !current.endsWith(';') ? '; ' : '';
      const next = `${current}${separator}${text}`.trim();
      handlePromptChange(next);
    },
    [options.customization_prompt, handlePromptChange]
  );

  const replaceWithSuggestion = useCallback(
    (text: string) => {
      handlePromptChange(text);
    },
    [handlePromptChange]
  );

  return (
    <div className="space-y-6" data-testid="additional-context-step">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2">
          <h3 className="text-xl font-semibold text-base-content">
            Additional Context
          </h3>
          <span className="badge badge-ghost">Optional</span>
        </div>
        <p className="text-base-content/70 mt-1">
          Add any details that don’t fit the previous steps. Pick a suggestion
          or write your own.
        </p>
      </div>

      {/* Suggestions Carousel (full width items) */}
      <div className="space-y-4">
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-base-content">
            Suggestions & examples
          </h4>
          <p className="text-sm text-base-content/70">
            Tap to insert, or use Add.
          </p>
        </div>
        <div className="carousel w-full h-80">
          {Object.entries(examplesByCategory).map(([category, items]) => (
            <div key={category} className="carousel-item w-full p-6">
              <div className="card bg-base-100/60 backdrop-blur border border-white/20 shadow-xl w-full h-full">
                <div className="card-body p-4 md:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">
                      {category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((text) => (
                      <div key={text} className="join">
                        <button
                          type="button"
                          className="btn btn-xs join-item btn-outline"
                          onClick={() => insertSuggestion(text)}
                          aria-label={`Insert suggestion: ${text}`}
                        >
                          {text}
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs join-item btn-ghost"
                          onClick={() => replaceWithSuggestion(text)}
                          aria-label={`Add suggestion: ${text}`}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-width Editor below cards */}
      <div>
        <div className="card bg-base-100/60 backdrop-blur border border-white/20 shadow-xl">
          <div className="card-body p-4 md:p-6">
            <label htmlFor="additional-context" className="label">
              <span className="label-text font-medium">Additional Context</span>
              <span className="label-text-alt text-base-content/60">
                10–1000 characters
              </span>
            </label>
            <textarea
              id="additional-context"
              className="textarea textarea-bordered w-full h-40 md:h-48"
              placeholder="e.g., Apartment-friendly, no jumping; prioritize mobility and core; avoid overhead pressing due to shoulder"
              value={options.customization_prompt || ''}
              onChange={(e) => handlePromptChange(e.target.value)}
              disabled={disabled}
              aria-describedby="additional-context-help"
            />
            <div className="flex items-center justify-between mt-2">
              <p
                id="additional-context-help"
                className="text-xs text-base-content/60"
              >
                You can insert suggestions above, then edit the text as you
                like.
              </p>
              <span className="text-xs text-base-content/60">
                {(options.customization_prompt || '').length} / 1000
              </span>
            </div>

            {errors.customization_prompt && (
              <div className="alert alert-error mt-3">
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
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-base-200/50 rounded-lg p-4">
        <h4 className="font-medium text-base-content mb-2">
          💡 Tips for better results
        </h4>
        <ul className="text-sm text-base-content/70 space-y-1">
          <li>• Be specific about environment (apartment, hotel, outdoor)</li>
          <li>• Mention limitations or needed modifications</li>
          <li>• Include current energy or mood if relevant</li>
          <li>• Specify equipment preferences or restrictions</li>
        </ul>
      </div>
    </div>
  );
};

export default AdditionalContextStep;
