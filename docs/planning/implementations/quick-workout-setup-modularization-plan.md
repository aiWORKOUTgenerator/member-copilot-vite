# Quick Workout Setup Modularization Plan

## 📋 Executive Summary

The Quick Workout Setup implementation in `WorkoutCustomization.tsx` has grown to 939 lines and contains significant code duplication between Quick and Detailed modes. This document provides a comprehensive audit and modularization strategy to improve maintainability, reduce code duplication, and establish consistent selector patterns across both modes.

## 🔍 Current Implementation Audit

### File Structure Analysis

**Current State**: `WorkoutCustomization.tsx` (939 lines)

- **Quick Mode**: ~400 lines (43% of file)
- **Detailed Mode**: ~300 lines (32% of file)
- **Shared Logic**: ~200 lines (21% of file)
- **Fallback Mode**: ~39 lines (4% of file)

### Code Duplication Issues

#### 1. Option Transformation Logic

```typescript
// Lines 30-85: Duplicated option transformation
const FOCUS_OPTIONS_WITH_INTENSITY = QUICK_WORKOUT_FOCUS_OPTIONS.map(...)
const ENERGY_OPTIONS_WITH_DOTS = ENERGY_LEVEL_OPTIONS.map(...)
const DURATION_OPTIONS_WITH_SUBTITLE = QUICK_WORKOUT_DURATION_OPTIONS.map(...)
const EQUIPMENT_OPTIONS = QUICK_WORKOUT_EQUIPMENT_OPTIONS.map(...)
```

#### 2. Validation Logic Duplication

- **Quick Mode**: Progressive validation with step-based logic
- **Detailed Mode**: Optional field validation with completion percentages
- **Shared**: Field validation error generation

#### 3. UI Component Duplication

- **Step Indicators**: Different implementations for Quick vs Detailed
- **Progress Bars**: Similar logic with different data sources
- **View Mode Toggles**: Identical implementation in both modes

### Selector Pattern Inconsistencies

#### Quick Mode Selectors (DetailedSelector)

```typescript
// Uses DetailedSelector with enhanced options
<DetailedSelector
  icon={Target}
  options={FOCUS_OPTIONS_WITH_INTENSITY} // Enhanced with LevelDots
  selectedValue={options.customization_focus}
  onChange={handleSelectionWithAutoScroll}
  variant={viewMode}
/>
```

#### Detailed Mode Selectors (Legacy Components)

```typescript
// Uses legacy customization components
<WorkoutFocusCustomization
  value={value}
  onChange={(newValue) => onChange(config.key, newValue)}
  disabled={disabled}
  error={error}
/>
```

#### Legacy Customization Components

- **WorkoutFocusCustomization**: Simple button grid (72 lines)
- **EnergyLevelCustomization**: Rating buttons (103 lines)
- **No tertiary content**: Missing visual indicators
- **Inconsistent UX**: Different interaction patterns

## 🎯 Modularization Strategy

### Phase 1: Extract Option Transformation Logic

#### 1.1 Create Option Enhancement Utilities

**File**: `src/modules/dashboard/workouts/components/utils/optionEnhancers.ts`

