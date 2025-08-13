# Detailed Workout Setup Modularization Plan

## 📋 Executive Summary

The Detailed Workout Setup currently uses legacy customization components (simple buttons, rating circles) that provide an inconsistent user experience compared to the polished card-based selectors in Quick Workout Setup. This plan focuses specifically on updating the Detailed Workout Setup to use the same enhanced card-based selectors while following Feature First/Atomic Components architecture principles to improve maintainability without introducing unnecessary complexity.

## 🔍 Current State Analysis

### Current Detailed Workout Setup Architecture

**File Structure**:

```
src/modules/dashboard/workouts/components/
├── steps/                           # Step Components (139 lines each)
│   ├── WorkoutStructureStep.tsx     # Uses legacy components
│   ├── EquipmentPreferencesStep.tsx # Uses legacy components
│   └── CurrentStateStep.tsx         # Uses legacy components
├── customizations/                  # Legacy Components (72-103 lines each)
│   ├── WorkoutFocusCustomization.tsx      # Simple button grid
│   ├── EnergyLevelCustomization.tsx       # Rating buttons
│   ├── FocusAreaCustomization.tsx         # Checkbox grid
│   ├── SorenessCustomization.tsx          # Checkbox grid
│   ├── StressLevelCustomization.tsx       # Rating buttons
│   ├── SleepQualityCustomization.tsx      # Rating buttons
│   ├── WorkoutDurationCustomization.tsx   # Slider input
│   └── AvailableEquipmentCustomization.tsx # Checkbox grid
└── customizations/index.ts         # CUSTOMIZATION_CONFIG (109 lines)
```

### Issues with Current Implementation

#### 1. **Inconsistent User Experience**

- **Legacy Components**: Simple buttons, rating circles, checkbox grids
- **Quick Mode**: Enhanced card-based selectors with visual indicators
- **No Visual Continuity**: Missing LevelDots, tertiary content, consistent styling

#### 2. **UI Pattern Fragmentation**

```typescript
// Quick Mode (Enhanced)
<DetailedSelector
  icon={Target}
  options={FOCUS_OPTIONS_WITH_INTENSITY} // Enhanced with LevelDots
  variant={viewMode}
  gridCols={3}
/>

// Detailed Mode (Legacy)
<WorkoutFocusCustomization
  value={value}
  onChange={onChange}
  disabled={disabled}
  error={error}
/>
// Results in: Simple button grid, no visual indicators, inconsistent styling
```

#### 3. **Maintenance Complexity**

- **10 Legacy Components**: Each with custom UI patterns and logic
- **CUSTOMIZATION_CONFIG**: 109-line configuration mapping
- **Step Components**: Repetitive logic for rendering legacy components
- **No Reusability**: Components can't be used outside Detailed mode

### Specific Components Requiring Updates

#### **High Priority - Core Workflow Components**

1. **WorkoutFocusCustomization** (72 lines)
   - Current: Simple button grid with basic styling
   - Target: Card-based selector with intensity LevelDots

2. **EnergyLevelCustomization** (103 lines)
   - Current: Rating circles with manual styling
   - Target: Card-based selector with energy LevelDots

3. **WorkoutDurationCustomization** (~60 lines)
   - Current: Slider input
   - Target: Card-based selector with duration subtitles

4. **AvailableEquipmentCustomization** (~101 lines)
   - Current: Checkbox grid
   - Target: Card-based selector matching Quick mode

#### **Medium Priority - Wellness Components**

5. **SleepQualityCustomization** (~90 lines)
   - Current: Rating buttons
   - Target: Card-based selector with quality indicators

6. **StressLevelCustomization** (~104 lines)
   - Current: Rating buttons
   - Target: Card-based selector with stress level indicators

#### **Lower Priority - Preference Components**

7. **FocusAreaCustomization** (80 lines)
   - Current: Checkbox grid
   - Target: Card-based multi-selector

8. **SorenessCustomization** (~96 lines)
   - Current: Checkbox grid
   - Target: Card-based multi-selector for body areas

## 🎯 Focused Modularization Strategy

### Core Principle: **Leverage Existing Quick Mode Infrastructure**

Rather than creating entirely new components, we'll **reuse and extend** the existing Quick Workout Setup infrastructure to support Detailed mode fields.

### Phase 1: Extend Quick Mode Option Enhancers

