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
    enabled: autoScrollEnabled,
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
        // Enhanced component handles formatting internally
        const soreAreas = value as string[];
        if (soreAreas.length === 0) return null;
        if (soreAreas.length === 1) {
          // Use enhanced option titles for consistent formatting
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
        const rating = value as number | undefined;
        if (rating === undefined || rating === null) {
          return 'Not specified';
        }
        const labels = [
          'Very Low',
          'Low',
          'Moderate',
          'Somewhat High',
          'High',
          'Very High',
        ];
        if (rating >= 1 && rating <= 6) {
          return `${labels[rating - 1]} (${rating}/6)`;
        }
        return 'Invalid';
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
        {/* Modern Header Container with Glass Morphism */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-sm border border-white/20 shadow-2xl shadow-primary/20 mb-8">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-xl"></div>

          <div className="relative z-10 p-8">
            {/* Header Section with Enhanced Typography */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform duration-200">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-accent/80 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-base-content to-base-content/80 bg-clip-text text-transparent">
                    Quick Workout Setup
                  </h3>
                  <p className="text-sm text-base-content/70 mt-1">
                    Streamlined workout generation in just 2 steps
                  </p>
                </div>
              </div>

              {/* Enhanced View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    viewMode === 'simple'
                      ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30 transform scale-105'
                      : 'text-base-content/70 hover:text-base-content hover:bg-white/5'
                  }`}
                  onClick={() => setViewMode('simple')}
                >
                  Simple
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    viewMode === 'detailed'
                      ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30 transform scale-105'
                      : 'text-base-content/70 hover:text-base-content hover:bg-white/5'
                  }`}
                  onClick={() => setViewMode('detailed')}
                >
                  Detailed
                </button>
              </div>
            </div>

            {/* Enhanced Progress Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Progress Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-base-content">
                    Overall Progress
                  </h4>
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {Math.round(quickProgress.overallProgress)}%
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary via-primary/80 to-accent rounded-full transition-all duration-500 ease-out relative"
                      style={{ width: `${quickProgress.overallProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-sm text-base-content/70 mt-2">
                    {quickProgress.completedFields} of{' '}
                    {quickProgress.totalFields} required fields completed
                  </p>
                </div>
              </div>

              {/* Auto-advance Toggle Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-base-content mb-1">
                      Auto-advance
                    </h4>
                    <p className="text-sm text-base-content/70">
                      Automatically move to next step
                    </p>
                  </div>
                  <div className="form-control">
                    <label
                      className="label cursor-pointer"
                      htmlFor="auto-advance-toggle"
                    >
                      <input
                        id="auto-advance-toggle"
                        type="checkbox"
                        className="toggle toggle-primary toggle-lg"
                        checked={autoScrollEnabled}
                        onChange={(e) => setAutoScrollEnabled(e.target.checked)}
                        aria-label="Auto-advance"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Step Navigation */}
            <div className="relative">
              <div className="flex items-center justify-between">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div
                    className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      currentStep === 'focus-energy'
                        ? 'bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30 transform scale-110'
                        : 'bg-white/20 border border-white/30'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span
                        className={`text-sm font-bold ${
                          currentStep === 'focus-energy'
                            ? 'text-white'
                            : 'text-base-content/70'
                        }`}
                      >
                        1
                      </span>
                    </div>
                    {currentStep === 'focus-energy' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-accent/80 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <h5
                      className={`font-semibold ${
                        currentStep === 'focus-energy'
                          ? 'text-base-content'
                          : 'text-base-content/70'
                      }`}
                    >
                      Focus & Energy
                    </h5>
                    <p className="text-xs text-base-content/60 mt-1">
                      Set your workout focus
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                <div className="flex-1 mx-4 relative">
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ${
                        currentStep === 'duration-equipment' ? 'w-full' : 'w-0'
                      }`}
                    ></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg"></div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div
                    className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      currentStep === 'duration-equipment'
                        ? 'bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30 transform scale-110'
                        : 'bg-white/20 border border-white/30'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span
                        className={`text-sm font-bold ${
                          currentStep === 'duration-equipment'
                            ? 'text-white'
                            : 'text-base-content/70'
                        }`}
                      >
                        2
                      </span>
                    </div>
                    {currentStep === 'duration-equipment' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-accent/80 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <h5
                      className={`font-semibold ${
                        currentStep === 'duration-equipment'
                          ? 'text-base-content'
                          : 'text-base-content/70'
                      }`}
                    >
                      Duration & Equipment
                    </h5>
                    <p className="text-xs text-base-content/60 mt-1">
                      Configure your session
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="flex justify-center mb-6">
          <div className="animate-bounce">
            <svg
              className="w-8 h-8 text-primary/60 hover:text-primary/80 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>

        {/* Step content */}
        {currentStep === 'focus-energy' && (
          <div className="space-y-6 mt-4">
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
          <div className="space-y-6 mt-4">
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
              variant={viewMode}
            />
          )}

          {detailedSteps.currentStep === 'equipment-preferences' && (
            <EquipmentPreferencesStep
              options={options}
              onChange={onChange}
              errors={errors}
              disabled={disabled}
              variant={viewMode}
            />
          )}

          {detailedSteps.currentStep === 'current-state' && (
            <CurrentStateStep
              options={options}
              onChange={onChange}
              errors={errors}
              disabled={disabled}
              variant={viewMode}
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
            className="btn btn-primary btn-active"
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
