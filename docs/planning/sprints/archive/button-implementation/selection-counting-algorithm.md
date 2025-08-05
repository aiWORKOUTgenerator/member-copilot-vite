# Selection Counting Algorithm Specification

## Overview

The selection counting algorithm determines the completion status of each step in the workout customization process. This algorithm provides the foundation for the hybrid button state system by quantifying user progress within each step.

## Algorithm Design

### Core Principles

1. **Step Isolation**: Each step is evaluated independently
2. **Binary Selection Logic**: Each field is either selected (1) or not selected (0)
3. **Required Field Validation**: Each step has a defined set of required fields
4. **Progressive Feedback**: Partial completion is recognized and communicated
5. **User Experience First**: Validation only shows when user has made partial selections

### Step Definitions

#### Step 0: Focus & Energy

**Fields**: `customization_goal`, `customization_energy`
**Required**: 2 selections
**Validation**: Both fields must have valid values

#### Step 1: Duration & Equipment

**Fields**: `customization_duration`, `customization_equipment`
**Required**: 2 selections
**Validation**: Duration must be valid number, equipment must be non-empty array

## Algorithm Implementation

### Type Definitions

```typescript
interface StepSelections {
  total: number;
  required: number;
  percentage: number;
  isComplete: boolean;
  isPartial: boolean;
  isEmpty: boolean;
  details: {
    [fieldName: string]: boolean;
  };
}

interface SelectionState {
  focusEnergy: StepSelections;
  durationEquipment: StepSelections;
  currentStep: StepSelections;
}
```

### Core Counting Functions

#### 1. Focus & Energy Step Counting

```typescript
function getFocusEnergySelections(options: PerWorkoutOptions): StepSelections {
  const hasGoal = !!options.customization_goal;
  const hasEnergy = !!options.customization_energy;
  const total = (hasGoal ? 1 : 0) + (hasEnergy ? 1 : 0);
  const required = 2;

  return {
    total,
    required,
    percentage: (total / required) * 100,
    isComplete: total === required,
    isPartial: total > 0 && total < required,
    isEmpty: total === 0,
    details: {
      customization_goal: hasGoal,
      customization_energy: hasEnergy,
    },
  };
}
```

#### 2. Duration & Equipment Step Counting

```typescript
function getDurationEquipmentSelections(
  options: PerWorkoutOptions
): StepSelections {
  const hasDuration = !!options.customization_duration;
  const hasEquipment =
    options.customization_equipment &&
    options.customization_equipment.length > 0;
  const total = (hasDuration ? 1 : 0) + (hasEquipment ? 1 : 0);
  const required = 2;

  return {
    total,
    required,
    percentage: (total / required) * 100,
    isComplete: total === required,
    isPartial: total > 0 && total < required,
    isEmpty: total === 0,
    details: {
      customization_duration: hasDuration,
      customization_equipment: hasEquipment,
    },
  };
}
```

#### 3. Current Step Selection Getter

```typescript
function getCurrentStepSelections(
  activeStep: "focus-energy" | "duration-equipment",
  options: PerWorkoutOptions
): StepSelections {
  return activeStep === "focus-energy"
    ? getFocusEnergySelections(options)
    : getDurationEquipmentSelections(options);
}
```

#### 4. Overall Selection State

```typescript
function getSelectionState(
  activeStep: "focus-energy" | "duration-equipment",
  options: PerWorkoutOptions
): SelectionState {
  return {
    focusEnergy: getFocusEnergySelections(options),
    durationEquipment: getDurationEquipmentSelections(options),
    currentStep: getCurrentStepSelections(activeStep, options),
  };
}
```

## Field Validation Rules

### customization_goal

- **Valid**: Non-empty string
- **Invalid**: `undefined`, `null`, `""`
- **Edge Cases**: Whitespace-only strings should be considered invalid

### customization_energy

- **Valid**: Number between 1 and 6 (inclusive)
- **Invalid**: `undefined`, `null`, `NaN`, numbers outside range
- **Edge Cases**: String numbers should be converted and validated

### customization_duration

- **Valid**: Number between 5 and 300 (inclusive)
- **Invalid**: `undefined`, `null`, `NaN`, numbers outside range
- **Edge Cases**: String numbers should be converted and validated

### customization_equipment

- **Valid**: Array with at least one non-empty string element
- **Invalid**: `undefined`, `null`, empty array `[]`
- **Edge Cases**: Array with only empty strings should be considered invalid