#### 1.1 Enhance Existing Option Utilities

**File**: `src/modules/dashboard/workouts/components/utils/optionEnhancers.ts` (Extend Existing)

```typescript
// Add to existing file
import {
  FOCUS_AREA_OPTIONS,
  SLEEP_QUALITY_OPTIONS,
  STRESS_LEVEL_OPTIONS,
  SORENESS_AREA_OPTIONS,
} from '../../constants';

// Extend existing enhancers for Detailed mode fields
export const enhanceFocusAreaOptions = () => {
  return FOCUS_AREA_OPTIONS.map((option) => ({
    id: option.value,
    title: option.label,
    description: getAreaDescription(option.value),
    // No tertiary content needed for areas
  }));
};

export const enhanceSleepQualityOptions = () => {
  return SLEEP_QUALITY_OPTIONS.map((option) => ({
    id: option.value.toString(),
    title: option.label,
    description: option.description,
    tertiary: <LevelDots count={5} activeIndex={option.value - 1} size="sm" />,
  }));
};

export const enhanceStressLevelOptions = () => {
  return STRESS_LEVEL_OPTIONS.map((option) => ({
    id: option.value.toString(),
    title: option.label,
    description: option.description,
    tertiary: <LevelDots count={5} activeIndex={option.value - 1} size="sm" />,
  }));
};

export const enhanceSorenessAreaOptions = () => {
  return SORENESS_AREA_OPTIONS.map((option) => ({
    id: option.value,
    title: option.label,
    description: getAreaDescription(option.value),
    // No tertiary content for body areas
  }));
};

const getAreaDescription = (areaValue: string): string => {
  const descriptions = {
    upper_body: 'Chest, shoulders, arms, and back',
    lower_body: 'Legs, glutes, and calves',
    core: 'Abdominals and lower back',
    // ... other descriptions
  };
  return descriptions[areaValue] || '';
};
```

#### 1.2 Extend Enhanced Options Hook

**File**: `src/modules/dashboard/workouts/components/hooks/useEnhancedOptions.ts` (Extend Existing)

```typescript
// Add to existing hook
export const useEnhancedOptions = () => {
  return useMemo(
    () => ({
      // Existing Quick mode options
      focusOptions: enhanceFocusOptionsWithIntensity(),
      energyOptions: enhanceEnergyOptionsWithDots(),
      durationOptions: enhanceDurationOptionsWithSubtitles(),
      equipmentOptions: enhanceEquipmentOptions(),

      // New Detailed mode options
      focusAreaOptions: enhanceFocusAreaOptions(),
      sleepQualityOptions: enhanceSleepQualityOptions(),
      stressLevelOptions: enhanceStressLevelOptions(),
      sorenessAreaOptions: enhanceSorenessAreaOptions(),
    }),
    []
  );
};
```

### Phase 2: Create Enhanced Customization Components

Instead of replacing all 10 legacy components, we'll create **4 strategic enhanced components** that cover the most impactful user experience improvements.

#### 2.1 High-Impact Enhanced Components

**File**: `src/modules/dashboard/workouts/components/customizations/enhanced/EnhancedFocusAreaCustomization.tsx`

```typescript
import { DetailedSelector } from '@/ui/shared/molecules';
import { Target } from 'lucide-react';
import { CustomizationComponentProps } from '../../types';
import { useEnhancedOptions } from '../../hooks/useEnhancedOptions';

export default function EnhancedFocusAreaCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<string[] | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { focusAreaOptions } = useEnhancedOptions();

  return (
    <DetailedSelector
      icon={Target}
      options={focusAreaOptions}
      selectedValue={value || []}
      multiple={true}
      onChange={onChange}
      question="Which body areas do you want to focus on?"
      description="Select one or more areas to target in your workout"
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

**File**: `src/modules/dashboard/workouts/components/customizations/enhanced/EnhancedSleepQualityCustomization.tsx`

```typescript
import { DetailedSelector } from '@/ui/shared/molecules';
import { Moon } from 'lucide-react';
import { CustomizationComponentProps } from '../../types';
import { useEnhancedOptions } from '../../hooks/useEnhancedOptions';