```typescript
import { LevelDots } from '@/ui/shared/atoms';
import {
  QUICK_WORKOUT_FOCUS_OPTIONS,
  ENERGY_LEVEL_OPTIONS,
  QUICK_WORKOUT_DURATION_OPTIONS,
  QUICK_WORKOUT_EQUIPMENT_OPTIONS,
} from '../../constants';

export const enhanceFocusOptionsWithIntensity = () => {
  return QUICK_WORKOUT_FOCUS_OPTIONS.map((option) => {
    const intensityLevel = getIntensityLevel(option.id);
    return {
      ...option,
      tertiary: <LevelDots count={6} activeIndex={intensityLevel - 1} size="sm" />,
    };
  });
};

export const enhanceEnergyOptionsWithDots = () => {
  return ENERGY_LEVEL_OPTIONS.map((option) => ({
    ...option,
    tertiary: <LevelDots count={6} activeIndex={parseInt(option.id) - 1} size="sm" />,
  }));
};

export const enhanceDurationOptionsWithSubtitles = () => {
  return QUICK_WORKOUT_DURATION_OPTIONS.map((option) => ({
    id: option.id,
    title: option.title,
    description: option.description,
    tertiary: option.subtitle,
  }));
};

export const enhanceEquipmentOptions = () => {
  return QUICK_WORKOUT_EQUIPMENT_OPTIONS.map((option) => ({
    id: option.id,
    title: option.title,
    description: option.description,
  }));
};

const getIntensityLevel = (focusId: string): number => {
  switch (focusId) {
    case 'gentle_recovery':
    case 'stress_reduction':
      return 2; // Low intensity
    case 'improve_posture':
    case 'core_abs':
      return 4; // Medium intensity
    case 'energizing_boost':
    case 'quick_sweat':
      return 6; // High intensity
    default:
      return 3; // Default medium
  }
};
```

#### 1.2 Create Enhanced Option Hooks

**File**: `src/modules/dashboard/workouts/components/hooks/useEnhancedOptions.ts`

```typescript
import { useMemo } from 'react';
import {
  enhanceFocusOptionsWithIntensity,
  enhanceEnergyOptionsWithDots,
  enhanceDurationOptionsWithSubtitles,
  enhanceEquipmentOptions,
} from '../utils/optionEnhancers';

export const useEnhancedOptions = () => {
  return useMemo(
    () => ({
      focusOptions: enhanceFocusOptionsWithIntensity(),
      energyOptions: enhanceEnergyOptionsWithDots(),
      durationOptions: enhanceDurationOptionsWithSubtitles(),
      equipmentOptions: enhanceEquipmentOptions(),
    }),
    []
  );
};
```

### Phase 2: Create Unified Selector Components

#### 2.1 Create Enhanced Customization Components

**File**: `src/modules/dashboard/workouts/components/customizations/EnhancedWorkoutFocusCustomization.tsx`

```typescript
import { DetailedSelector } from '@/ui/shared/molecules';
import { Target } from 'lucide-react';
import { CustomizationComponentProps } from '../types';
import { useEnhancedOptions } from '../hooks/useEnhancedOptions';

export default function EnhancedWorkoutFocusCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<string | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { focusOptions } = useEnhancedOptions();

  return (
    <DetailedSelector
      icon={Target}
      options={focusOptions}
      selectedValue={value || undefined}
      onChange={onChange}
      question="What's your main goal for this workout?"
      description="Choose the primary focus that best matches your current needs and goals"
      disabled={disabled}
      error={error}
      gridCols={3}
      colorScheme="primary"
      required={false}
      variant={variant}
    />
  );
}
```

**File**: `src/modules/dashboard/workouts/components/customizations/EnhancedEnergyLevelCustomization.tsx`

```typescript
import { DetailedSelector } from '@/ui/shared/molecules';
import { Battery } from 'lucide-react';
import { CustomizationComponentProps } from '../types';
import { useEnhancedOptions } from '../hooks/useEnhancedOptions';

export default function EnhancedEnergyLevelCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<number | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { energyOptions } = useEnhancedOptions();

  return (
    <DetailedSelector
      icon={Battery}
      options={energyOptions}
      selectedValue={value?.toString() || undefined}
      onChange={(energy) => onChange(parseInt(energy as string, 10))}
      question="How energetic are you feeling today?"
      description="This helps us tailor the workout intensity to your current energy level"
      disabled={disabled}
      error={error}
      gridCols={3}
      colorScheme="primary"
      required={false}
      variant={variant}
    />
  );
}
```

#### 2.2 Create Enhanced Duration and Equipment Components

**File**: `src/modules/dashboard/workouts/components/customizations/EnhancedWorkoutDurationCustomization.tsx`

