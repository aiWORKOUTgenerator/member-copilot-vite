import { Target, Battery, Clock, Dumbbell } from 'lucide-react';
import { WorkoutCustomizationProps } from './types';
import { CUSTOMIZATION_CONFIG } from './customizations';
import { useState, useEffect, useRef } from 'react';
import {
  StepIndicator,
  DetailedSelector,
  SimpleDetailedViewSelector,
  ProgressBar,
} from '@/ui/shared/molecules';
import { SelectionBadge, ScrollTarget } from '@/ui/shared/atoms';
import { FieldValidationMessage } from './FieldValidationMessage';
import { useDetailedWorkoutSteps } from './hooks/useDetailedWorkoutSteps';
import { useQuickWorkoutProgress } from './hooks/useQuickWorkoutProgress';
import { useToast, useAutoScrollPreferences, useFormAutoScroll } from '@/hooks';
import {
  WorkoutStructureStep,
  EquipmentPreferencesStep,
  CurrentStateStep,
} from './steps';
import { CUSTOMIZATION_FIELD_KEYS } from '../constants/fieldKeys';

// Import enhanced options hook for consistent option transformations
import { useEnhancedOptions } from './utils/optionEnhancers';

// Enhanced options with consistent transformations
const useQuickWorkoutOptions = () => {
  const { focusOptions, energyOptions, durationOptions, equipmentOptions } =
    useEnhancedOptions();
  return { focusOptions, energyOptions, durationOptions, equipmentOptions };
};

