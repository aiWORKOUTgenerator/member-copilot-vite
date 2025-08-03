# Button State Requirements Document

## Current Implementation Analysis

### Existing Button State Logic
The current `getButtonState()` function in `GeneratePage.tsx` implements a three-state system:

1. **Disabled State** (`btn-disabled`)
   - Triggered when: Current step has validation errors
   - Visual: Grayed out button with disabled styling
   - Text: "Next" or "Generate Quick Workout"

2. **Partially Active State** (`btn-outline btn-primary`)
   - Triggered when: Current step is valid, but other steps have errors
   - Visual: Outlined primary button
   - Text: "Next" or "Generate Quick Workout"

3. **Active State** (`btn-primary`)
   - Triggered when: All validation passed
   - Visual: Solid primary button
   - Text: "Next" or "Generate Quick Workout"

### Current Validation Functions
- `validateFocusAndEnergy()`: Requires both `customization_goal` and `customization_energy`
- `validateDurationAndEquipment()`: Requires both `customization_duration` and `customization_equipment`

### Current Step Structure
- **Step 0 (Focus & Energy)**: `['customization_goal', 'customization_energy']`
- **Step 1 (Duration & Equipment)**: `['customization_duration', 'customization_equipment']`

## Current Implementation: Simplified Button State Behavior

### Core Requirements

#### 1. Progressive Validation-Based Feedback
- **No Selections**: Button shows disabled state with "Complete current step" text
- **Partial Selections**: Button shows disabled state with error message for missing field
- **All Selections**: Button shows active state with "Next" or "Generate Quick Workout" text

#### 2. Simplified Validation Logic
- **Progressive Errors**: Only show validation errors when user has made partial selections
- **Step-Based**: Validation is tied to step completion rather than individual fields
- **User-Friendly**: No premature error display

#### 3. Step-Specific Requirements
- **Focus & Energy Step**: Requires 2 selections (goal + energy)
- **Duration & Equipment Step**: Requires 2 selections (duration + equipment)

### Button State Matrix

| Selections | Validation Errors | Button State | Text | Class |
|------------|------------------|--------------|------|-------|
| 0/2 | None | Disabled | "Complete current step" | `btn-disabled` |
| 1/2 | None | Partial | "Continue" | `btn-outline btn-primary` |
| 2/2 | None | Active | "Next" / "Generate Quick Workout" | `btn-primary` |
| Any | Present | Disabled | "Fix validation errors" | `btn-disabled` |

### Visual Feedback Requirements

#### 1. Button State Indicators
- **Disabled**: Gray indicator dot with explanatory text
- **Partial**: Blue indicator dot with progress text (e.g., "1 of 2 selections made")
- **Active**: Green indicator dot with "Ready to proceed" text

#### 2. Step Circle Progress
- **Incomplete**: Empty or gray circle
- **Partial**: Partially filled circle
- **Complete**: Fully filled circle with checkmark

#### 3. Smooth Transitions
- CSS transitions between all button states
- Animated progress indicators
- Consistent timing (200-300ms)

## Technical Requirements

### Selection Counting Logic
```typescript
// Focus & Energy step
const getFocusEnergySelections = () => {
  const hasGoal = !!perWorkoutOptions.customization_goal;
  const hasEnergy = !!perWorkoutOptions.customization_energy;
  return { 
    hasGoal, 
    hasEnergy, 
    total: (hasGoal ? 1 : 0) + (hasEnergy ? 1 : 0),
    required: 2 
  };
};

// Duration & Equipment step
const getDurationEquipmentSelections = () => {
  const hasDuration = !!perWorkoutOptions.customization_duration;
  const hasEquipment = perWorkoutOptions.customization_equipment?.length > 0;
  return { 
    hasDuration, 
    hasEquipment, 
    total: (hasDuration ? 1 : 0) + (hasEquipment ? 1 : 0),
    required: 2 
  };
};
```

### Hybrid Button State Logic
```typescript
const getHybridButtonState = () => {
  const currentStepSelections = getCurrentStepSelections();
  const hasValidationErrors = Object.keys(errors).length > 0;
  
  // Validation-based override
  if (hasValidationErrors) {
    return { 
      className: "btn-disabled", 
      disabled: true, 
      text: "Fix validation errors" 
    };
  }
  
  // Selection-based states
  if (currentStepSelections.total === 0) {
    return { 
      className: "btn-disabled", 
      disabled: true, 
      text: "Complete current step" 
    };
  }
  
  if (currentStepSelections.total < currentStepSelections.required) {
    return { 
      className: "btn-outline btn-primary", 
      disabled: false, 
      text: "Continue" 
    };
  }
  
  return { 
    className: "btn-primary", 
    disabled: false, 
    text: activeQuickStep === "focus-energy" ? "Next" : "Generate Quick Workout" 
  };
};
```

## Edge Cases and Error Scenarios

### 1. Validation Error Scenarios
- **Invalid energy level**: Energy must be between 1-6
- **Invalid duration**: Duration must be between 5-300 minutes
- **Missing required fields**: Goal, energy, duration, or equipment not selected
- **Empty equipment array**: Equipment array exists but is empty

### 2. State Transition Scenarios
- **User clears selections**: Button should transition from active to partial to disabled
- **User fixes validation errors**: Button should transition from disabled to selection-based state
- **User switches steps**: Button should reset to current step's selection state

### 3. Accessibility Considerations
- **Screen reader announcements**: State changes should be announced
- **Keyboard navigation**: Button should be focusable in all states
- **Color contrast**: All states must meet WCAG contrast requirements

## Integration Points

### 1. Existing Components
- `GeneratePage.tsx`: Main button state logic
- `WorkoutCustomization.tsx`: Step indicator and validation
- `StepIndicator.tsx`: Visual step progress

### 2. State Management
- `perWorkoutOptions`: Current selections
- `errors`: Validation error state
- `touchedFields`: Field interaction tracking
- `activeQuickStep`: Current step tracking

### 3. Event Handlers
- `handlePerWorkoutOptionChange`: Updates selections and clears errors
- `handleSubmit`: Validates and processes form submission
- Step navigation: Handles step transitions

## Success Criteria

### Functional Requirements
- [ ] Button shows correct state based on selections and validation
- [ ] Validation errors override selection states
- [ ] Smooth transitions between all states
- [ ] Step progress indicators update correctly

### User Experience Requirements
- [ ] Clear visual feedback for all states
- [ ] Intuitive progression through steps
- [ ] Helpful error messages and guidance
- [ ] Responsive and accessible design

### Technical Requirements
- [ ] Selection counting logic is accurate
- [ ] Validation integration is robust
- [ ] State management is performant
- [ ] No breaking changes to existing functionality 