```typescript
import { DetailedSelector } from '@/ui/shared/molecules';
import { Clock } from 'lucide-react';
import { CustomizationComponentProps } from '../types';
import { useEnhancedOptions } from '../hooks/useEnhancedOptions';

export default function EnhancedWorkoutDurationCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<number | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { durationOptions } = useEnhancedOptions();

  return (
    <DetailedSelector
      icon={Clock}
      options={durationOptions}
      selectedValue={value?.toString() || undefined}
      onChange={(duration) => onChange(parseInt(duration as string, 10))}
      question="How long do you want your workout to be?"
      description="Choose the duration that fits your schedule and energy level"
      disabled={disabled}
      error={error}
      gridCols={3}
      colorScheme="accent"
      required={true}
      variant={variant}
    />
  );
}
```

**File**: `src/modules/dashboard/workouts/components/customizations/EnhancedAvailableEquipmentCustomization.tsx`

```typescript
import { DetailedSelector } from '@/ui/shared/molecules';
import { Dumbbell } from 'lucide-react';
import { CustomizationComponentProps } from '../types';
import { useEnhancedOptions } from '../hooks/useEnhancedOptions';

export default function EnhancedAvailableEquipmentCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<string[] | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { equipmentOptions } = useEnhancedOptions();

  return (
    <DetailedSelector
      icon={Dumbbell}
      options={equipmentOptions}
      selectedValue={value?.[0] || undefined}
      onChange={(equipment) => onChange([equipment as string])}
      question="What equipment do you have available?"
      description="Choose the equipment you have available for your workout"
      disabled={disabled}
      error={error}
      gridCols={3}
      colorScheme="primary"
      required={true}
      variant={variant}
    />
  );
}
```

### Phase 3: Extract Mode-Specific Components

#### 3.1 Create Quick Mode Component

**File**: `src/modules/dashboard/workouts/components/modes/QuickWorkoutMode.tsx`

