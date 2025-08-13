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

## 📊 Success Metrics

### User Experience

- **Visual Consistency**: 100% of core workflow fields use card-based selectors
- **Enhanced Feedback**: LevelDots and tertiary content in all rating fields
- **Task Completion**: 95% success rate
- **Time to Complete**: < 3 minutes for full detailed setup

### Code Quality

- **Component Reduction**: 10 legacy components → 4 enhanced components
- **Code Reuse**: 80% reuse of Quick mode infrastructure
- **Type Coverage**: 100% of new code
- **Test Coverage**: 90% of enhanced components

### Performance

- **Initial Render**: < 100ms for step components
- **Selection Response**: < 50ms for user interactions
- **Memory Usage**: < 5MB for enhanced components
- **Bundle Size**: Minimal increase due to code reuse

## 🚀 Implementation Plan

### Phase 1: Foundation & Utilities

#### 1.1 Create Unified Selection Formatters

**File**: `src/modules/dashboard/workouts/utils/selectionFormatters.ts` (New)

```typescript
import { CUSTOMIZATION_FIELD_KEYS } from '../constants/fieldKeys';

export const formatSelectionValue = (
  fieldKey: string,
  value: unknown
): string | null => {
  const formatters: Record<string, (val: any) => string> = {
    [CUSTOMIZATION_FIELD_KEYS.DURATION]: (val) => {
      const duration = Number(val);
      if (duration >= 60) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return minutes
          ? `${hours}h ${minutes}m`
          : `${hours} hour${hours > 1 ? 's' : ''}`;
      }
      return `${duration} min`;
    },
    [CUSTOMIZATION_FIELD_KEYS.ENERGY]: (val) => {
      const labels = ['', 'Very Low', 'Low', 'Moderate', 'High', 'Very High'];
      return `${labels[val]} (${val}/5)`;
    },
    [CUSTOMIZATION_FIELD_KEYS.SLEEP]: (val) => {
      const labels = ['', 'Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'];
      return labels[val];
    },
    [CUSTOMIZATION_FIELD_KEYS.STRESS]: (val) => {
      const labels = ['', 'Very Low', 'Low', 'Moderate', 'High', 'Very High'];
      return labels[val];
    },
    [CUSTOMIZATION_FIELD_KEYS.AREAS]: (val) => {
      const areas = val as string[];
      if (!areas?.length) return null;
      if (areas.length === 1)
        return areas[0]
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
      return `${areas.length} areas selected`;
    },
    [CUSTOMIZATION_FIELD_KEYS.SORENESS]: (val) => {
      const areas = val as string[];
      if (!areas?.length) return 'None';
      if (areas.length === 1)
        return areas[0]
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
      return `${areas.length} areas`;
    },
    [CUSTOMIZATION_FIELD_KEYS.FOCUS]: (val) => {
      return String(val)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
    },
    [CUSTOMIZATION_FIELD_KEYS.EQUIPMENT]: (val) => {
      const equipment = val as string[];
      if (!equipment?.length) return null;
      if (equipment.length === 1)
        return equipment[0]
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
      return `${equipment.length} items`;
    },
  };

  const formatter = formatters[fieldKey];
  return formatter && value != null ? formatter(value) : null;
};
```

#### 1.2 Enhanced Option Utilities with Performance Optimization

**File**: `src/modules/dashboard/workouts/components/utils/optionEnhancers.ts` (Extend Existing)

