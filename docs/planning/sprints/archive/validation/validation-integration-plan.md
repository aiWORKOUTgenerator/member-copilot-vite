# Validation Integration Plan

## Overview

This document outlines how validation errors will integrate with the hybrid button state system, ensuring that validation takes precedence over selection-based states while maintaining clear user feedback.

## Current Validation System Analysis

### Actual Implementation: Simplified Progressive Validation

The current implementation uses a **simplified progressive validation approach** that prioritizes user experience:

```typescript
// Current validation logic in WorkoutCustomization.tsx
const generateValidationErrors = () => {
  const validationErrors: Partial<Record<keyof PerWorkoutOptions, string>> = {};

  if (currentStep === 'focus-energy') {
    const hasFocus = !!options.customization_focus;
    const hasEnergy = !!options.customization_energy;

    // Show error if one is selected but not both
    if (hasFocus && !hasEnergy) {
      validationErrors.customization_energy =
        VALIDATION_MESSAGES.ENERGY_REQUIRED;
    }
    if (!hasFocus && hasEnergy) {
      validationErrors.customization_focus = VALIDATION_MESSAGES.FOCUS_REQUIRED;
    }
  } else if (currentStep === 'duration-equipment') {
    const hasDuration = !!options.customization_duration;
    const hasEquipment = !!options.customization_equipment;

    // Show error if one is selected but not both
    if (hasDuration && !hasEquipment) {
      validationErrors.customization_equipment =
        VALIDATION_MESSAGES.EQUIPMENT_REQUIRED;
    }
    if (!hasDuration && hasEquipment) {
      validationErrors.customization_duration =
        VALIDATION_MESSAGES.DURATION_REQUIRED;
    }
  }

  return validationErrors;
};
```

### Current Error Handling

- **Error State**: `errors: Partial<Record<keyof PerWorkoutOptions, string>>`
- **Progressive Display**: Only shows errors when user has made partial selections
- **Step-Based**: Validates entire steps rather than individual fields
- **User-Friendly**: No errors shown until user starts interacting with fields

## Validation Integration Strategy

### 1. Simplified Progressive Validation Approach

The current implementation prioritizes **user experience** over complex validation rules:

#### Core Principles

- **Progressive Feedback**: Only show errors when user has made partial selections
- **Step-Based Validation**: Validate entire steps rather than individual fields
- **User-Friendly**: No errors shown until user starts interacting with fields
- **Simple Logic**: "Show error if one is selected but not both"

#### Validation States