```typescript
import { Target } from 'lucide-react';
import { StepIndicator, ProgressBar, SimpleDetailedViewSelector } from '@/ui/shared/molecules';
import { ScrollTarget } from '@/ui/shared/atoms';
import { useQuickWorkoutProgress } from '../hooks/useQuickWorkoutProgress';
import { useFormAutoScroll } from '@/hooks';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import { FieldValidationMessage } from '../FieldValidationMessage';
import {
  EnhancedWorkoutFocusCustomization,
  EnhancedEnergyLevelCustomization,
  EnhancedWorkoutDurationCustomization,
  EnhancedAvailableEquipmentCustomization,
} from '../customizations';
import type { PerWorkoutOptions } from '../types';

interface QuickWorkoutModeProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
  activeQuickStep: 'focus-energy' | 'duration-equipment';
  onQuickStepChange: (step: 'focus-energy' | 'duration-equipment') => void;
  viewMode: 'simple' | 'detailed';
  onViewModeChange: (mode: 'simple' | 'detailed') => void;
  autoScrollEnabled: boolean;
  onAutoScrollChange: (enabled: boolean) => void;
  getFieldValidationError: (field: keyof PerWorkoutOptions) => string | undefined;
  getStepValidationError: (step: string) => string | undefined;
  handleStepClick: (stepId: string) => void;
}

export default function QuickWorkoutMode({
  options,
  onChange,
  errors,
  disabled = false,
  activeQuickStep,
  onQuickStepChange,
  viewMode,
  onViewModeChange,
  autoScrollEnabled,
  onAutoScrollChange,
  getFieldValidationError,
  getStepValidationError,
  handleStepClick,
}: QuickWorkoutModeProps) {
  const quickProgress = useQuickWorkoutProgress(options);

  // Auto-scroll configuration
  const { registerScrollTarget, handleFieldSelection } = useFormAutoScroll({
    formId: 'workout-customization',
    steps: [
      {
        id: 'focus-energy',
        label: 'Focus & Energy',
        fields: [CUSTOMIZATION_FIELD_KEYS.FOCUS, CUSTOMIZATION_FIELD_KEYS.ENERGY],
        scrollTarget: 'focus-question',
      },
      {
        id: 'duration-equipment',
        label: 'Duration & Equipment',
        fields: [CUSTOMIZATION_FIELD_KEYS.DURATION, CUSTOMIZATION_FIELD_KEYS.EQUIPMENT],
        scrollTarget: 'duration-question',
      },
    ],
    currentStepId: activeQuickStep,
    setCurrentStep: onQuickStepChange,
    isStepComplete: (stepId, formData) => {
      if (stepId === 'focus-energy') {
        return !!(formData.customization_focus && formData.customization_energy);
      } else if (stepId === 'duration-equipment') {
        return !!(
          formData.customization_duration &&
          Array.isArray(formData.customization_equipment) &&
          formData.customization_equipment.length > 0
        );
      }
      return false;
    },
  });

  const handleSelectionWithAutoScroll = (
    key: keyof PerWorkoutOptions,
    value: unknown
  ) => {
    handleFieldSelection(
      key as string,
      value,
      options,
      (fieldId: string, value: unknown) => {
        onChange(fieldId as keyof PerWorkoutOptions, value);
      }
    );
  };

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
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3 py-2">
              <input
                type="checkbox"
                className="toggle toggle-primary toggle-sm"
                checked={autoScrollEnabled}
                onChange={(e) => onAutoScrollChange(e.target.checked)}
              />
              <span className="label-text text-sm">Auto-advance</span>
            </label>
          </div>
        </div>

        <SimpleDetailedViewSelector
          value={viewMode}
          onChange={onViewModeChange}
          size="sm"
          labels={{ simple: 'Simple', detailed: 'Detailed' }}
        />
      </div>

      {/* Progress Bar */}
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

      {/* Step Indicator */}
      <StepIndicator
        steps={[
          {
            id: 'focus-energy',
            label: 'Focus & Energy',
            disabled: false,
            hasErrors: !!getStepValidationError('focus-energy'),
          },
          {
            id: 'duration-equipment',
            label: 'Duration & Equipment',
            disabled: false,
            hasErrors: !!getStepValidationError('duration-equipment'),
          },
        ]}
        currentStep={activeQuickStep}
        onStepClick={handleStepClick}
        disabled={disabled}
        showConnectors={true}
        size="md"
      />

      {/* Workout Structure Section */}
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

      {/* Step Content */}
      {activeQuickStep === 'focus-energy' && (
        <div className="space-y-8">
          <ScrollTarget
            targetId="focus-question"
            registerScrollTarget={registerScrollTarget}
            className="scroll-mt-4"
          >
            <EnhancedWorkoutFocusCustomization
              value={options.customization_focus}
              onChange={(focus) =>
                handleSelectionWithAutoScroll(CUSTOMIZATION_FIELD_KEYS.FOCUS, focus)
              }
              disabled={disabled}
              error={undefined}
              variant={viewMode}
            />
          </ScrollTarget>

          <FieldValidationMessage
            field={CUSTOMIZATION_FIELD_KEYS.FOCUS}
            getFieldValidationError={getFieldValidationError}
          />

          <ScrollTarget
            targetId="focus-energy-customization_energy"
            registerScrollTarget={registerScrollTarget}
            className="scroll-mt-4"
          >
            <EnhancedEnergyLevelCustomization
              value={options.customization_energy}
              onChange={(energy) =>
                handleSelectionWithAutoScroll(CUSTOMIZATION_FIELD_KEYS.ENERGY, energy)
              }
              disabled={disabled}
              error={undefined}
              variant={viewMode}
            />
          </ScrollTarget>

          <FieldValidationMessage
            field={CUSTOMIZATION_FIELD_KEYS.ENERGY}
            getFieldValidationError={getFieldValidationError}
          />
        </div>
      )}

      {activeQuickStep === 'duration-equipment' && (
        <div className="space-y-8">
          <ScrollTarget
            targetId="duration-question"
            registerScrollTarget={registerScrollTarget}
            className="scroll-mt-4"
          >
            <EnhancedWorkoutDurationCustomization
              value={options.customization_duration}
              onChange={(duration) =>
                handleSelectionWithAutoScroll(CUSTOMIZATION_FIELD_KEYS.DURATION, duration)
              }
              disabled={disabled}
              error={undefined}
              variant={viewMode}
            />
          </ScrollTarget>

          <FieldValidationMessage
            field={CUSTOMIZATION_FIELD_KEYS.DURATION}
            getFieldValidationError={getFieldValidationError}
          />

          <ScrollTarget
            targetId="duration-equipment-customization_equipment"
            registerScrollTarget={registerScrollTarget}
            className="scroll-mt-4"
          >
            <EnhancedAvailableEquipmentCustomization
              value={options.customization_equipment}
              onChange={(equipment) =>
                handleSelectionWithAutoScroll(CUSTOMIZATION_FIELD_KEYS.EQUIPMENT, equipment)
              }
              disabled={disabled}
              error={undefined}
              variant={viewMode}
            />
          </ScrollTarget>

          <FieldValidationMessage
            field={CUSTOMIZATION_FIELD_KEYS.EQUIPMENT}
            getFieldValidationError={getFieldValidationError}
          />
        </div>
      )}
    </div>
  );
}
```