```typescript
import { memo, useMemo } from 'react';
import { LevelDots } from '@/ui/shared/atoms';
import {
  FOCUS_AREA_OPTIONS,
  SLEEP_QUALITY_OPTIONS,
  STRESS_LEVEL_OPTIONS,
  SORENESS_AREA_OPTIONS,
} from '../../constants';

// Performance optimization: Cache expensive option transformations
const enhancedOptionsCache = new Map();

export const getCachedEnhancedOptions = (key: string, enhancer: () => any) => {
  if (!enhancedOptionsCache.has(key)) {
    enhancedOptionsCache.set(key, enhancer());
  }
  return enhancedOptionsCache.get(key);
};

// Extend existing enhancers for Detailed mode fields
export const enhanceFocusAreaOptions = () => {
  return getCachedEnhancedOptions('focusAreas', () =>
    FOCUS_AREA_OPTIONS.map((option) => ({
      id: option.value,
      title: option.label,
      description: getAreaDescription(option.value),
      // No tertiary content needed for areas
    }))
  );
};

export const enhanceSleepQualityOptions = () => {
  return getCachedEnhancedOptions('sleepQuality', () =>
    SLEEP_QUALITY_OPTIONS.map((option) => ({
      id: option.value.toString(),
      title: option.label,
      description: option.description,
      tertiary: <LevelDots count={5} activeIndex={option.value - 1} size="sm" />,
    }))
  );
};

export const enhanceStressLevelOptions = () => {
  return getCachedEnhancedOptions('stressLevel', () =>
    STRESS_LEVEL_OPTIONS.map((option) => ({
      id: option.value.toString(),
      title: option.label,
      description: option.description,
      tertiary: <LevelDots count={5} activeIndex={option.value - 1} size="sm" />,
    }))
  );
};

export const enhanceSorenessAreaOptions = () => {
  return getCachedEnhancedOptions('sorenessAreas', () =>
    SORENESS_AREA_OPTIONS.map((option) => ({
      id: option.value,
      title: option.label,
      description: getAreaDescription(option.value),
      // No tertiary content for body areas
    }))
  );
};

const getAreaDescription = (areaValue: string): string => {
  const descriptions: Record<string, string> = {
    // Focus areas
    upper_body: 'Chest, shoulders, arms, and back',
    lower_body: 'Legs, glutes, and calves',
    core: 'Abdominals and lower back',
    back: 'Upper and lower back muscles',
    shoulders: 'Deltoids and rotator cuff',
    chest: 'Pectorals and surrounding muscles',
    arms: 'Biceps, triceps, and forearms',
    mobility_flexibility: 'Joint mobility and muscle flexibility',
    cardio: 'Cardiovascular endurance',
    recovery_stretching: 'Gentle recovery and stretching',

    // Soreness areas
    neck_shoulders: 'Neck and shoulder region',
    upper_back: 'Upper back and trapezius',
    lower_back: 'Lower back and lumbar region',
    glutes: 'Gluteal muscles',
    quads: 'Front of thighs',
    hamstrings: 'Back of thighs',
    calves: 'Lower leg muscles',
  };
  return descriptions[areaValue] || '';
};
```

#### 1.3 Extend Enhanced Options Hook

**File**: `src/modules/dashboard/workouts/components/hooks/useEnhancedOptions.ts` (Extend Existing)

```typescript
import { useMemo } from 'react';
import {
  enhanceFocusOptionsWithIntensity,
  enhanceEnergyOptionsWithDots,
  enhanceDurationOptionsWithSubtitles,
  enhanceEquipmentOptions,
  enhanceFocusAreaOptions,
  enhanceSleepQualityOptions,
  enhanceStressLevelOptions,
  enhanceSorenessAreaOptions,
} from '../utils/optionEnhancers';

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

#### 1.4 TypeScript Improvements

**File**: `src/modules/dashboard/workouts/types/detailedOptions.ts` (New)

```typescript
// Strengthen type safety with discriminated unions
export type DetailedWorkoutField =
  | { type: 'rating'; key: 'sleep' | 'stress'; value: 1 | 2 | 3 | 4 | 5 }
  | { type: 'multi-select'; key: 'areas' | 'soreness'; value: string[] }
  | { type: 'single-select'; key: 'focus' | 'equipment'; value: string }
  | { type: 'duration'; key: 'duration'; value: number }
  | { type: 'text'; key: 'include' | 'exclude'; value: string };