export default function EnhancedSleepQualityCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<number | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { sleepQualityOptions } = useEnhancedOptions();

  return (
    <DetailedSelector
      icon={Moon}
      options={sleepQualityOptions}
      selectedValue={value?.toString() || undefined}
      onChange={(sleep) => onChange(parseInt(sleep as string, 10))}
      question="How well did you sleep last night?"
      description="Your sleep quality affects workout intensity recommendations"
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

**File**: `src/modules/dashboard/workouts/components/customizations/enhanced/EnhancedStressLevelCustomization.tsx`

```typescript
import { DetailedSelector } from '@/ui/shared/molecules';
import { Brain } from 'lucide-react';
import { CustomizationComponentProps } from '../../types';
import { useEnhancedOptions } from '../../hooks/useEnhancedOptions';

export default function EnhancedStressLevelCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<number | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { stressLevelOptions } = useEnhancedOptions();

  return (
    <DetailedSelector
      icon={Brain}
      options={stressLevelOptions}
      selectedValue={value?.toString() || undefined}
      onChange={(stress) => onChange(parseInt(stress as string, 10))}
      question="What's your current stress level?"
      description="We'll adjust the workout to help manage your stress"
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

**File**: `src/modules/dashboard/workouts/components/customizations/enhanced/EnhancedSorenessCustomization.tsx`

```typescript
import { DetailedSelector } from '@/ui/shared/molecules';
import { AlertTriangle } from 'lucide-react';
import { CustomizationComponentProps } from '../../types';
import { useEnhancedOptions } from '../../hooks/useEnhancedOptions';

export default function EnhancedSorenessCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<string[] | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { sorenessAreaOptions } = useEnhancedOptions();

  return (
    <DetailedSelector
      icon={AlertTriangle}
      options={sorenessAreaOptions}
      selectedValue={value || []}
      multiple={true}
      onChange={onChange}
      question="Are you experiencing any soreness?"
      description="We'll modify exercises to avoid aggravating sore areas"
      disabled={disabled}
      error={error}
      gridCols={3}
      colorScheme="warning"
      required={false}
      variant={variant}
    />
  );
}
```

#### 2.2 Create Enhanced Components Index

**File**: `src/modules/dashboard/workouts/components/customizations/enhanced/index.ts`

```typescript
// Re-export Quick mode components that are already enhanced
export {
  EnhancedWorkoutFocusCustomization,
  EnhancedEnergyLevelCustomization,
  EnhancedWorkoutDurationCustomization,
  EnhancedAvailableEquipmentCustomization,
} from '../../../quick-workout-setup-modularization-plan.md'; // From Phase 2 of Quick plan