1. **Empty State**: No errors shown (user hasn't started)
2. **Partial Selection**: Show error for missing field in current step
3. **Complete Step**: No errors, allow progression
4. **Step Navigation**: Reset validation state when switching steps

#### Benefits

- ✅ **Reduces Cognitive Load**: Users aren't overwhelmed with errors
- ✅ **Guides Progression**: Clear indication of what's needed next
- ✅ **Maintains Flow**: Smooth user experience without interruption
- ✅ **Simple Implementation**: Easy to understand and maintain

### 2. Precedence Rules

#### Primary Rule: Validation Overrides Selection States

```typescript
const getHybridButtonState = () => {
  const currentStepSelections = getCurrentStepSelections();
  const hasValidationErrors = Object.keys(errors).length > 0;

  // Validation errors take absolute precedence
  if (hasValidationErrors) {
    return {
      className: 'btn-disabled',
      disabled: true,
      text: 'Fix validation errors',
    };
  }

  // Only apply selection-based states when no validation errors exist
  return getSelectionBasedButtonState(currentStepSelections);
};
```

#### Secondary Rule: Step-Specific Error Handling

```typescript
const getStepSpecificErrors = (activeStep: string) => {
  const stepFields =
    activeStep === 'focus-energy' ? fieldsInStep(0) : fieldsInStep(1);
  return stepFields.filter((field) => errors[field]);
};
```

### 2. Error Categories and Handling

#### Category 1: Required Field Errors

**Examples**: Missing goal, missing energy, missing duration, missing equipment
**Button State**: Disabled with "Complete current step" text
**Error Priority**: High (overrides all selection states)

```typescript
const getRequiredFieldErrors = (
  options: PerWorkoutOptions,
  activeStep: string
) => {
  const errors: Partial<Record<keyof PerWorkoutOptions, string>> = {};

  if (activeStep === 'focus-energy') {
    if (!options.customization_focus) {
      errors.customization_focus = 'Please select a workout focus';
    }
    if (!options.customization_energy) {
      errors.customization_energy = 'Please select your energy level';
    }
  } else {
    if (!options.customization_duration) {
      errors.customization_duration = 'Please select workout duration';
    }
    if (!options.customization_equipment) {
      errors.customization_equipment = 'Please select available equipment';
    }
  }

  return errors;
};
```

#### Category 2: Range Validation Errors

**Examples**: Energy level outside 1-6, duration outside 5-300 minutes
**Button State**: Disabled with "Fix validation errors" text
**Error Priority**: High (overrides all selection states)

```typescript
const getRangeValidationErrors = (options: PerWorkoutOptions) => {
  const errors: Partial<Record<keyof PerWorkoutOptions, string>> = {};

  // Energy level validation
  if (options.customization_energy !== undefined) {
    const energy = Number(options.customization_energy);
    if (isNaN(energy) || energy < 1 || energy > 6) {
      errors.customization_energy = 'Energy level must be between 1 and 6';
    }
  }

  // Duration validation
  if (options.customization_duration !== undefined) {
    const duration = Number(options.customization_duration);
    if (isNaN(duration) || duration < 5 || duration > 45) {
      errors.customization_duration =
        'Duration must be between 5 and 45 minutes';
    }
  }

  return errors;
};
```

#### Category 3: Format Validation Errors

**Examples**: Invalid string formats, malformed arrays
**Button State**: Disabled with "Fix validation errors" text
**Error Priority**: High (overrides all selection states)

```typescript
const getFormatValidationErrors = (options: PerWorkoutOptions) => {
  const errors: Partial<Record<keyof PerWorkoutOptions, string>> = {};

  // Equipment string validation
  if (options.customization_equipment) {
    if (typeof options.customization_equipment !== 'string') {
      errors.customization_equipment = 'Equipment must be a valid selection';
    } else if (
      !['bodyweight', 'available_equipment', 'full_gym'].includes(
        options.customization_equipment
      )
    ) {
      errors.customization_equipment = 'Please select a valid equipment option';
    }
  }

  return errors;
};
```

### 3. Error State Management

#### Error Collection Strategy

```typescript
const collectAllErrors = (options: PerWorkoutOptions, activeStep: string) => {
  return {
    ...getRequiredFieldErrors(options, activeStep),
    ...getRangeValidationErrors(options),
    ...getFormatValidationErrors(options),
  };
};
```

#### Error Clearing Strategy

```typescript
const clearErrorsForField = (
  field: keyof PerWorkoutOptions,
  errors: Partial<Record<keyof PerWorkoutOptions, string>>
) => {
  const newErrors = { ...errors };
  delete newErrors[field];
  return newErrors;
};

const clearErrorsForStep = (
  stepFields: (keyof PerWorkoutOptions)[],
  errors: Partial<Record<keyof PerWorkoutOptions, string>>
) => {
  const newErrors = { ...errors };
  stepFields.forEach((field) => delete newErrors[field]);
  return newErrors;
};
```

### 4. Integration with Selection Counting

#### Error-Aware Selection Counting

```typescript
const getErrorAwareSelections = (
  options: PerWorkoutOptions,
  activeStep: string,
  errors: Partial<Record<keyof PerWorkoutOptions, string>>
) => {
  const baseSelections = getCurrentStepSelections(activeStep, options);
  const stepErrors = getStepSpecificErrors(activeStep);

  return {
    ...baseSelections,
    hasErrors: stepErrors.length > 0,
    errorCount: stepErrors.length,
    canProceed: baseSelections.isComplete && stepErrors.length === 0,
  };
};
```

#### Button State with Error Context

```typescript
const getButtonStateWithErrors = (
  options: PerWorkoutOptions,
  activeStep: string,
  errors: Partial<Record<keyof PerWorkoutOptions, string>>
) => {
  const errorAwareSelections = getErrorAwareSelections(
    options,
    activeStep,
    errors
  );
  const hasAnyErrors = Object.keys(errors).length > 0;

  if (hasAnyErrors) {
    return {
      className: 'btn-disabled',
      disabled: true,
      text: errorAwareSelections.hasErrors
        ? 'Fix current step errors'
        : 'Fix validation errors',
      state: 'error',
    };
  }

  return getSelectionBasedButtonState(errorAwareSelections);
};
```

### 5. Visual Feedback Integration

#### Error State Indicators

```typescript
const getErrorVisualFeedback = (
  errors: Partial<Record<keyof PerWorkoutOptions, string>>,
  activeStep: string
) => {
  const stepErrors = getStepSpecificErrors(activeStep);
  const totalErrors = Object.keys(errors).length;

  if (totalErrors === 0) {
    return null; // No error feedback needed
  }

  if (stepErrors.length > 0) {
    return {
      indicatorColor: 'red',
      message: `${stepErrors.length} error${stepErrors.length > 1 ? 's' : ''} in current step`,
      icon: 'error',
    };
  }

  return {
    indicatorColor: 'orange',
    message: `${totalErrors} validation error${totalErrors > 1 ? 's' : ''} found`,
    icon: 'warning',
  };
};
```

#### Step Circle Error States

```typescript
const getStepErrorState = (
  stepId: string,
  options: PerWorkoutOptions,
  errors: Partial<Record<keyof PerWorkoutOptions, string>>
) => {
  const stepFields =
    stepId === 'focus-energy' ? fieldsInStep(0) : fieldsInStep(1);
  const stepErrors = stepFields.filter((field) => errors[field]);

  return {
    hasErrors: stepErrors.length > 0,
    errorCount: stepErrors.length,
    isBlocked: stepErrors.length > 0,
    canNavigate: stepErrors.length === 0,
  };
};
```

### 6. Error Recovery and User Experience

#### Automatic Error Clearing

```typescript
const handleFieldChange = (
  field: keyof PerWorkoutOptions,
  value: unknown,
  options: PerWorkoutOptions,
  errors: Partial<Record<keyof PerWorkoutOptions, string>>
) => {
  // Update options
  const newOptions = { ...options, [field]: value };

  // Clear error for this field if it exists
  const newErrors = clearErrorsForField(field, errors);

  // Re-validate the field
  const fieldErrors = validateField(field, value);
  if (fieldErrors) {
    newErrors[field] = fieldErrors;
  }

  return { newOptions, newErrors };
};
```

#### Progressive Error Resolution

```typescript
const getErrorResolutionGuidance = (
  errors: Partial<Record<keyof PerWorkoutOptions, string>>,
  activeStep: string
) => {
  const stepErrors = getStepSpecificErrors(activeStep);

  if (stepErrors.length === 0) {
    return {
      message: 'All current step fields are valid',
      priority: 'low',
    };
  }

  const firstError = stepErrors[0];
  return {
    message: `Fix: ${errors[firstError]}`,
    priority: 'high',
    field: firstError,
  };
};
```

### 7. Testing Strategy

#### Validation Integration Tests

```typescript
describe('Validation Integration', () => {
  it('validation errors override selection states', () => {
    const options = {
      customization_focus: 'energizing_boost',
      customization_energy: 5,
    };
    const errors = {
      customization_energy: 'Energy level must be between 1 and 6',
    };

    const buttonState = getButtonStateWithErrors(
      options,
      'focus-energy',
      errors
    );

    expect(buttonState.className).toBe('btn-disabled');
    expect(buttonState.text).toBe('Fix validation errors');
    expect(buttonState.disabled).toBe(true);
  });

  it('clears errors when valid selections are made', () => {
    const options = { customization_focus: 'energizing_boost' };
    const errors = { customization_energy: 'Please select your energy level' };

    const { newErrors } = handleFieldChange(
      'customization_energy',
      5,
      options,
      errors
    );

    expect(newErrors.customization_energy).toBeUndefined();
  });
});
```

### 8. Performance Considerations

#### Error Calculation Optimization

- Cache error calculations for unchanged fields
- Only re-validate when field values change
- Use memoization for expensive validation operations

#### State Update Optimization

- Batch error state updates
- Minimize re-renders when errors change
- Use React.memo for error-dependent components

### 9. Accessibility Considerations

#### Error Announcements

- Screen reader announcements for error states
- Clear error messages for assistive technologies
- Keyboard navigation for error resolution

#### Error Recovery

- Clear paths to fix errors
- Helpful error messages
- Progressive disclosure of complex errors

## Implementation Checklist

### Phase 1: Core Integration

- [ ] Implement error-aware selection counting
- [ ] Create validation precedence logic
- [ ] Integrate error state with button logic
- [ ] Add error visual feedback

### Phase 2: User Experience

- [ ] Implement automatic error clearing
- [ ] Add error resolution guidance
- [ ] Create progressive error feedback
- [ ] Test error recovery flows

### Phase 3: Optimization

- [ ] Optimize error calculation performance
- [ ] Add error state caching
- [ ] Implement accessibility features
- [ ] Add comprehensive error testing

### Phase 4: Polish

- [ ] Add error state animations
- [ ] Implement error state persistence
- [ ] Create error analytics tracking
- [ ] Document error handling patterns