// Type guard functions
export const isRatingField = (
  field: DetailedWorkoutField
): field is Extract<DetailedWorkoutField, { type: 'rating' }> =>
  field.type === 'rating';

export const isMultiSelectField = (
  field: DetailedWorkoutField
): field is Extract<DetailedWorkoutField, { type: 'multi-select' }> =>
  field.type === 'multi-select';

export const isSingleSelectField = (
  field: DetailedWorkoutField
): field is Extract<DetailedWorkoutField, { type: 'single-select' }> =>
  field.type === 'single-select';

export const isDurationField = (
  field: DetailedWorkoutField
): field is Extract<DetailedWorkoutField, { type: 'duration' }> =>
  field.type === 'duration';

export const isTextField = (
  field: DetailedWorkoutField
): field is Extract<DetailedWorkoutField, { type: 'text' }> =>
  field.type === 'text';
```

### Phase 2: Enhanced Validation System

#### 2.1 Detailed Mode Validation

**File**: `src/modules/dashboard/workouts/validation/detailedValidation.ts` (New)

```typescript
import { PerWorkoutOptions } from '../components/types';

export const DETAILED_VALIDATION_MESSAGES = {
  // Wellness validations
  SLEEP_REQUIRED: 'Please rate your sleep quality',
  STRESS_REQUIRED: 'Please indicate your stress level',

  // Range validations
  SLEEP_RANGE: 'Sleep quality must be between 1 and 5',
  STRESS_RANGE: 'Stress level must be between 1 and 5',

  // Area validations
  AREAS_MAX: 'Select up to 5 focus areas',
  SORENESS_MAX: 'Select up to 5 soreness areas',
} as const;

export const validateDetailedStep = (
  step: 'structure' | 'equipment' | 'current-state',
  options: PerWorkoutOptions
): Partial<Record<keyof PerWorkoutOptions, string>> => {
  const errors: Partial<Record<keyof PerWorkoutOptions, string>> = {};

  if (step === 'current-state') {
    // Progressive validation - only show errors if other fields in group are selected
    const hasAnyWellnessSelection =
      options.customization_energy ||
      options.customization_sleep ||
      options.customization_stress;

    if (hasAnyWellnessSelection) {
      // Validate sleep if wellness group has selections
      if (!options.customization_sleep) {
        errors.customization_sleep =
          DETAILED_VALIDATION_MESSAGES.SLEEP_REQUIRED;
      } else if (
        options.customization_sleep < 1 ||
        options.customization_sleep > 5
      ) {
        errors.customization_sleep = DETAILED_VALIDATION_MESSAGES.SLEEP_RANGE;
      }

      // Validate stress if wellness group has selections
      if (!options.customization_stress) {
        errors.customization_stress =
          DETAILED_VALIDATION_MESSAGES.STRESS_REQUIRED;
      } else if (
        options.customization_stress < 1 ||
        options.customization_stress > 5
      ) {
        errors.customization_stress = DETAILED_VALIDATION_MESSAGES.STRESS_RANGE;
      }
    }
  }

  if (step === 'structure') {
    // Validate area selections
    if (options.customization_areas && options.customization_areas.length > 5) {
      errors.customization_areas = DETAILED_VALIDATION_MESSAGES.AREAS_MAX;
    }
  }

  // Validate soreness areas across all steps
  if (
    options.customization_soreness &&
    options.customization_soreness.length > 5
  ) {
    errors.customization_soreness = DETAILED_VALIDATION_MESSAGES.SORENESS_MAX;
  }

  return errors;
};
```

### Phase 3: Analytics Integration

#### 3.1 Workout Analytics Hook

**File**: `src/modules/dashboard/workouts/hooks/useWorkoutAnalytics.ts` (New)

```typescript
import { useCallback } from 'react';
import { analytics } from '@/services/analytics';