// Export new Detailed mode enhanced components
export { default as EnhancedFocusAreaCustomization } from './EnhancedFocusAreaCustomization';
export { default as EnhancedSleepQualityCustomization } from './EnhancedSleepQualityCustomization';
export { default as EnhancedStressLevelCustomization } from './EnhancedStressLevelCustomization';
export { default as EnhancedSorenessCustomization } from './EnhancedSorenessCustomization';
```

### Phase 3: Update Step Components with Gradual Migration

#### 3.1 Enhanced Step Component Pattern

**File**: `src/modules/dashboard/workouts/components/steps/WorkoutStructureStep.tsx` (Updated)

```typescript
import React from 'react';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { SelectionBadge } from '@/ui/shared/atoms';
import {
  EnhancedWorkoutFocusCustomization,
  EnhancedEnergyLevelCustomization,
  EnhancedWorkoutDurationCustomization,
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
  const formatCurrentSelection = (
    fieldKey: keyof PerWorkoutOptions,
    value: unknown
  ): string | null => {
    // Existing formatting logic...
    return null;
  };

  return (
    <div className="space-y-8" data-testid="workout-structure-step">
      {/* Step Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-base-content mb-2">
          Workout Structure
        </h3>
        <p className="text-base-content/70">
          Define your workout's core parameters: duration, focus, and target areas.
        </p>
      </div>

      {/* Enhanced Customization Options */}
      <div className="space-y-8">
        {/* Duration Selection - Reuse from Quick mode */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-medium text-base-content">Workout Duration</h4>
              <p className="text-sm text-base-content/70">
                Choose how long you want your workout to be
              </p>
            </div>
            <SelectionBadge
              value={formatCurrentSelection(CUSTOMIZATION_FIELD_KEYS.DURATION, options.customization_duration)}
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

        {/* Focus Selection - Reuse from Quick mode */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-medium text-base-content">Workout Focus</h4>
              <p className="text-sm text-base-content/70">
                What's your main goal for this workout?
              </p>
            </div>
            <SelectionBadge
              value={formatCurrentSelection(CUSTOMIZATION_FIELD_KEYS.FOCUS, options.customization_focus)}
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

        {/* Focus Areas - NEW Enhanced Component */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-medium text-base-content">Target Areas</h4>
              <p className="text-sm text-base-content/70">
                Which body areas do you want to focus on?
              </p>
            </div>
            <SelectionBadge
              value={formatCurrentSelection(CUSTOMIZATION_FIELD_KEYS.AREAS, options.customization_areas)}
              size="sm"
            />
          </div>

          <EnhancedFocusAreaCustomization
            value={options.customization_areas}
            onChange={(areas) => onChange(CUSTOMIZATION_FIELD_KEYS.AREAS, areas)}
            disabled={disabled}
            error={errors.customization_areas}
            variant={variant}
          />
        </div>
      </div>
    </div>
  );
};
```

#### 3.2 Update CurrentStateStep with Enhanced Components

**File**: `src/modules/dashboard/workouts/components/steps/CurrentStateStep.tsx` (Updated)

```typescript
import React from 'react';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { SelectionBadge } from '@/ui/shared/atoms';
import {
  EnhancedEnergyLevelCustomization,
  EnhancedSleepQualityCustomization,
  EnhancedStressLevelCustomization,
  EnhancedSorenessCustomization,
} from '../customizations/enhanced';

export const CurrentStateStep: React.FC<CurrentStateStepProps> = ({
  options,
  onChange,
  errors,
  disabled = false,
  variant = 'detailed',
}) => {
  return (
    <div className="space-y-8" data-testid="current-state-step">
      {/* Step Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-base-content mb-2">
          Current State
        </h3>
        <p className="text-base-content/70">
          Help us understand your current physical and mental state.
        </p>
      </div>

      <div className="space-y-8">
        {/* Energy Level - Reuse from Quick mode */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-medium text-base-content">Energy Level</h4>
              <p className="text-sm text-base-content/70">
                How energetic are you feeling today?
              </p>
            </div>
            <SelectionBadge value={formatEnergyLevel(options.customization_energy)} size="sm" />
          </div>

          <EnhancedEnergyLevelCustomization
            value={options.customization_energy}
            onChange={(energy) => onChange(CUSTOMIZATION_FIELD_KEYS.ENERGY, energy)}
            disabled={disabled}
            error={errors.customization_energy}
            variant={variant}
          />
        </div>

        {/* Sleep Quality - NEW Enhanced Component */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-medium text-base-content">Sleep Quality</h4>
              <p className="text-sm text-base-content/70">
                How well did you sleep last night?
              </p>
            </div>
            <SelectionBadge value={formatSleepQuality(options.customization_sleep)} size="sm" />
          </div>

          <EnhancedSleepQualityCustomization
            value={options.customization_sleep}
            onChange={(sleep) => onChange(CUSTOMIZATION_FIELD_KEYS.SLEEP, sleep)}
            disabled={disabled}
            error={errors.customization_sleep}
            variant={variant}
          />
        </div>

        {/* Stress Level - NEW Enhanced Component */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-medium text-base-content">Stress Level</h4>
              <p className="text-sm text-base-content/70">
                What's your current stress level?
              </p>
            </div>
            <SelectionBadge value={formatStressLevel(options.customization_stress)} size="sm" />
          </div>

          <EnhancedStressLevelCustomization
            value={options.customization_stress}
            onChange={(stress) => onChange(CUSTOMIZATION_FIELD_KEYS.STRESS, stress)}
            disabled={disabled}
            error={errors.customization_stress}
            variant={variant}
          />
        </div>

        {/* Soreness - NEW Enhanced Component */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-medium text-base-content">Current Soreness</h4>
              <p className="text-sm text-base-content/70">
                Are you experiencing any soreness?
              </p>
            </div>
            <SelectionBadge value={formatSoreness(options.customization_soreness)} size="sm" />
          </div>

          <EnhancedSorenessCustomization
            value={options.customization_soreness}
            onChange={(soreness) => onChange(CUSTOMIZATION_FIELD_KEYS.SORENESS, soreness)}
            disabled={disabled}
            error={errors.customization_soreness}
            variant={variant}
          />
        </div>
      </div>
    </div>
  );
};
```

#### 3.3 Update EquipmentPreferencesStep with Mixed Approach

**File**: `src/modules/dashboard/workouts/components/steps/EquipmentPreferencesStep.tsx` (Updated)

```typescript
import React from 'react';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { SelectionBadge } from '@/ui/shared/atoms';
import { EnhancedAvailableEquipmentCustomization } from '../customizations/enhanced';
// Keep legacy components for text input fields
import { IncludeExercisesCustomization, ExcludeExercisesCustomization } from '../customizations';

export const EquipmentPreferencesStep: React.FC<EquipmentPreferencesStepProps> = ({
  options,
  onChange,
  errors,
  disabled = false,
  variant = 'detailed',
}) => {
  return (
    <div className="space-y-8" data-testid="equipment-preferences-step">
      {/* Step Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-base-content mb-2">
          Equipment & Preferences
        </h3>
        <p className="text-base-content/70">
          Tell us about your available equipment and exercise preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Equipment - Enhanced Component */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-medium text-base-content">Available Equipment</h4>
              <p className="text-sm text-base-content/70">
                What equipment do you have available?
              </p>
            </div>
            <SelectionBadge value={formatEquipment(options.customization_equipment)} size="sm" />
          </div>

          <EnhancedAvailableEquipmentCustomization
            value={options.customization_equipment}
            onChange={(equipment) => onChange(CUSTOMIZATION_FIELD_KEYS.EQUIPMENT, equipment)}
            disabled={disabled}
            error={errors.customization_equipment}
            variant={variant}
          />
        </div>

        {/* Include Exercises - Keep Legacy (Text Input) */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-medium text-base-content">Include Exercises</h4>
              <p className="text-sm text-base-content/70">
                Specify exercises you want in your workout
              </p>
            </div>
            <SelectionBadge value={formatIncludeExercises(options.customization_include)} size="sm" />
          </div>

          <IncludeExercisesCustomization
            value={options.customization_include}
            onChange={(include) => onChange(CUSTOMIZATION_FIELD_KEYS.INCLUDE, include)}
            disabled={disabled}
            error={errors.customization_include}
          />
        </div>

        {/* Exclude Exercises - Keep Legacy (Text Input) */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-medium text-base-content">Exclude Exercises</h4>
              <p className="text-sm text-base-content/70">
                Specify exercises you want to avoid
              </p>
            </div>
            <SelectionBadge value={formatExcludeExercises(options.customization_exclude)} size="sm" />
          </div>

          <ExcludeExercisesCustomization
            value={options.customization_exclude}
            onChange={(exclude) => onChange(CUSTOMIZATION_FIELD_KEYS.EXCLUDE, exclude)}
            disabled={disabled}
            error={errors.customization_exclude}
          />
        </div>
      </div>
    </div>
  );
};
```

### Phase 4: Constants and Options Integration

#### 4.1 Add Missing Constants

**File**: `src/modules/dashboard/workouts/constants.ts` (Extend Existing)

```typescript
// Add to existing constants file
export interface FocusAreaOption {
  value: string;
  label: string;
}

export interface SleepQualityOption {
  value: number;
  label: string;
  description: string;
}

export interface StressLevelOption {
  value: number;
  label: string;
  description: string;
}

export interface SorenessAreaOption {
  value: string;
  label: string;
}

// Focus area options for detailed setup
export const FOCUS_AREA_OPTIONS: FocusAreaOption[] = [
  { value: 'upper_body', label: 'Upper Body' },
  { value: 'lower_body', label: 'Lower Body' },
  { value: 'core', label: 'Core' },
  { value: 'back', label: 'Back' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'chest', label: 'Chest' },
  { value: 'arms', label: 'Arms' },
  { value: 'mobility_flexibility', label: 'Mobility/Flexibility' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'recovery_stretching', label: 'Recovery/Stretching' },
];

// Sleep quality options (1-5 scale)
export const SLEEP_QUALITY_OPTIONS: SleepQualityOption[] = [
  { value: 1, label: 'Very Poor', description: 'Barely slept, very tired' },
  { value: 2, label: 'Poor', description: 'Restless sleep, feeling tired' },
  { value: 3, label: 'Fair', description: 'Decent sleep, somewhat rested' },
  { value: 4, label: 'Good', description: 'Solid sleep, feeling rested' },
  {
    value: 5,
    label: 'Excellent',
    description: 'Perfect sleep, fully refreshed',
  },
];

// Stress level options (1-5 scale)
export const STRESS_LEVEL_OPTIONS: StressLevelOption[] = [
  { value: 1, label: 'Very Low', description: 'Calm and relaxed' },
  { value: 2, label: 'Low', description: 'Mostly relaxed with minor concerns' },
  { value: 3, label: 'Moderate', description: 'Some stress, manageable' },
  { value: 4, label: 'High', description: 'Feeling stressed and tense' },
  {
    value: 5,
    label: 'Very High',
    description: 'Extremely stressed and overwhelmed',
  },
];

// Soreness area options
export const SORENESS_AREA_OPTIONS: SorenessAreaOption[] = [
  { value: 'neck_shoulders', label: 'Neck & Shoulders' },
  { value: 'upper_back', label: 'Upper Back' },
  { value: 'lower_back', label: 'Lower Back' },
  { value: 'chest', label: 'Chest' },
  { value: 'arms', label: 'Arms' },
  { value: 'core', label: 'Core' },
  { value: 'glutes', label: 'Glutes' },
  { value: 'quads', label: 'Quadriceps' },
  { value: 'hamstrings', label: 'Hamstrings' },
  { value: 'calves', label: 'Calves' },
];
```

## 📊 Implementation Benefits

### User Experience Improvements

- **Visual Consistency**: Same card-based selectors across Quick and Detailed modes
- **Enhanced Visual Feedback**: LevelDots for ratings, consistent styling
- **Better Information Hierarchy**: Clear questions, descriptions, and tertiary content
- **Improved Accessibility**: Standardized component patterns

### Code Quality Improvements

- **Reduced Duplication**: Reuse Quick mode infrastructure
- **Consistent Patterns**: Same DetailedSelector component throughout
- **Better Maintainability**: Fewer custom components to maintain
- **Enhanced Reusability**: Components can be used in other contexts

### Development Efficiency

- **Minimal New Code**: Only 4 new enhanced components vs 10 legacy ones
- **Leverage Existing Work**: Reuse Quick mode option enhancers and hooks
- **Gradual Migration**: Update step-by-step without breaking changes
- **Future-Proof**: Easy to add new fields using same patterns

## 🚀 Implementation Timeline

### Week 1: Foundation

- [ ] Extend option enhancers for Detailed mode fields
- [ ] Add missing constants for new field types
- [ ] Update `useEnhancedOptions` hook

### Week 2: Enhanced Components

- [ ] Create 4 enhanced customization components
- [ ] Test components in isolation
- [ ] Create enhanced components index

### Week 3: Step Integration

- [ ] Update WorkoutStructureStep with enhanced components
- [ ] Update CurrentStateStep with enhanced components
- [ ] Update EquipmentPreferencesStep with mixed approach

### Week 4: Testing & Polish

- [ ] Integration testing across all steps
- [ ] Visual regression testing
- [ ] Performance optimization

## 🎯 Success Metrics

### User Experience

- **Visual Consistency**: 100% of core workflow fields use card-based selectors
- **Enhanced Feedback**: LevelDots and tertiary content in all rating fields
- **Reduced Cognitive Load**: Consistent interaction patterns

### Code Quality

- **Component Reduction**: 10 legacy components → 4 enhanced components
- **Code Reuse**: 80% reuse of Quick mode infrastructure
- **Maintainability**: Single component pattern for all selectors

### Performance

- **Bundle Size**: Minimal increase due to code reuse
- **Render Performance**: Improved with optimized components
- **Development Speed**: Faster future feature development

## 🔧 Technical Considerations

### Backward Compatibility

- **Gradual Migration**: Update components step-by-step
- **API Preservation**: All existing props and interfaces maintained
- **Fallback Support**: Keep legacy components for text inputs

### Feature First Architecture

- **Atomic Components**: Reuse existing DetailedSelector
- **Feature Separation**: Enhanced components in dedicated directory
- **Clear Boundaries**: Step components own their specific logic

### Performance Optimization

- **Memoization**: Enhanced options cached with useMemo
- **Lazy Loading**: Components loaded only when needed
- **Code Splitting**: Leverage existing patterns

This focused plan provides a clean path to enhance the Detailed Workout Setup with card-based selectors while maintaining architectural simplicity and avoiding unnecessary complexity.