export default function WorkoutCustomization({
  options,
  onChange,
  errors,
  disabled = false,
  mode = 'quick',
  activeQuickStep,
  onQuickStepChange,
}: WorkoutCustomizationProps & {
  activeQuickStep?: 'focus-energy' | 'duration-equipment';
  onQuickStepChange?: (step: 'focus-energy' | 'duration-equipment') => void;
}) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [internalActiveQuickStep, setInternalActiveQuickStep] = useState<
    'focus-energy' | 'duration-equipment'
  >('focus-energy');
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('detailed');

  // Use enhanced options for consistent transformations
  const { focusOptions, energyOptions, durationOptions, equipmentOptions } =
    useQuickWorkoutOptions();

  // Use global auto-scroll preferences
  const { enabled: autoScrollEnabled, setEnabled: setAutoScrollEnabled } =
    useAutoScrollPreferences();

  // Use external step state if provided, otherwise use internal state
  const currentStep = activeQuickStep || internalActiveQuickStep;
  const setCurrentStep = onQuickStepChange || setInternalActiveQuickStep;

  // Detailed mode step management
  const detailedSteps = useDetailedWorkoutSteps(options, 'workout-structure');

  // Quick mode progress tracking
  const quickProgress = useQuickWorkoutProgress(options);

  // Initialize universal auto-scroll pattern
  const { registerScrollTarget, handleFieldSelection } = useFormAutoScroll<
    WorkoutCustomizationProps['options']
  >({
    formId: 'workout-customization',
    steps: [
      {
        id: 'focus-energy',
        label: 'Focus & Energy',
        fields: [
          CUSTOMIZATION_FIELD_KEYS.FOCUS,
          CUSTOMIZATION_FIELD_KEYS.ENERGY,
        ],
        scrollTarget: 'focus-question',
      },
      {
        id: 'duration-equipment',
        label: 'Duration & Equipment',
        fields: [
          CUSTOMIZATION_FIELD_KEYS.DURATION,
          CUSTOMIZATION_FIELD_KEYS.EQUIPMENT,
        ],
        scrollTarget: 'duration-question',
      },
    ],
    currentStepId: currentStep,
    setCurrentStep: (stepId: string) =>
      setCurrentStep(stepId as 'focus-energy' | 'duration-equipment'),
    isStepComplete: (stepId, formData) => {
      if (stepId === 'focus-energy') {
        return !!(
          formData.customization_focus && formData.customization_energy
        );
      } else if (stepId === 'duration-equipment') {
        return !!(
          formData.customization_duration &&
          Array.isArray(formData.customization_equipment) &&
          formData.customization_equipment.length > 0
        );
      }
      return false;
    },
    getNextField: (currentField, stepId) => {
      if (stepId === 'focus-energy') {
        return currentField === CUSTOMIZATION_FIELD_KEYS.FOCUS
          ? CUSTOMIZATION_FIELD_KEYS.ENERGY
          : null;
      } else if (stepId === 'duration-equipment') {
        return currentField === CUSTOMIZATION_FIELD_KEYS.DURATION
          ? CUSTOMIZATION_FIELD_KEYS.EQUIPMENT
          : null;
      }
      return null;
    },
    getNextStep: (currentStepId) => {
      if (currentStepId === 'focus-energy') return 'duration-equipment';
      return null;
    },
  });

  // Initialize auto-scroll hooks for backward compatibility
  const { showSelectionToast } = useToast();

  // Ref for the component container
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when step changes
  useEffect(() => {
    // Scroll to top of the component when step changes
    const element = containerRef.current;
    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [currentStep, detailedSteps.currentStep]);

  // Basic validation logic for individual fields
  const getFieldValidationError = (
    fieldKey: keyof WorkoutCustomizationProps['options']
  ) => {
    if (fieldKey === CUSTOMIZATION_FIELD_KEYS.FOCUS) {
      const hasFocus = !!options.customization_focus;
      const hasEnergy = !!options.customization_energy;

      // Show error on focus field if energy is selected but focus is not
      if (hasEnergy && !hasFocus) {
        return 'Complete this section';
      }
    } else if (fieldKey === CUSTOMIZATION_FIELD_KEYS.ENERGY) {
      const hasFocus = !!options.customization_focus;
      const hasEnergy = !!options.customization_energy;

      // Show error on energy field if focus is selected but energy is not
      if (hasFocus && !hasEnergy) {
        return 'Complete this section';
      }
    } else if (fieldKey === CUSTOMIZATION_FIELD_KEYS.DURATION) {
      const hasDuration = !!options.customization_duration;
      const hasEquipment = !!(
        options.customization_equipment &&
        Array.isArray(options.customization_equipment) &&
        options.customization_equipment.length > 0
      );

      // Show error on duration field if equipment is selected but duration is not
      if (hasEquipment && !hasDuration) {
        return 'Complete this section';
      }
    } else if (fieldKey === CUSTOMIZATION_FIELD_KEYS.EQUIPMENT) {
      const hasDuration = !!options.customization_duration;
      const hasEquipment = !!(
        options.customization_equipment &&
        Array.isArray(options.customization_equipment) &&
        options.customization_equipment.length > 0
      );

      // Show error on equipment field if duration is selected but equipment is not
      if (hasDuration && !hasEquipment) {
        return 'Complete this section';
      }
    }
    return undefined;
  };

  // Check if step has any validation errors for step indicator
  const getStepValidationError = (
    step: 'focus-energy' | 'duration-equipment'
  ) => {
    if (step === 'focus-energy') {
      return (
        getFieldValidationError(CUSTOMIZATION_FIELD_KEYS.FOCUS) ||
        getFieldValidationError(CUSTOMIZATION_FIELD_KEYS.ENERGY)
      );
    } else if (step === 'duration-equipment') {
      return (
        getFieldValidationError(CUSTOMIZATION_FIELD_KEYS.DURATION) ||
        getFieldValidationError(CUSTOMIZATION_FIELD_KEYS.EQUIPMENT)
      );
    }
    return undefined;
  };

  // Simple step click handler without validation
  const handleStepClick = (stepId: string) => {
    if (stepId === 'focus-energy' || stepId === 'duration-equipment') {
      const newStep = stepId as 'focus-energy' | 'duration-equipment';
      const currentStepIndex = currentStep === 'focus-energy' ? 0 : 1;
      const newStepIndex = newStep === 'focus-energy' ? 0 : 1;

      // Only allow jumping backwards
      if (newStepIndex < currentStepIndex) {
        setCurrentStep(newStep);
      }
    }
  };

  const handleChange = (
    key: keyof WorkoutCustomizationProps['options'],
    value: unknown
  ) => {
    onChange(key, value);
  };

  // Helper function to format the current selection for display
  const formatCurrentSelection = (
    config: (typeof CUSTOMIZATION_CONFIG)[0],
    value: unknown
  ) => {
    if (!value) return null;

    switch (config.key) {
      case CUSTOMIZATION_FIELD_KEYS.DURATION: {
        const duration = value as number;
        if (duration >= 60) {
          const hours = Math.floor(duration / 60);
          const minutes = duration % 60;
          if (minutes === 0) {
            return `${hours} hour${hours > 1 ? 's' : ''}`;
          } else {
            return `${hours}h ${minutes}m`;
          }
        }
        return `${duration} min`;
      }

      case CUSTOMIZATION_FIELD_KEYS.AREAS: {
        const areas = value as string[];
        if (areas.length === 0) return null;
        if (areas.length === 1) {
          return areas[0]
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
        }
        return `${areas.length} areas`;
      }

      case CUSTOMIZATION_FIELD_KEYS.EQUIPMENT: {
        const equipment = value as string[];
        if (equipment.length === 0) return null;
        if (equipment.length === 1) {
          const formatted = equipment[0]
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
          return formatted === 'Bodyweight Only'
            ? 'Bodyweight Only'
            : formatted;
        }
        return `${equipment.length} items`;
      }

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

      case CUSTOMIZATION_FIELD_KEYS.FOCUS: {
        const focus = value as string;
        return focus
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }

      case CUSTOMIZATION_FIELD_KEYS.INCLUDE: {
        const exercises = value as string;
        const exerciseList = exercises
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e.length > 0);
        if (exerciseList.length === 0) return null;
        if (exerciseList.length === 1) {
          return exerciseList[0];
        }
        return `${exerciseList.length} exercises`;
      }

      case CUSTOMIZATION_FIELD_KEYS.EXCLUDE: {
        const exercises = value as string;
        const exerciseList = exercises
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e.length > 0);
        if (exerciseList.length === 0) return null;
        if (exerciseList.length === 1) {
          return exerciseList[0];
        }
        return `${exerciseList.length} exercises`;
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

  // Wrapper function to handle field selection with universal auto-scroll
  const handleSelectionWithAutoScroll = (
    key: keyof WorkoutCustomizationProps['options'],
    value: unknown
  ) => {
    // Show selection feedback
    const mockConfig = CUSTOMIZATION_CONFIG.find((c) => c.key === key);
    if (mockConfig) {
      const formattedSelection = formatCurrentSelection(mockConfig, value);
      if (formattedSelection) {
        showSelectionToast(formattedSelection);
      }
    }

    // Use universal auto-scroll pattern
    handleFieldSelection(
      key as string,
      value,
      options,
      (fieldId: string, value: unknown) => {
        handleChange(
          fieldId as keyof WorkoutCustomizationProps['options'],
          value
        );
      }
    );
  };

  // For quick mode, show step indicator with 2 segments
  if (mode === 'quick') {
    return (
      <div className="mb-6 workout-customization-container">
        <h3 className="text-lg font-semibold mb-4 flex items-center flex-wrap gap-2">
          <Target className="w-5 h-5" />
          <span>Quick Workout Setup</span>
          <span className="text-sm font-normal text-base-content/70">
            (all required)
          </span>
        </h3>

        {/* Controls */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Auto-scroll toggle */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3 py-2">
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm"
                  checked={autoScrollEnabled}
                  onChange={(e) => setAutoScrollEnabled(e.target.checked)}
                />
                <span className="label-text text-sm">Auto-advance</span>
              </label>
            </div>
          </div>

          {/* View mode toggle */}
          <SimpleDetailedViewSelector
            value={viewMode}
            onChange={setViewMode}
            size="sm"
            labels={{ simple: 'Simple', detailed: 'Detailed' }}
          />
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-4">
          <ProgressBar
            progress={quickProgress.overallProgress}
            label="Overall Progress"
            showPercentage={true}
            size="md"
            variant="primary"
            animated={true}
            description={`${quickProgress.completedFields} of ${quickProgress.totalFields} required fields completed`}
          />
        </div>

        {/* Step Indicator / Linear Stepper */}
        <StepIndicator
          steps={[
            {
              id: 'focus-energy',
              label: 'Focus & Energy',
              disabled: false, // First step is always enabled
              hasErrors: !!getStepValidationError('focus-energy'),
            },
            {
              id: 'duration-equipment',
              label: 'Duration & Equipment',
              disabled: false, // Always enabled
              hasErrors: !!getStepValidationError('duration-equipment'),
            },
          ]}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          disabled={disabled}
          showConnectors={true}
          size="md"
        />

        {/* Workout Structure Section - matching Detailed mode */}
        <div className="mt-section mb-6">
          <h3 className="text-xl font-semibold text-base-content mb-2">
            Workout Structure
          </h3>
          <p className="text-base-content/70">
            Define your workout's core parameters: what your main focus is, how
            you are feeling today, how long you want to work out, and what
            equipment you have available.
          </p>
        </div>

        {/* Step content */}
        {currentStep === 'focus-energy' && (
          <div className="space-y-8">
            <ScrollTarget
              targetId="focus-question"
              registerScrollTarget={registerScrollTarget}
              className="scroll-mt-4"
            >
              <DetailedSelector
                icon={Target}
                options={focusOptions}
                selectedValue={options.customization_focus || undefined}
                onChange={(focus) =>
                  handleSelectionWithAutoScroll(
                    CUSTOMIZATION_FIELD_KEYS.FOCUS,
                    focus
                  )
                }
                question="What's your main focus for this workout session?"
                description="Choose the training intention that best matches your goals for today"
                disabled={disabled}
                error={undefined}
                gridCols={3}
                colorScheme="primary"
                required={false}
                variant={viewMode}
              />
            </ScrollTarget>

            {/* Validation message for focus field */}
            <FieldValidationMessage
              field={CUSTOMIZATION_FIELD_KEYS.FOCUS}
              getFieldValidationError={getFieldValidationError}
            />

            <ScrollTarget
              targetId="focus-energy-customization_energy"
              registerScrollTarget={registerScrollTarget}
              className="scroll-mt-4"
            >
              <DetailedSelector
                icon={Battery}
                options={energyOptions}
                selectedValue={options.customization_energy || undefined}
                onChange={(energy) =>
                  handleSelectionWithAutoScroll(
                    CUSTOMIZATION_FIELD_KEYS.ENERGY,
                    energy
                  )
                }
                disabled={disabled}
                error={undefined}
                question="How energetic are you feeling today?"
                description="This helps us tailor the workout intensity to your current energy level."
                gridCols={3}
                colorScheme="primary"
                required={false}
                variant={viewMode}
              />
            </ScrollTarget>

            {/* Validation message for energy field */}
            <FieldValidationMessage
              field={CUSTOMIZATION_FIELD_KEYS.ENERGY}
              getFieldValidationError={getFieldValidationError}
            />
          </div>
        )}

        {currentStep === 'duration-equipment' && (
          <div className="space-y-8">
            <ScrollTarget
              targetId="duration-question"
              registerScrollTarget={registerScrollTarget}
              className="scroll-mt-4"
            >
              <DetailedSelector
                icon={Clock}
                options={durationOptions}
                selectedValue={
                  options.customization_duration?.toString() || undefined
                }
                onChange={(duration: string | string[]) => {
                  // DetailedSelector returns the ID string for single selection
                  const durationId = Array.isArray(duration)
                    ? duration[0]
                    : duration;
                  const durationValue = parseInt(durationId, 10);
                  if (isNaN(durationValue)) {
                    console.error('Invalid duration value:', duration);
                    return;
                  }
                  handleSelectionWithAutoScroll(
                    CUSTOMIZATION_FIELD_KEYS.DURATION,
                    durationValue
                  );
                }}
                question="How long do you want your workout to be?"
                description="Choose the duration that fits your schedule and energy level"
                disabled={disabled}
                error={undefined}
                gridCols={3}
                colorScheme="accent"
                required={true}
                variant={viewMode}
              />
            </ScrollTarget>

            {/* Validation message for duration field */}
            <FieldValidationMessage
              field={CUSTOMIZATION_FIELD_KEYS.DURATION}
              getFieldValidationError={getFieldValidationError}
            />

            <ScrollTarget
              targetId="duration-equipment-customization_equipment"
              registerScrollTarget={registerScrollTarget}
              className="scroll-mt-4"
            >
              <DetailedSelector
                icon={Dumbbell}
                options={equipmentOptions}
                selectedValue={
                  options.customization_equipment?.[0] || undefined
                }
                onChange={(equipment: string | string[]) => {
                  // DetailedSelector returns the ID string for single selection
                  const equipmentId = Array.isArray(equipment)
                    ? equipment[0]
                    : equipment;
                  handleSelectionWithAutoScroll(
                    CUSTOMIZATION_FIELD_KEYS.EQUIPMENT,
                    [equipmentId]
                  );
                }}
                question="What equipment do you have available?"
                description="Choose the equipment you have available for your workout"
                disabled={disabled}
                error={undefined}
                gridCols={3}
                colorScheme="primary"
                required={true}
                variant={viewMode}
              />
            </ScrollTarget>

            {/* Validation message for equipment field */}
            <FieldValidationMessage
              field={CUSTOMIZATION_FIELD_KEYS.EQUIPMENT}
              getFieldValidationError={getFieldValidationError}
            />
          </div>
        )}
      </div>
    );
  }

  // For detailed mode, show step-based interface
  if (mode === 'detailed') {
    return (
      <div
        ref={containerRef}
        className="mb-6"
        data-testid="detailed-workout-container"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center flex-wrap gap-2">
            <Target className="w-5 h-5" />
            <span>Detailed Workout Setup</span>
            <span className="text-sm font-normal text-base-content/70">
              (all optional)
            </span>
          </h3>

          {/* View Mode Toggle - matching Quick mode pattern */}
          <div className="mb-4 flex justify-end">
            <SimpleDetailedViewSelector
              value={viewMode}
              onChange={setViewMode}
              size="sm"
              labels={{ simple: 'Simple', detailed: 'Detailed' }}
            />
          </div>

          {/* Overall Progress */}
          <div className="mb-4">
            <ProgressBar
              progress={detailedSteps.getOverallProgress()}
              label="Overall Progress"
              showPercentage={true}
              size="md"
              variant="primary"
              animated={true}
            />
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator
          steps={detailedSteps.steps.map((step) => {
            const validation = detailedSteps.getStepValidation(step.id);
            return {
              id: step.id,
              label: step.label,
              description: `${validation.completionPercentage}% complete`,
              disabled: false,
              hasErrors: false, // All optional, so no errors
            };
          })}
          currentStep={detailedSteps.currentStep}
          onStepClick={detailedSteps.setCurrentStep}
          disabled={disabled}
          showConnectors={true}
          size="md"
        />

        {/* Step Content */}
        <div className="mt-8">
          {detailedSteps.currentStep === 'workout-structure' && (
            <WorkoutStructureStep
              options={options}
              onChange={onChange}
              errors={errors}
              disabled={disabled}
            />
          )}

          {detailedSteps.currentStep === 'equipment-preferences' && (
            <EquipmentPreferencesStep
              options={options}
              onChange={onChange}
              errors={errors}
              disabled={disabled}
            />
          )}

          {detailedSteps.currentStep === 'current-state' && (
            <CurrentStateStep
              options={options}
              onChange={onChange}
              errors={errors}
              disabled={disabled}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-base-200">
          <button
            type="button"
            className="btn btn-outline"
            onClick={detailedSteps.goToPreviousStep}
            disabled={!detailedSteps.canGoPrevious || disabled}
          >
            Previous
          </button>

          <div className="text-center">
            <span className="text-sm text-base-content/70">
              Step {detailedSteps.currentStepIndex + 1} of{' '}
              {detailedSteps.totalSteps}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={detailedSteps.goToNextStep}
            disabled={!detailedSteps.canGoNext || disabled}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Group configurations by category (fallback accordion mode)
  const groupedConfigs = CUSTOMIZATION_CONFIG.reduce(
    (acc, config) => {
      const category = config.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(config);
      return acc;
    },
    {} as Record<string, typeof CUSTOMIZATION_CONFIG>
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Fallback accordion mode (for backward compatibility)
  return (
    <div ref={containerRef} className="mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center flex-wrap gap-2">
        <Target className="w-5 h-5" />
        <span>Workout Customization</span>
        <span className="text-sm font-normal text-base-content/70">
          (all optional)
        </span>
      </h3>

      <div className="relative">
        <div className={`space-y-4`}>
          {Object.entries(groupedConfigs).map(([category, configs]) => (
            <div key={category} className="border border-base-300 rounded-lg">
              <button
                type="button"
                className="w-full p-4 text-left font-medium hover:bg-base-100 transition-colors rounded-t-lg flex items-center justify-between"
                onClick={() => toggleCategory(category)}
              >
                <span>{category}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    expandedCategories.includes(category) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {expandedCategories.includes(category) && (
                <div className="border-t border-base-300 p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {configs.map((config) => {
                      const IconComponent = config.icon;
                      const CustomizationComponent = config.component;
                      const value = options[config.key];
                      const error = errors[config.key];
                      const currentSelection = formatCurrentSelection(
                        config,
                        value
                      );

                      return (
                        <div
                          key={config.key}
                          className={`border border-base-200 rounded-lg p-4 ${
                            config.comingSoon ? 'opacity-50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <IconComponent className="w-4 h-4 mr-2" />
                              <span className="font-medium text-sm">
                                {config.label}
                              </span>
                              {config.comingSoon && (
                                <span className="badge badge-ghost badge-xs ml-2">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                            {!config.comingSoon && (
                              <SelectionBadge
                                value={currentSelection}
                                size="xs"
                              />
                            )}
                          </div>

                          {!config.comingSoon ? (
                            <>
                              <p className="text-xs text-base-content/70 mb-2">
                                {config.key === 'customization_duration' &&
                                  'Choose how long you want your workout to be'}
                                {config.key === 'customization_areas' &&
                                  'Select the body areas you want to focus on in your workout'}
                                {config.key === 'customization_focus' &&
                                  "What's your main focus for this workout session?"}
                                {config.key === 'customization_equipment' &&
                                  'Tell us what equipment you have available'}
                                {config.key === 'customization_include' &&
                                  'Specify exercises you definitely want in your workout'}
                                {config.key === 'customization_exclude' &&
                                  'Specify exercises you want to avoid'}
                              </p>
                              <CustomizationComponent
                                value={value}
                                onChange={(newValue) =>
                                  handleChange(config.key, newValue)
                                }
                                disabled={disabled}
                                error={error}
                              />
                            </>
                          ) : (
                            <p className="text-xs text-base-content/50">
                              This customization option is coming soon! Stay
                              tuned for updates.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