export const useWorkoutAnalytics = () => {
  const trackSelection = useCallback(
    (fieldKey: string, value: unknown, mode: 'quick' | 'detailed') => {
      // Track user selections for AI learning
      analytics.track('workout_field_selected', {
        field: fieldKey,
        value: Array.isArray(value) ? value.length : value,
        valueType: Array.isArray(value) ? 'multi-select' : typeof value,
        mode,
        timestamp: Date.now(),
      });
    },
    []
  );

  const trackStepCompletion = useCallback(
    (
      step: string,
      duration: number,
      mode: 'quick' | 'detailed',
      completionRate: number
    ) => {
      analytics.track('workout_step_completed', {
        step,
        duration,
        mode,
        completionRate,
        timestamp: Date.now(),
      });
    },
    []
  );

  const trackValidationError = useCallback(
    (fieldKey: string, errorMessage: string, mode: 'quick' | 'detailed') => {
      analytics.track('workout_validation_error', {
        field: fieldKey,
        error: errorMessage,
        mode,
        timestamp: Date.now(),
      });
    },
    []
  );

  return {
    trackSelection,
    trackStepCompletion,
    trackValidationError,
  };
};
```

### Phase 4: Enhanced Customization Components

#### 4.1 Enhanced Focus Area Component

**File**: `src/modules/dashboard/workouts/components/customizations/enhanced/EnhancedFocusAreaCustomization.tsx`

```typescript
import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { Target } from 'lucide-react';
import { CustomizationComponentProps } from '../../types';
import { useEnhancedOptions } from '../../hooks/useEnhancedOptions';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';

export default memo(function EnhancedFocusAreaCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<string[] | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { focusAreaOptions } = useEnhancedOptions();
  const { trackSelection } = useWorkoutAnalytics();

  const handleChange = (newValue: string | string[]) => {
    onChange(newValue);
    trackSelection('customization_areas', newValue, 'detailed');
  };

  return (
    <DetailedSelector
      icon={Target}
      options={focusAreaOptions}
      selectedValue={value || []}
      multiple={true}
      onChange={handleChange}
      question="Which body areas do you want to focus on?"
      description="Select one or more areas to target in your workout"
      disabled={disabled}
      error={error}
      gridCols={3}
      colorScheme="primary"
      required={false}
      variant={variant}
      maxSelections={5}
      emptyStateMessage="Select up to 5 focus areas"
    />
  );
});
```

#### 4.2 Enhanced Sleep Quality Component

**File**: `src/modules/dashboard/workouts/components/customizations/enhanced/EnhancedSleepQualityCustomization.tsx`

```typescript
import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { Moon } from 'lucide-react';
import { CustomizationComponentProps } from '../../types';
import { useEnhancedOptions } from '../../hooks/useEnhancedOptions';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';

export default memo(function EnhancedSleepQualityCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<number | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { sleepQualityOptions } = useEnhancedOptions();
  const { trackSelection } = useWorkoutAnalytics();

  const handleChange = (sleep: string | string[]) => {
    const sleepValue = parseInt(sleep as string, 10);
    onChange(sleepValue);
    trackSelection('customization_sleep', sleepValue, 'detailed');
  };

  return (
    <DetailedSelector
      icon={Moon}
      options={sleepQualityOptions}
      selectedValue={value?.toString() || undefined}
      onChange={handleChange}
      question="How well did you sleep last night?"
      description="Your sleep quality affects workout intensity recommendations"
      disabled={disabled}
      error={error}
      gridCols={5}
      colorScheme="primary"
      required={false}
      variant={variant}
      showValueIndicator={true}
    />
  );
});
```

#### 4.3 Enhanced Stress Level Component

**File**: `src/modules/dashboard/workouts/components/customizations/enhanced/EnhancedStressLevelCustomization.tsx`

```typescript
import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { Brain } from 'lucide-react';
import { CustomizationComponentProps } from '../../types';
import { useEnhancedOptions } from '../../hooks/useEnhancedOptions';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';