#### 3.2 Create Detailed Mode Component

**File**: `src/modules/dashboard/workouts/components/modes/DetailedWorkoutMode.tsx`

```typescript
import { Target } from 'lucide-react';
import { StepIndicator, ProgressBar, SimpleDetailedViewSelector } from '@/ui/shared/molecules';
import { useDetailedWorkoutSteps } from '../hooks/useDetailedWorkoutSteps';
import {
  WorkoutStructureStep,
  EquipmentPreferencesStep,
  CurrentStateStep,
} from '../steps';
import type { PerWorkoutOptions } from '../types';

interface DetailedWorkoutModeProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
  viewMode: 'simple' | 'detailed';
  onViewModeChange: (mode: 'simple' | 'detailed') => void;
}

export default function DetailedWorkoutMode({
  options,
  onChange,
  errors,
  disabled = false,
  viewMode,
  onViewModeChange,
}: DetailedWorkoutModeProps) {
  const detailedSteps = useDetailedWorkoutSteps(options, 'workout-structure');

  return (
    <div className="mb-6" data-testid="detailed-workout-container">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center flex-wrap gap-2">
          <Target className="w-5 h-5" />
          <span>Detailed Workout Setup</span>
          <span className="text-sm font-normal text-base-content/70">
            (all optional)
          </span>
        </h3>

        {/* View Mode Toggle */}
        <div className="mb-4 flex justify-end">
          <SimpleDetailedViewSelector
            value={viewMode}
            onChange={onViewModeChange}
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
            hasErrors: false,
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
            Step {detailedSteps.currentStepIndex + 1} of {detailedSteps.totalSteps}
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
```

### Phase 4: Update Step Components to Use Enhanced Selectors

#### 4.1 Update WorkoutStructureStep

**File**: `src/modules/dashboard/workouts/components/steps/WorkoutStructureStep.tsx`

