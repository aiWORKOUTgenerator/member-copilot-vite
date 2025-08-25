import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useConfiguration } from '@/hooks/useConfiguration';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useLocationAwareWorkoutGeneration } from './hooks/useLocationAwareWorkoutGeneration';
import { LocationLoadedGuard } from '@/components/LocationLoadedGuard';
import WorkoutCustomization from './components/WorkoutCustomization';
// import { LocationAwareEquipmentCustomization } from './components/enhanced/LocationAwareEquipmentCustomization';
// import { WORKOUTS_GENERATE_ROUTE } from './constants';
import type { PerWorkoutOptions } from './components/types';

/**
 * Enhanced Generate Page with Location Integration
 *
 * This component demonstrates how to integrate location data into the workout
 * generation process, providing location-aware equipment selection and
 * enhanced workout parameters.
 */
export default function GenerateWorkoutPageWithLocation() {
  const { mode } = useParams<{ mode: string }>();
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
  const [errors, setErrors] = useState<
    Partial<Record<keyof PerWorkoutOptions, string>>
  >({});
  const [isGenerating, setIsGenerating] = useState(false);

  const prevStepRef = useRef<'focus-energy' | 'duration-equipment'>(
    activeQuickStep
  );
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const { configuration } = useConfiguration();

  // Location-aware workout generation
  const {
    generateLocationAwareWorkout,
    validateEquipmentSelection,
    isLocationLoading,
    hasLocationData,
    defaultLocation,
  } = useLocationAwareWorkoutGeneration();

  // Track workout generation page views with location context
  useEffect(() => {
    analytics.track('Workout Generation Page Viewed', {
      tracked_at: new Date().toISOString(),
      hasLocationData,
      locationName: defaultLocation?.name || 'unknown',
      mode: activeTab,
    });
  }, [analytics, hasLocationData, defaultLocation, activeTab]);

  // Update activeTab when mode parameter changes
  useEffect(() => {
    if (mode === 'detailed') {
      setActiveTab('detailed');
    } else {
      setActiveTab('quick');
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For quick workout, handle step navigation
    if (activeTab === 'quick') {
      if (activeQuickStep === 'focus-energy') {
        setActiveQuickStep('duration-equipment');
        prevStepRef.current = 'focus-energy';
        return;
      } else {
        // Generate workout for quick mode
        await generateWorkout();
      }
    } else {
      // Detailed mode
      const workoutPrompt = prompt.trim();
      if (!workoutPrompt) return;
      await generateWorkout();
    }
  };

  const generateWorkout = async () => {
    setIsGenerating(true);

    try {
      const configId = configuration?.appConfig.generatedWorkoutConfigurationId;
      if (!configId) {
        console.error(
          'Missing generatedWorkoutConfigurationId from configuration'
        );
        setIsGenerating(false);
        handleGenerationError('Configuration not loaded');
        return;
      }

      // Validate equipment selection if location data is available
      if (hasLocationData && perWorkoutOptions.customization_equipment) {
        const validation = validateEquipmentSelection(
          perWorkoutOptions.customization_equipment
        );
        if (!validation.isValid) {
          setErrors((prev) => ({
            ...prev,
            customization_equipment: validation.errors.join(', '),
          }));
          setIsGenerating(false);
          return;
        }
      }

      // Generate workout with location context
      const response = await generateLocationAwareWorkout(
        configId,
        perWorkoutOptions,
        prompt || 'Quick workout generation'
      );

      // Redirect to the generated workout page
      navigate(`/dashboard/workouts/${response.id}`);

      // Track successful workout generation with location context
      handleGenerationSuccess(response.id);
    } catch (error) {
      console.error('Failed to generate workout:', error);
      setIsGenerating(false);
      handleGenerationError(
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  const handlePerWorkoutOptionChange = (
    option: keyof PerWorkoutOptions,
    value: unknown
  ) => {
    // Clear errors when user makes changes
    setErrors((prev) => ({ ...prev, [option]: undefined }));

    // Update options
    const newOptions = {
      ...perWorkoutOptions,
      [option]: value,
    };
    setPerWorkoutOptions(newOptions);

    // Track preference changes with location context
    analytics.track('Workout Preference Changed', {
      field: option,
      value: value,
      hasLocationData,
      locationName: defaultLocation?.name || 'unknown',
      mode: activeTab,
    });
  };

  const handleGenerationSuccess = (workoutId: string) => {
    analytics.track('Workout Generated Successfully', {
      workoutId,
      hasLocationData,
      locationName: defaultLocation?.name || 'unknown',
      mode: activeTab,
      equipmentCount: perWorkoutOptions.customization_equipment?.length || 0,
    });
  };

  const handleGenerationError = (errorMessage: string) => {
    analytics.track('Workout Generation Failed', {
      error: errorMessage,
      hasLocationData,
      locationName: defaultLocation?.name || 'unknown',
      mode: activeTab,
    });
  };

  return (
    <LocationLoadedGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            Generate Your Workout
            {hasLocationData && defaultLocation && (
              <span className="text-lg font-normal text-base-content/70 ml-2">
                at {defaultLocation.name}
              </span>
            )}
          </h1>

          {/* Location Status Indicator */}
          {hasLocationData && (
            <div className="bg-base-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">
                  Using equipment data from your location
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tab Navigation */}
            <div className="tabs tabs-boxed">
              <button
                type="button"
                className={`tab ${activeTab === 'quick' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('quick')}
              >
                Quick Setup
              </button>
              <button
                type="button"
                className={`tab ${activeTab === 'detailed' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('detailed')}
              >
                Detailed Setup
              </button>
            </div>

            {/* Workout Customization */}
            <WorkoutCustomization
              options={perWorkoutOptions}
              onChange={handlePerWorkoutOptionChange}
              errors={errors}
              disabled={isGenerating || isLocationLoading}
              mode={activeTab}
              activeQuickStep={activeQuickStep}
              onQuickStepChange={setActiveQuickStep}
            />

            {/* Detailed Mode Prompt Input */}
            {activeTab === 'detailed' && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Workout Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Describe your ideal workout..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`btn btn-primary ${isGenerating ? 'loading' : ''}`}
                disabled={isGenerating || isLocationLoading}
              >
                {isGenerating ? 'Generating...' : 'Generate Workout'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </LocationLoadedGuard>
  );
}
