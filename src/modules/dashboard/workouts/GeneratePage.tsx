import { useGeneratedWorkouts } from '@/hooks/useGeneratedWorkouts';
import { useConfiguration } from '@/hooks/useConfiguration';
import { ArrowBigLeft } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import WorkoutCustomization from './components/WorkoutCustomization';
import { PerWorkoutOptions } from './components/types';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ButtonStateLogic } from './selectionCountingLogic';
import { useSelectionSummary } from './hooks/useSelectionSummary';
import {
  SelectionSummary,
  PromptInputWithExamples,
} from '@/ui/shared/molecules';
import { WORKOUT_PROMPT_EXAMPLES } from './constants/promptExamples';

export default function GenerateWorkoutPage() {
  const { mode } = useParams<{ mode: string }>();
  const { configuration } = useConfiguration();
  const [activeTab, setActiveTab] = useState<'quick' | 'detailed'>(
    mode === 'detailed' ? 'detailed' : 'quick'
  );
  const [activeQuickStep, setActiveQuickStep] = useState<
    'focus-energy' | 'duration-equipment'
  >('focus-energy');
  const [prompt, setPrompt] = useState('');
  const [perWorkoutOptions, setPerWorkoutOptions] = useState<PerWorkoutOptions>(
    {}
  );
  const [errors] = useState<Partial<Record<keyof PerWorkoutOptions, string>>>(
    {}
  );

  const prevStepRef = useRef<'focus-energy' | 'duration-equipment'>(
    activeQuickStep
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const { createWorkout } = useGeneratedWorkouts();
  const navigate = useNavigate();
  const analytics = useAnalytics();

  // Selection summary for Quick Workout Setup
  const { selections, hasSelections } = useSelectionSummary(perWorkoutOptions);

  // Track workout generation page views
  useEffect(() => {
    analytics.track('Workout Generation Page Viewed', {
      tracked_at: new Date().toISOString(),
    });
  }, [analytics]);

  // Update activeTab when mode parameter changes
  useEffect(() => {
    if (mode === 'detailed') {
      setActiveTab('detailed');
    } else {
      setActiveTab('quick');
    }
  }, [mode]);

  // Helper function to convert options to string format for API submission
  const convertOptionsToStrings = (
    options: PerWorkoutOptions
  ): Record<string, string> => {
    const stringOptions: Record<string, string> = {};

    // Convert each option to string format
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Convert arrays to comma-separated strings
          if (value.length > 0) {
            stringOptions[key] = value.join(', ');
          }
        } else {
          // Convert numbers and strings to strings
          stringOptions[key] = String(value);
        }
      }
    });

    return stringOptions;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For quick workout, handle step navigation
    if (activeTab === 'quick') {
      if (activeQuickStep === 'focus-energy') {
        // Simply advance to next step without validation
        setActiveQuickStep('duration-equipment');
        return;
      } else {
        // Proceed with workout generation without validation

        // Proceed with workout generation
        setIsGenerating(true);

        try {
          const configId =
            configuration?.appConfig.generatedWorkoutConfigurationId;
          if (!configId) {
            console.error(
              'Missing generatedWorkoutConfigurationId from configuration'
            );
            setIsGenerating(false);
            handleGenerationError('Configuration not loaded');
            return;
          }
          // Convert per-workout options to string format
          const stringOptions = convertOptionsToStrings(perWorkoutOptions);

          // Submit string-formatted customization options
          const combinedParams = stringOptions;

          const response = await createWorkout(
            configId,
            combinedParams,
            '' // No prompt for quick workout
          );

          // Redirect to the generated workout page
          navigate(`/dashboard/workouts/${response.id}`);

          // Track successful workout generation
          handleGenerationSuccess(response.id);
        } catch (error) {
          console.error('Failed to generate workout:', error);
          setIsGenerating(false);

          // Track generation failures
          handleGenerationError(
            error instanceof Error ? error.message : String(error)
          );
        }
      }
    } else {
      // Detailed mode - use existing logic
      const workoutPrompt = prompt.trim();
      if (!workoutPrompt) return;

      setIsGenerating(true);

      try {
        const configId =
          configuration?.appConfig.generatedWorkoutConfigurationId;
        if (!configId) {
          console.error(
            'Missing generatedWorkoutConfigurationId from configuration'
          );
          setIsGenerating(false);
          handleGenerationError('Configuration not loaded');
          return;
        }
        // Convert per-workout options to string format
        const stringOptions = convertOptionsToStrings(perWorkoutOptions);

        // Submit string-formatted customization options
        const combinedParams = stringOptions;

        const response = await createWorkout(
          configId,
          combinedParams,
          workoutPrompt
        );

        // Redirect to the generated workout page
        navigate(`/dashboard/workouts/${response.id}`);

        // Track successful workout generation
        handleGenerationSuccess(response.id);
      } catch (error) {
        console.error('Failed to generate workout:', error);
        setIsGenerating(false);

        // Track generation failures
        handleGenerationError(
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  };

  const handlePerWorkoutOptionChange = (
    option: keyof PerWorkoutOptions,
    value: unknown
  ) => {
    // Update options
    const newOptions = {
      ...perWorkoutOptions,
      [option]: value,
    };
    setPerWorkoutOptions(newOptions);

    // Track preference changes
    handlePreferenceChange(option, value);
  };

  // Track successful workout generation
  const handleGenerationSuccess = (workoutId: string) => {
    analytics.track('Workout Generated Successfully', {
      workoutId,
      mode: activeTab,
      hasGoal: !!perWorkoutOptions.customization_goal,
      hasEnergy: !!perWorkoutOptions.customization_energy,
      hasDuration: !!perWorkoutOptions.customization_duration,
      hasEquipment: !!perWorkoutOptions.customization_equipment,
      goal: perWorkoutOptions.customization_goal,
      energy: perWorkoutOptions.customization_energy,
      duration: perWorkoutOptions.customization_duration,
      equipment: perWorkoutOptions.customization_equipment,
      tracked_at: new Date().toISOString(),
    });
  };

  // Track generation failures
  const handleGenerationError = (error: string) => {
    analytics.track('Workout Generation Failed', {
      error,
      mode: activeTab,
      hasGoal: !!perWorkoutOptions.customization_goal,
      hasEnergy: !!perWorkoutOptions.customization_energy,
      hasDuration: !!perWorkoutOptions.customization_duration,
      hasEquipment: !!perWorkoutOptions.customization_equipment,
      tracked_at: new Date().toISOString(),
    });
  };

  // Track preference changes
  const handlePreferenceChange = (preferenceType: string, value: unknown) => {
    analytics.track('Workout Preference Changed', {
      preferenceType,
      value,
      mode: activeTab,
      tracked_at: new Date().toISOString(),
    });
  };

  // Track step changes
  useEffect(() => {
    // Only update when actually switching between steps
    const prevStep = prevStepRef.current;
    if (prevStep !== activeQuickStep) {
      prevStepRef.current = activeQuickStep;
    }
  }, [activeQuickStep]);

  // No longer using complex selection counting for quick workout

  // Selection checking is now handled by ButtonStateLogic

  // Helper function to get indicator color class
  const getIndicatorColorClass = (color?: string): string => {
    switch (color) {
      case 'green':
        return 'bg-success';
      case 'red':
        return 'bg-error';
      case 'blue':
        return 'bg-primary';
      default:
        return 'bg-base-content/40';
    }
  };

  // Get button state based on active tab
  const getButtonState = () => {
    if (activeTab === 'detailed') {
      const hasErrors = Object.keys(errors).length > 0;
      return {
        className: 'btn btn-primary',
        disabled: hasErrors,
        text: 'Generate Workout',
      };
    }

    // Quick mode - use sophisticated button state logic
    const buttonState = ButtonStateLogic.getHybridButtonState(
      activeQuickStep,
      perWorkoutOptions,
      errors,
      isGenerating
    );

    return {
      className: buttonState.className,
      disabled: buttonState.disabled,
      text: buttonState.text,
      visualFeedback: buttonState.visualFeedback,
    };
  };

  // Store button state to avoid multiple function calls
  const buttonState = getButtonState();

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost flex items-center"
      >
        <ArrowBigLeft className="w-4 h-4" />
        Back to workouts
      </button>

      <div className="card card-border max-w-4xl mx-auto bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Generate a New Workout</h2>

          {/* Mode Selection */}
          <div className="join mb-6 w-fit">
            <button
              type="button"
              className={`btn btn-sm md:btn-md join-item ${
                activeTab === 'quick' ? 'btn-primary' : 'btn-outline'
              }`}
              onClick={() => setActiveTab('quick')}
            >
              Quick Workout Setup
            </button>
            <button
              type="button"
              className={`btn btn-sm md:btn-md join-item ${
                activeTab === 'detailed' ? 'btn-primary' : 'btn-outline'
              }`}
              onClick={() => setActiveTab('detailed')}
            >
              Detailed Workout Setup
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'quick' ? (
              <>
                <p className="text-sm text-base-content/70 mb-6">
                  Set up a quick workout based on your profile and preferences
                </p>

                {/* Quick Workout - Only duration */}
                <WorkoutCustomization
                  options={perWorkoutOptions}
                  onChange={handlePerWorkoutOptionChange}
                  errors={{}}
                  disabled={isGenerating}
                  mode="quick"
                  activeQuickStep={activeQuickStep}
                  onQuickStepChange={setActiveQuickStep}
                />
              </>
            ) : (
              <>
                <p className="text-sm text-base-content/70 mb-6">
                  Set up your detailed workout with the options below, then
                  optionally describe additional requirements
                </p>

                {/* Workout Customization - Now above the textarea */}
                <WorkoutCustomization
                  options={perWorkoutOptions}
                  onChange={handlePerWorkoutOptionChange}
                  errors={errors}
                  disabled={isGenerating}
                  mode="detailed"
                />

                {/* Prompt Input with Examples - Now as a separate container */}
                <PromptInputWithExamples
                  value={prompt}
                  onChange={setPrompt}
                  examples={WORKOUT_PROMPT_EXAMPLES}
                  disabled={isGenerating}
                  optional={false}
                  className="mb-6"
                />
              </>
            )}

            <div className="card-actions">
              {/* Responsive layout container */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full">
                {/* Progress indicator - left side on desktop */}
                {activeTab === 'quick' && (
                  <div className="flex items-center gap-3 text-sm text-base-content/60 sm:mr-auto order-2 sm:order-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${getIndicatorColorClass(
                          buttonState.visualFeedback?.indicatorColor
                        )}`}
                      ></div>
                      <span className="transition-opacity duration-200">
                        {buttonState.visualFeedback?.message ||
                          'Complete current step'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Selection Summary - center/above on mobile, center on desktop */}
                {activeTab === 'quick' && (
                  <SelectionSummary
                    selections={selections}
                    isVisible={hasSelections}
                    variant="compact"
                    className="order-1 sm:order-2 w-full sm:w-auto justify-center sm:justify-start"
                  />
                )}

                {/* Generate button - right side */}
                <button
                  type="submit"
                  className={`${buttonState.className} transition-all duration-200 order-3`}
                  disabled={buttonState.disabled}
                  title={buttonState.disabled ? buttonState.text : undefined}
                >
                  {isGenerating ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Generating...
                    </>
                  ) : (
                    buttonState.text
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