```typescript
import React from 'react';
import { CUSTOMIZATION_CONFIG } from '../customizations';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { SelectionBadge } from '@/ui/shared/atoms';
import {
  EnhancedWorkoutFocusCustomization,
  EnhancedEnergyLevelCustomization,
  EnhancedWorkoutDurationCustomization,
} from '../customizations';

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
  // Get components for this step
  const stepConfigs = CUSTOMIZATION_CONFIG.filter((config) =>
    [
      CUSTOMIZATION_FIELD_KEYS.DURATION,
      CUSTOMIZATION_FIELD_KEYS.FOCUS,
      CUSTOMIZATION_FIELD_KEYS.AREAS,
    ].includes(config.key)
  );

  const formatCurrentSelection = (
    config: (typeof CUSTOMIZATION_CONFIG)[0],
    value: unknown
  ): string | null => {
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

      case CUSTOMIZATION_FIELD_KEYS.FOCUS: {
        const focus = value as string;
        return focus
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }

      default:
        return String(value);
    }
  };

  return (
    <div className="space-y-8" data-testid="workout-structure-step">
      {/* Step Header */}
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
        {/* Focus Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-medium text-base-content">Workout Focus</h4>
              <p className="text-sm text-base-content/70">
                What's your main goal for this workout?
              </p>
            </div>
            <SelectionBadge
              value={formatCurrentSelection(
                { key: CUSTOMIZATION_FIELD_KEYS.FOCUS } as any,
                options.customization_focus
              )}
              size="sm"
            />
          </div>

          <EnhancedWorkoutFocusCustomization
            value={options.customization_focus}
            onChange={(focus) => onChange(CUSTOMIZATION_FIELD_KEYS.FOCUS, focus)}
            disabled={disabled}
            error={errors.customization_focus}
            variant={variant}
          />
        </div>

        {/* Energy Level Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-medium text-base-content">Energy Level</h4>
              <p className="text-sm text-base-content/70">
                How energetic are you feeling today?
              </p>
            </div>
            <SelectionBadge
              value={formatCurrentSelection(
                { key: CUSTOMIZATION_FIELD_KEYS.ENERGY } as any,
                options.customization_energy
              )}
              size="sm"
            />
          </div>

          <EnhancedEnergyLevelCustomization
            value={options.customization_energy}
            onChange={(energy) => onChange(CUSTOMIZATION_FIELD_KEYS.ENERGY, energy)}
            disabled={disabled}
            error={errors.customization_energy}
            variant={variant}
          />
        </div>

        {/* Duration Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-medium text-base-content">Workout Duration</h4>
              <p className="text-sm text-base-content/70">
                Choose how long you want your workout to be
              </p>
            </div>
            <SelectionBadge
              value={formatCurrentSelection(
                { key: CUSTOMIZATION_FIELD_KEYS.DURATION } as any,
                options.customization_duration
              )}
              size="sm"
            />
          </div>

          <EnhancedWorkoutDurationCustomization
            value={options.customization_duration}
            onChange={(duration) => onChange(CUSTOMIZATION_FIELD_KEYS.DURATION, duration)}
            disabled={disabled}
            error={errors.customization_duration}
            variant={variant}
          />
        </div>
      </div>
    </div>
  );
};
```

### Phase 5: Refactor Main WorkoutCustomization Component

#### 5.1 Simplified Main Component

**File**: `src/modules/dashboard/workouts/components/WorkoutCustomization.tsx` (Refactored)