export default memo(function EnhancedStressLevelCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<number | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { stressLevelOptions } = useEnhancedOptions();
  const { trackSelection } = useWorkoutAnalytics();

  const handleChange = (stress: string | string[]) => {
    const stressValue = parseInt(stress as string, 10);
    onChange(stressValue);
    trackSelection('customization_stress', stressValue, 'detailed');
  };

  return (
    <DetailedSelector
      icon={Brain}
      options={stressLevelOptions}
      selectedValue={value?.toString() || undefined}
      onChange={handleChange}
      question="What's your current stress level?"
      description="We'll adjust the workout to help manage your stress"
      disabled={disabled}
      error={error}
      gridCols={5}
      colorScheme="primary"
      required={false}
      variant={variant}
      showValueIndicator={true}
    />
  );
});
```

#### 4.4 Enhanced Soreness Component

**File**: `src/modules/dashboard/workouts/components/customizations/enhanced/EnhancedSorenessCustomization.tsx`

```typescript
import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { AlertTriangle } from 'lucide-react';
import { CustomizationComponentProps } from '../../types';
import { useEnhancedOptions } from '../../hooks/useEnhancedOptions';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';

export default memo(function EnhancedSorenessCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<string[] | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { sorenessAreaOptions } = useEnhancedOptions();
  const { trackSelection } = useWorkoutAnalytics();

  const handleChange = (newValue: string | string[]) => {
    onChange(newValue);
    trackSelection('customization_soreness', newValue, 'detailed');
  };

  return (
    <DetailedSelector
      icon={AlertTriangle}
      options={sorenessAreaOptions}
      selectedValue={value || []}
      multiple={true}
      onChange={handleChange}
      question="Are you experiencing any soreness?"
      description="We'll modify exercises to avoid aggravating sore areas"
      disabled={disabled}
      error={error}
      gridCols={3}
      colorScheme="warning"
      required={false}
      variant={variant}
      maxSelections={5}
      emptyStateMessage="Select any sore areas (optional)"
    />
  );
});
```

#### 4.5 Enhanced Components Index

**File**: `src/modules/dashboard/workouts/components/customizations/enhanced/index.ts`

```typescript
// Re-export Quick mode components that are already enhanced
export {
  EnhancedWorkoutFocusCustomization,
  EnhancedEnergyLevelCustomization,
  EnhancedWorkoutDurationCustomization,
  EnhancedAvailableEquipmentCustomization,
} from '../quick'; // From Quick workout setup

