import { useGeneratedWorkouts } from '@/hooks/useGeneratedWorkouts';
import { ArrowBigLeft } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import WorkoutCustomization from './components/WorkoutCustomization';
import WorkoutSummary from './components/WorkoutSummary';
import { PerWorkoutOptions } from './components/types';
import { useWorkoutAnalytics } from './hooks/useWorkoutAnalytics';

export default function GenerateWorkoutPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [perWorkoutOptions, setPerWorkoutOptions] = useState<PerWorkoutOptions>(
    {}
  );
  const { createWorkout } = useGeneratedWorkouts();
  const [errors, setErrors] = useState<
    Partial<Record<keyof PerWorkoutOptions, string>>
  >({});
  const [activeTab, setActiveTab] = useState<'custom' | 'quick'>('custom');
  const workoutAnalytics = useWorkoutAnalytics();

  // Convert per-workout options to string format for backend submission
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
        } else if (typeof value === 'object') {
          // ✅ FIX: Proper JSON serialization for complex objects
          stringOptions[key] = JSON.stringify(value);
        } else {
          // Convert primitives to strings
          stringOptions[key] = String(value);
        }
      }
    });

    return stringOptions;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For quick workout, use default prompt if none provided
    const workoutPrompt = activeTab === 'quick' && !prompt.trim() ? '' : prompt;

    if (activeTab === 'custom' && !workoutPrompt.trim()) return;

    // Validate workout duration if provided
    const newErrors: Partial<Record<keyof PerWorkoutOptions, string>> = {};

    if (perWorkoutOptions.customization_duration !== undefined) {
      const duration = Number(perWorkoutOptions.customization_duration);
      if (isNaN(duration) || duration < 5 || duration > 300) {
        newErrors.customization_duration =
          'Duration must be between 5 and 300 minutes';
      }
    }

    // If there are validation errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsGenerating(true);

    try {
      // Convert per-workout options to string format
      const stringOptions = convertOptionsToStrings(perWorkoutOptions);

      // Submit string-formatted customization options
      const combinedParams = stringOptions;

      const response = await createWorkout(
        import.meta.env.VITE_GENERATED_WORKOUT_CONFIGURATION_ID,
        combinedParams,
        workoutPrompt
      );

      console.log('Generated workout:', response);
      console.log('Submitted customization options:', stringOptions);

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
  };

  const handlePerWorkoutOptionChange = useCallback(
    (option: keyof PerWorkoutOptions, value: unknown) => {
      setPerWorkoutOptions((prev) => ({
        ...prev,
        [option]: value,
      }));

      // Clear error for this field if it exists
      setErrors((prev) => {
        if (prev[option]) {
          return {
            ...prev,
            [option]: undefined,
          };
        }
        return prev;
      });

      // ✅ Track preference changes with debouncing to prevent infinite loops
      workoutAnalytics.trackPreferenceChange(option, value);
    },
    [workoutAnalytics]
  );

  // Track successful workout generation
  const handleGenerationSuccess = (workoutId: string) => {
    workoutAnalytics.trackGenerationSuccess(workoutId);
  };

  // Track generation failures
  const handleGenerationError = (error: string) => {
    workoutAnalytics.trackGenerationError(error);
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="mb-2 sm:mb-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost flex items-center"
        >
          <ArrowBigLeft className="w-4 h-4" />
          Back to workouts
        </button>
      </div>

      <div className="card card-border max-w-4xl mx-auto">
        <div className="card-body">
          <h2 className="card-title">Generate a New Workout</h2>

          {/* Mode Selection */}
          <div className="join mb-6 w-fit">
            <button
              type="button"
              className={`btn join-item ${
                activeTab === 'custom' ? 'btn-primary' : 'btn-outline'
              }`}
              onClick={() => setActiveTab('custom')}
            >
              Custom Workout
            </button>
            <button
              type="button"
              className={`btn join-item ${
                activeTab === 'quick' ? 'btn-primary' : 'btn-outline'
              }`}
              onClick={() => setActiveTab('quick')}
            >
              Quick Workout
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'custom' ? (
              <>
                <p className="text-sm text-base-content/70 mb-6">
                  Customize your workout with the options below, then review
                  your selections
                </p>

                {/* Workout Customization */}
                <WorkoutCustomization
                  options={perWorkoutOptions}
                  onChange={handlePerWorkoutOptionChange}
                  errors={errors}
                  disabled={isGenerating}
                  mode="custom"
                />

                {/* Inline Review Summary */}
                <WorkoutSummary options={perWorkoutOptions} mode={activeTab} />

                {/* Additional Requirements - Now after review */}
                <div className="mb-6">
                  <label className="block mb-2 font-medium">
                    Additional Requirements{' '}
                    <span className="text-sm font-normal text-base-content/70">
                      (optional)
                    </span>
                  </label>

                  <textarea
                    className="textarea textarea-bordered validator w-full min-h-32"
                    placeholder="Describe any additional requirements, modifications, or specific goals for your workout..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                  ></textarea>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-base-content/70 mb-6">
                  Generate a quick workout based on your profile and preferences
                </p>

                {/* Quick Workout - Only duration */}
                <WorkoutCustomization
                  options={perWorkoutOptions}
                  onChange={handlePerWorkoutOptionChange}
                  errors={errors}
                  disabled={isGenerating}
                  mode="quick"
                />

                {/* Inline Review Summary for Quick Mode */}
                <WorkoutSummary options={perWorkoutOptions} mode={activeTab} />
              </>
            )}

            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isGenerating || Object.keys(errors).length > 0}
              >
                {isGenerating ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Generating...
                  </>
                ) : (
                  'Generate Workout'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