```typescript
import { useState, useRef, useEffect } from 'react';
import { WorkoutCustomizationProps } from './types';
import { useAutoScrollPreferences } from '@/hooks';
import QuickWorkoutMode from './modes/QuickWorkoutMode';
import DetailedWorkoutMode from './modes/DetailedWorkoutMode';
import { useToast } from '@/hooks';

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
  const [internalActiveQuickStep, setInternalActiveQuickStep] = useState<
    'focus-energy' | 'duration-equipment'
  >('focus-energy');
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('detailed');

  // Use global auto-scroll preferences
  const { enabled: autoScrollEnabled, setEnabled: setAutoScrollEnabled } =
    useAutoScrollPreferences();

  // Use external step state if provided, otherwise use internal state
  const currentStep = activeQuickStep || internalActiveQuickStep;
  const setCurrentStep = onQuickStepChange || setInternalActiveQuickStep;

  // Ref for the component container
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when step changes
  useEffect(() => {
    const element = containerRef.current;
    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [currentStep]);

  // Basic validation logic for individual fields
  const getFieldValidationError = (
    fieldKey: keyof WorkoutCustomizationProps['options']
  ) => {
    // ... existing validation logic (simplified)
    return undefined;
  };

  // Check if step has any validation errors for step indicator
  const getStepValidationError = (
    step: 'focus-energy' | 'duration-equipment'
  ) => {
    // ... existing step validation logic (simplified)
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

  // Render appropriate mode
  if (mode === 'quick') {
    return (
      <QuickWorkoutMode
        options={options}
        onChange={onChange}
        errors={errors}
        disabled={disabled}
        activeQuickStep={currentStep}
        onQuickStepChange={setCurrentStep}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        autoScrollEnabled={autoScrollEnabled}
        onAutoScrollChange={setAutoScrollEnabled}
        getFieldValidationError={getFieldValidationError}
        getStepValidationError={getStepValidationError}
        handleStepClick={handleStepClick}
      />
    );
  }

  if (mode === 'detailed') {
    return (
      <DetailedWorkoutMode
        options={options}
        onChange={onChange}
        errors={errors}
        disabled={disabled}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    );
  }

  // Fallback for unknown modes
  return null;
}
```

## 📊 Implementation Benefits

### Code Reduction

- **Main Component**: 939 → ~150 lines (84% reduction)
- **Eliminated Duplication**: ~400 lines of duplicated logic
- **Modular Structure**: Clear separation of concerns

### Maintainability Improvements

- **Single Responsibility**: Each component has one clear purpose
- **Reusable Components**: Enhanced selectors can be used anywhere
- **Consistent Patterns**: Unified selector experience across modes
- **Easier Testing**: Smaller, focused components

### User Experience Enhancements

- **Consistent Selectors**: Same card-based interface everywhere
- **Visual Indicators**: LevelDots and tertiary content in all modes
- **Unified Validation**: Consistent error handling patterns
- **Better Accessibility**: Standardized component patterns

## 🚀 Implementation Plan

### Phase 1: Foundation (Week 1)

1. Create option enhancement utilities
2. Create enhanced option hooks
3. Update constants and types

### Phase 2: Enhanced Components (Week 2)

1. Create enhanced customization components
2. Update step components to use enhanced selectors
3. Test enhanced components in isolation

### Phase 3: Mode Extraction (Week 3)

1. Extract QuickWorkoutMode component
2. Extract DetailedWorkoutMode component
3. Update main WorkoutCustomization component

### Phase 4: Integration & Testing (Week 4)

1. Integration testing across all modes
2. Performance optimization
3. Documentation updates

## 🎯 Success Metrics

### Code Quality

- **File Size Reduction**: 939 → 150 lines (84% reduction)
- **Duplication Elimination**: 400+ lines of duplicated logic removed
- **Component Reusability**: Enhanced selectors used across modes

### User Experience

- **Consistent Interface**: Same selector patterns everywhere
- **Visual Continuity**: LevelDots and tertiary content in all modes
- **Performance**: Faster rendering with optimized components

### Maintainability

- **Single Responsibility**: Each component has clear purpose
- **Easy Testing**: Smaller, focused components
- **Future-Proof**: Modular structure supports easy extensions

## 🔧 Technical Considerations

### Backward Compatibility

- **API Preservation**: All existing props and interfaces maintained
- **Behavior Consistency**: Same functionality with improved implementation
- **Gradual Migration**: Can be implemented incrementally

### Performance Optimization

- **Memoization**: Enhanced options cached with useMemo
- **Lazy Loading**: Components loaded only when needed
- **Bundle Splitting**: Mode-specific code split appropriately

### Testing Strategy

- **Unit Tests**: Individual component testing
- **Integration Tests**: Mode interaction testing
- **Visual Regression**: UI consistency verification

This modularization plan provides a clear path to reduce the WorkoutCustomization.tsx file size while improving maintainability and creating consistent selector patterns across both Quick and Detailed modes.