// Export new Detailed mode enhanced components
export { default as EnhancedFocusAreaCustomization } from './EnhancedFocusAreaCustomization';
export { default as EnhancedSleepQualityCustomization } from './EnhancedSleepQualityCustomization';
export { default as EnhancedStressLevelCustomization } from './EnhancedStressLevelCustomization';
export { default as EnhancedSorenessCustomization } from './EnhancedSorenessCustomization';
```

### Phase 5: Update Step Components

#### 5.1 Enhanced Workout Structure Step

**File**: `src/modules/dashboard/workouts/components/steps/WorkoutStructureStep.tsx` (Updated)

````typescript
import React, { useCallback, useEffect } from 'react';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { SelectionBadge } from '@/ui/shared/atoms';
import { formatSelectionValue } from '../../utils/selectionFormatters';
import { validateDetailedStep } from '../../validation/detailedValidation';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';
import {
  EnhancedWorkoutFocusCustomization,
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
  const { trackStepCompletion } = useWorkoutAnalytics();
  const startTime = useRef(Date.now());

  // Track step completion
  useEffect(() => {
    return () => {
      const duration = Date.now() - startTime.current;
      const fieldsCompleted = [
        options.customization_duration,
        options.customization_focus,
        options.customization_areas?.length > 0,
      ].filter(Boolean).length;

      trackStepCompletion(
        'workout-structure',
        duration,
        'detailed',
        (fieldsCompleted / 3) * 100
      );
    };
  }, []);

  // Validate on change
  const handleChange = useCallback((
    key: keyof PerWorkoutOptions,
    value: unknown
  ) => {
    onChange(key, value);

    // Run validation for this step
    const stepErrors = validateDetailedStep('structure', {
      ...options,
      [key]: value,
    });

    // Handle validation errors if needed
    if (stepErrors[key]) {
      console.warn(`Validation error for ${key}:`, stepErrors[key]);
    }
  }, [options, onChange]);

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
        {/* Duration Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">Workout Duration</h4>
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
            onChange={(duration) => handleChange(CUSTOMIZATION_FIELD_KEYS.DURATION, duration)}
            disabled={disabled}
            error={errors.customization_duration}
            variant={variant}
          />
        </div>
```typescript
        {/* Focus Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">Workout Focus</h4>
              <p className="text-sm text-base-content/70">
                What's your main goal for this workout?
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
            onChange={(focus) => handleChange(CUSTOMIZATION_FIELD_KEYS.FOCUS, focus)}
            disabled={disabled}
            error={errors.customization_focus}
            variant={variant}
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
            onChange={(areas) => handleChange(CUSTOMIZATION_FIELD_KEYS.AREAS, areas)}
            disabled={disabled}
            error={errors.customization_areas}
            variant={variant}
          />
        </div>
      </div>
    </div>
  );
};
````

#### 5.2 Enhanced Current State Step

**File**: `src/modules/dashboard/workouts/components/steps/CurrentStateStep.tsx` (Updated)

```typescript
import React, { useCallback, useEffect, useRef } from 'react';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { SelectionBadge } from '@/ui/shared/atoms';
import { formatSelectionValue } from '../../utils/selectionFormatters';
import { validateDetailedStep } from '../../validation/detailedValidation';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';
import {
  EnhancedEnergyLevelCustomization,
  EnhancedSleepQualityCustomization,
  EnhancedStressLevelCustomization,
  EnhancedSorenessCustomization,
} from '../customizations/enhanced';

export interface CurrentStateStepProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
  variant?: 'simple' | 'detailed';
}

export const CurrentStateStep: React.FC<CurrentStateStepProps> = ({
  options,
  onChange,
  errors,
  disabled = false,
  variant = 'detailed',
}) => {
  const { trackStepCompletion } = useWorkoutAnalytics();
  const startTime = useRef(Date.now());

  // Track step completion
  useEffect(() => {
    return () => {
      const duration = Date.now() - startTime.current;
      const fieldsCompleted = [
        options.customization_energy,
        options.customization_sleep,
        options.customization_stress,
        options.customization_soreness?.length > 0,
      ].filter(Boolean).length;

      trackStepCompletion(
        'current-state',
        duration,
        'detailed',
        (fieldsCompleted / 4) * 100
      );
    };
  }, []);

  // Validate on change
  const handleChange = useCallback((
    key: keyof PerWorkoutOptions,
    value: unknown
  ) => {
    onChange(key, value);

    // Run validation for this step
    const stepErrors = validateDetailedStep('current-state', {
      ...options,
      [key]: value,
    });

    // Handle validation errors if needed
    if (stepErrors[key]) {
      console.warn(`Validation error for ${key}:`, stepErrors[key]);
    }
  }, [options, onChange]);

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
        {/* Energy Level */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">Energy Level</h4>
              <p className="text-sm text-base-content/70">
                How energetic are you feeling today?
              </p>
            </div>
            <SelectionBadge
              value={formatSelectionValue(
                CUSTOMIZATION_FIELD_KEYS.ENERGY,
                options.customization_energy
              )}
              size="sm"
            />
          </div>

          <EnhancedEnergyLevelCustomization
            value={options.customization_energy}
            onChange={(energy) => handleChange(CUSTOMIZATION_FIELD_KEYS.ENERGY, energy)}
            disabled={disabled}
            error={errors.customization_energy}
            variant={variant}
          />
        </div>

        {/* Sleep Quality */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">Sleep Quality</h4>
              <p className="text-sm text-base-content/70">
                How well did you sleep last night?
              </p>
            </div>
            <SelectionBadge
              value={formatSelectionValue(
                CUSTOMIZATION_FIELD_KEYS.SLEEP,
                options.customization_sleep
              )}
              size="sm"
            />
          </div>

          <EnhancedSleepQualityCustomization
            value={options.customization_sleep}
            onChange={(sleep) => handleChange(CUSTOMIZATION_FIELD_KEYS.SLEEP, sleep)}
            disabled={disabled}
            error={errors.customization_sleep}
            variant={variant}
          />
        </div>

        {/* Stress Level */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">Stress Level</h4>
              <p className="text-sm text-base-content/70">
                What's your current stress level?
              </p>
            </div>
            <SelectionBadge
              value={formatSelectionValue(
                CUSTOMIZATION_FIELD_KEYS.STRESS,
                options.customization_stress
              )}
              size="sm"
            />
          </div>

          <EnhancedStressLevelCustomization
            value={options.customization_stress}
            onChange={(stress) => handleChange(CUSTOMIZATION_FIELD_KEYS.STRESS, stress)}
            disabled={disabled}
            error={errors.customization_stress}
            variant={variant}
          />
        </div>

        {/* Soreness */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">Current Soreness</h4>
              <p className="text-sm text-base-content/70">
                Are you experiencing any soreness?
              </p>
            </div>
            <SelectionBadge
              value={formatSelectionValue(
                CUSTOMIZATION_FIELD_KEYS.SORENESS,
                options.customization_soreness
              )}
              size="sm"
            />
          </div>

          <EnhancedSorenessCustomization
            value={options.customization_soreness}
            onChange={(soreness) => handleChange(CUSTOMIZATION_FIELD_KEYS.SORENESS, soreness)}
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

#### 5.3 Enhanced Equipment Preferences Step

**File**: `src/modules/dashboard/workouts/components/steps/EquipmentPreferencesStep.tsx` (Updated)

```typescript
import React, { useCallback, useEffect, useRef } from 'react';
import { CUSTOMIZATION_FIELD_KEYS } from '../../constants/fieldKeys';
import type { PerWorkoutOptions } from '../types';
import { SelectionBadge } from '@/ui/shared/atoms';
import { formatSelectionValue } from '../../utils/selectionFormatters';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';
import { EnhancedAvailableEquipmentCustomization } from '../customizations/enhanced';
// Keep legacy components for text input fields
import {
  IncludeExercisesCustomization,
  ExcludeExercisesCustomization
} from '../customizations';

export interface EquipmentPreferencesStepProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
  variant?: 'simple' | 'detailed';
}

export const EquipmentPreferencesStep: React.FC<EquipmentPreferencesStepProps> = ({
  options,
  onChange,
  errors,
  disabled = false,
  variant = 'detailed',
}) => {
  const { trackStepCompletion } = useWorkoutAnalytics();
  const startTime = useRef(Date.now());

  // Track step completion
  useEffect(() => {
    return () => {
      const duration = Date.now() - startTime.current;
      const fieldsCompleted = [
        options.customization_equipment?.length > 0,
        options.customization_include,
        options.customization_exclude,
      ].filter(Boolean).length;

      trackStepCompletion(
        'equipment-preferences',
        duration,
        'detailed',
        (fieldsCompleted / 3) * 100
      );
    };
  }, []);

  const handleChange = useCallback((
    key: keyof PerWorkoutOptions,
    value: unknown
  ) => {
    onChange(key, value);
  }, [onChange]);

  // Format functions for text fields
  const formatIncludeExercises = (value: string | undefined): string | null => {
    if (!value) return null;
    const exercises = value.split(',').map(e => e.trim()).filter(Boolean);
    if (exercises.length === 0) return null;
    if (exercises.length === 1) return exercises[0];
    return `${exercises.length} exercises`;
  };

  const formatExcludeExercises = (value: string | undefined): string | null => {
    if (!value) return null;
    const exercises = value.split(',').map(e => e.trim()).filter(Boolean);
    if (exercises.length === 0) return null;
    if (exercises.length === 1) return exercises[0];
    return `${exercises.length} exercises`;
  };

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
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">Available Equipment</h4>
              <p className="text-sm text-base-content/70">
                What equipment do you have available?
              </p>
            </div>
            <SelectionBadge
              value={formatSelectionValue(
                CUSTOMIZATION_FIELD_KEYS.EQUIPMENT,
                options.customization_equipment
              )}
              size="sm"
            />
          </div>

          <EnhancedAvailableEquipmentCustomization
            value={options.customization_equipment}
            onChange={(equipment) => handleChange(CUSTOMIZATION_FIELD_KEYS.EQUIPMENT, equipment)}
            disabled={disabled}
            error={errors.customization_equipment}
            variant={variant}
          />
        </div>

        {/* Include Exercises - Keep Legacy (Text Input) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">Include Exercises</h4>
              <p className="text-sm text-base-content/70">
                Specify exercises you want in your workout (optional)
              </p>
            </div>
            <SelectionBadge
              value={formatIncludeExercises(options.customization_include)}
              size="sm"
            />
          </div>

          <IncludeExercisesCustomization
            value={options.customization_include}
            onChange={(include) => handleChange(CUSTOMIZATION_FIELD_KEYS.INCLUDE, include)}
            disabled={disabled}
            error={errors.customization_include}
          />
        </div>

        {/* Exclude Exercises - Keep Legacy (Text Input) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base-content">Exclude Exercises</h4>
              <p className="text-sm text-base-content/70">
                Specify exercises you want to avoid (optional)
              </p>
            </div>
            <SelectionBadge
              value={formatExcludeExercises(options.customization_exclude)}
              size="sm"
            />
          </div>

          <ExcludeExercisesCustomization
            value={options.customization_exclude}
            onChange={(exclude) => handleChange(CUSTOMIZATION_FIELD_KEYS.EXCLUDE, exclude)}
            disabled={disabled}
            error={errors.customization_exclude}
          />
        </div>
      </div>
    </div>
  );
};
```

### Phase 6: Constants and Configuration

#### 6.1 Add Missing Constants

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

## 🚀 Implementation Timeline

### Week 1: Foundation & Utilities

- [x] Create unified selection formatters
- [x] Extend option enhancers with performance optimization
- [x] Add TypeScript discriminated unions
- [x] Create validation system for detailed mode
- [x] Set up analytics tracking

### Week 2: Enhanced Components

- [ ] Create 4 enhanced customization components with memoization
- [ ] Add analytics integration to each component
- [ ] Test components in isolation
- [ ] Create enhanced components index

### Week 3: Step Integration

- [ ] Update WorkoutStructureStep with enhanced components
- [ ] Update CurrentStateStep with enhanced components
- [ ] Update EquipmentPreferencesStep with mixed approach
- [ ] Add step-level analytics tracking

### Week 4: Testing & Polish

- [ ] Integration testing across all steps
- [ ] Visual regression testing
- [ ] Performance optimization and profiling
- [ ] Accessibility audit (WCAG AA compliance)
- [ ] Mobile responsiveness testing

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

- **Memoization**: Enhanced options cached with useMemo and React.memo
- **Lazy Loading**: Components loaded only when needed
- **Code Splitting**: Leverage existing patterns
- **Cache Strategy**: Options cached at module level

This comprehensive plan provides a clean path to enhance the Detailed Workout Setup with card-based selectors while maintaining architectural simplicity, adding crucial performance optimizations, and ensuring a consistent user experience across all workout customization modes.