## Algorithm Properties

### Deterministic

- Same input always produces same output
- No side effects or external dependencies
- Pure function behavior

### Performance Optimized

- O(1) time complexity for each step
- Minimal memory allocation
- Efficient boolean operations

### Extensible

- Easy to add new steps
- Configurable required field counts
- Pluggable validation rules

## Simplified Validation Integration

### Progressive Validation Logic

The current implementation uses a **simplified progressive validation approach**:

```typescript
// Simplified validation logic in WorkoutCustomization.tsx
const generateValidationErrors = () => {
  const validationErrors: Partial<Record<keyof PerWorkoutOptions, string>> = {};

  if (currentStep === "focus-energy") {
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
  }

  return validationErrors;
};
```

### Key Differences from Complex Validation

1. **No Premature Errors**: Errors only show when user has made partial selections
2. **Step-Based**: Validates entire steps rather than individual fields
3. **Simple Logic**: "Show error if one is selected but not both"
4. **User-Friendly**: Reduces cognitive load and maintains flow

## Integration with Button State Logic

### State Mapping

```typescript
function mapSelectionsToButtonState(
  selections: StepSelections,
  hasValidationErrors: boolean
) {
  if (hasValidationErrors) {
    return {
      state: "disabled",
      className: "btn-disabled",
      text: "Fix validation errors",
      disabled: true,
    };
  }

  if (selections.isEmpty) {
    return {
      state: "disabled",
      className: "btn-disabled",
      text: "Complete current step",
      disabled: true,
    };
  }

  if (selections.isPartial) {
    return {
      state: "partial",
      className: "btn-outline btn-primary",
      text: "Continue",
      disabled: false,
    };
  }

  return {
    state: "active",
    className: "btn-primary",
    text: "Next", // or 'Generate Quick Workout' for final step
    disabled: false,
  };
}
```

### Visual Feedback Integration

```typescript
function getVisualFeedback(selections: StepSelections) {
  if (selections.isEmpty) {
    return {
      indicatorColor: "gray",
      message: "Complete current step to continue",
      progress: 0,
    };
  }

  if (selections.isPartial) {
    return {
      indicatorColor: "blue",
      message: `${selections.total} of ${selections.required} selections made`,
      progress: selections.percentage,
    };
  }

  return {
    indicatorColor: "green",
    message: "Ready to proceed",
    progress: 100,
  };
}
```

## Testing Strategy

### Unit Tests

```typescript
describe("Selection Counting Algorithm", () => {
  describe("getFocusEnergySelections", () => {
    it("returns empty state when no selections made", () => {
      const result = getFocusEnergySelections({});
      expect(result.isEmpty).toBe(true);
      expect(result.total).toBe(0);
    });

    it("returns partial state when one selection made", () => {
      const result = getFocusEnergySelections({
        customization_goal: "energizing_boost",
      });
      expect(result.isPartial).toBe(true);
      expect(result.total).toBe(1);
    });

    it("returns complete state when all selections made", () => {
      const result = getFocusEnergySelections({
        customization_goal: "energizing_boost",
        customization_energy: 5,
      });
      expect(result.isComplete).toBe(true);
      expect(result.total).toBe(2);
    });
  });

  describe("getDurationEquipmentSelections", () => {
    it("handles empty equipment array correctly", () => {
      const result = getDurationEquipmentSelections({
        customization_duration: 30,
        customization_equipment: [],
      });
      expect(result.isPartial).toBe(true);
      expect(result.total).toBe(1);
    });
  });
});
```

### Edge Case Tests

- Invalid data types
- Boundary values
- Null/undefined handling
- Array edge cases
- String validation

## Performance Considerations

### Optimization Techniques

1. **Memoization**: Cache results for repeated calls with same inputs
2. **Lazy Evaluation**: Only compute when needed
3. **Early Returns**: Exit early when possible
4. **Minimal Re-renders**: Use React.memo for components

### Memory Management

- Avoid creating new objects unnecessarily
- Reuse existing data structures
- Clean up cached values appropriately

## Future Enhancements

### Potential Extensions

1. **Weighted Selections**: Different fields could have different weights
2. **Conditional Requirements**: Requirements could change based on context
3. **Dynamic Validation**: Validation rules could be configurable
4. **Progress Persistence**: Save progress across sessions

### Scalability Considerations

- Support for more than 2 steps
- Dynamic field requirements
- Complex validation rules
- Multi-step dependencies
