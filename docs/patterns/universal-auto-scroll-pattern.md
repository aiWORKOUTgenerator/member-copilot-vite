# Universal Auto-Scroll Pattern

## Overview

The Universal Auto-Scroll Pattern provides a consistent, reusable approach to implementing auto-scroll functionality across multi-step forms and feature interfaces. This pattern abstracts the complexity of timing, scroll targeting, and step navigation into a clean, declarative API.

## Core Components

### 1. `useFormAutoScroll` Hook

The main hook that handles all auto-scroll logic. This hook is production-ready with full TypeScript generics, error handling, and automatic cleanup:

```typescript
// Type-safe configuration with generic form data type
const { registerScrollTarget, handleFieldSelection } =
  useFormAutoScroll<WorkoutFormData>({
    formId: 'workout-customization',
    steps: [
      {
        id: 'focus-energy',
        label: 'Focus & Energy',
        fields: ['focus', 'energy'],
        scrollTarget: 'focus-question', // Optional specific target
      },
      {
        id: 'duration-equipment',
        label: 'Duration & Equipment',
        fields: ['duration', 'equipment'],
        scrollTarget: 'duration-question',
      },
    ],
    currentStepId: currentStep,
    setCurrentStep: setCurrentStep,
    isStepComplete: (stepId, data) => {
      if (stepId === 'focus-energy') return data.focus && data.energy;
      if (stepId === 'duration-equipment')
        return data.duration && data.equipment;
      return false;
    },
    getNextField: (currentField, stepId) => {
      if (stepId === 'focus-energy') {
        return currentField === 'focus' ? 'energy' : null;
      }
      if (stepId === 'duration-equipment') {
        return currentField === 'duration' ? 'equipment' : null;
      }
      return null;
    },
    getNextStep: (currentStepId) => {
      if (currentStepId === 'focus-energy') return 'duration-equipment';
      return null;
    },
  });
```

### 2. `ScrollTarget` Component

A production-ready helper component for registering scroll targets with error handling and flexible element rendering:

```typescript
<ScrollTarget
  targetId="duration-question"
  registerScrollTarget={registerScrollTarget}
  className="scroll-mt-4"
>
  <h3>How long do you want your workout to be?</h3>
</ScrollTarget>
```

## Usage Patterns

### Pattern 1: Question-Focused Scrolling

**Use when**: You want to scroll to specific question titles when advancing steps.

```typescript
// Step configuration
const steps = [
  {
    id: 'focus-energy',
    label: 'Focus & Energy',
    fields: ['focus', 'energy'],
    scrollTarget: 'focus-question' // Scroll to this when entering step
  },
  {
    id: 'duration-equipment',
    label: 'Duration & Equipment',
    fields: ['duration', 'equipment'],
    scrollTarget: 'duration-question'
  }
];

// Component usage
<ScrollTarget
  targetId="focus-question"
  registerScrollTarget={registerScrollTarget}
>
  <h3>What's your main goal for this workout?</h3>
</ScrollTarget>

<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={formData.focus}
  onChange={(value) => handleFieldSelection('focus', value, formData, setFormData)}
  question="What's your main goal for this workout?"
/>
```

### Pattern 2: Section-Focused Scrolling

**Use when**: You want to scroll to entire sections rather than specific questions.

```typescript
// Step configuration
const steps = [
  {
    id: 'focus-energy',
    label: 'Focus & Energy',
    fields: ['focus', 'energy'],
    scrollTarget: 'focus-energy-section'
  }
];

// Component usage
<ScrollTarget
  targetId="focus-energy-section"
  registerScrollTarget={registerScrollTarget}
  as="section"
  className="space-y-8"
>
  <DetailedSelector
    icon={Target}
    options={focusOptions}
    selectedValue={formData.focus}
    onChange={(value) => handleFieldSelection('focus', value, formData, setFormData)}
    question="What's your main goal for this workout?"
  />

  <DetailedSelector
    icon={Battery}
    options={energyOptions}
    selectedValue={formData.energy}
    onChange={(value) => handleFieldSelection('energy', value, formData, setFormData)}
    question="How energetic are you feeling today?"
  />
</ScrollTarget>
```

### Pattern 3: Intra-Step Field Navigation

**Use when**: You want to scroll between fields within the same step.

```typescript
// Field navigation logic
const getNextField = (currentField, stepId) => {
  if (stepId === 'focus-energy') {
    return currentField === 'focus' ? 'energy' : null;
  }
  return null;
};

// Component usage with field-specific targets
<ScrollTarget
  targetId="focus-energy-focus"
  registerScrollTarget={registerScrollTarget}
>
  <DetailedSelector
    icon={Target}
    options={focusOptions}
    selectedValue={formData.focus}
    onChange={(value) => handleFieldSelection('focus', value, formData, setFormData)}
    question="What's your main goal for this workout?"
  />
</ScrollTarget>

<ScrollTarget
  targetId="focus-energy-energy"
  registerScrollTarget={registerScrollTarget}
>
  <DetailedSelector
    icon={Battery}
    options={energyOptions}
    selectedValue={formData.energy}
    onChange={(value) => handleFieldSelection('energy', value, formData, setFormData)}
    question="How energetic are you feeling today?"
  />
</ScrollTarget>
```

## Implementation Examples

### Example 1: Workout Customization Form

```typescript
import { useFormAutoScroll } from '@/hooks';
import { ScrollTarget } from '@/ui/shared/atoms';

interface WorkoutFormData {
  focus?: string;
  energy?: number;
  duration?: number;
  equipment?: string[];
}

export function WorkoutCustomizationForm() {
  const [currentStep, setCurrentStep] = useState('focus-energy');
  const [formData, setFormData] = useState<WorkoutFormData>({});

  const { registerScrollTarget, handleFieldSelection } = useFormAutoScroll<WorkoutFormData>({
    formId: 'workout-customization',
    steps: [
      {
        id: 'focus-energy',
        label: 'Focus & Energy',
        fields: ['focus', 'energy'],
        scrollTarget: 'focus-question'
      },
      {
        id: 'duration-equipment',
        label: 'Duration & Equipment',
        fields: ['duration', 'equipment'],
        scrollTarget: 'duration-question'
      }
    ],
    currentStepId: currentStep,
    setCurrentStep,
    isStepComplete: (stepId, data) => {
      if (stepId === 'focus-energy') return !!(data.focus && data.energy);
      if (stepId === 'duration-equipment') return !!(data.duration && data.equipment?.length);
      return false;
    },
    getNextField: (currentField, stepId) => {
      if (stepId === 'focus-energy') {
        return currentField === 'focus' ? 'energy' : null;
      }
      if (stepId === 'duration-equipment') {
        return currentField === 'duration' ? 'equipment' : null;
      }
      return null;
    },
    getNextStep: (currentStepId) => {
      if (currentStepId === 'focus-energy') return 'duration-equipment';
      return null;
    }
  });

  return (
    <div>
      {currentStep === 'focus-energy' && (
        <div className="space-y-8">
          <ScrollTarget
            targetId="focus-question"
            registerScrollTarget={registerScrollTarget}
          >
            <DetailedSelector
              icon={Target}
              options={focusOptions}
              selectedValue={formData.focus}
              onChange={(value) => handleFieldSelection('focus', value, formData, setFormData)}
              question="What's your main goal for this workout?"
            />
          </ScrollTarget>

          <ScrollTarget
            targetId="focus-energy-energy"
            registerScrollTarget={registerScrollTarget}
          >
            <DetailedSelector
              icon={Battery}
              options={energyOptions}
              selectedValue={formData.energy}
              onChange={(value) => handleFieldSelection('energy', value, formData, setFormData)}
              question="How energetic are you feeling today?"
            />
          </ScrollTarget>
        </div>
      )}

      {currentStep === 'duration-equipment' && (
        <div className="space-y-8">
          <ScrollTarget
            targetId="duration-question"
            registerScrollTarget={registerScrollTarget}
          >
            <DetailedSelector
              icon={Clock}
              options={durationOptions}
              selectedValue={formData.duration}
              onChange={(value) => handleFieldSelection('duration', value, formData, setFormData)}
              question="How long do you want your workout to be?"
            />
          </ScrollTarget>

          <ScrollTarget
            targetId="duration-equipment-equipment"
            registerScrollTarget={registerScrollTarget}
          >
            <DetailedSelector
              icon={Dumbbell}
              options={equipmentOptions}
              selectedValue={formData.equipment}
              onChange={(value) => handleFieldSelection('equipment', value, formData, setFormData)}
              question="What equipment do you have available?"
            />
          </ScrollTarget>
        </div>
      )}
    </div>
  );
}
```

### Example 2: User Profile Setup

```typescript
interface UserProfileData {
  name?: string;
  email?: string;
  age?: number;
  primaryGoal?: string;
  experienceLevel?: string;
}

export function UserProfileSetup() {
  const [currentStep, setCurrentStep] = useState('personal-info');
  const [formData, setFormData] = useState<UserProfileData>({});

  const { registerScrollTarget, handleFieldSelection } = useFormAutoScroll<UserProfileData>({
    formId: 'user-profile-setup',
    steps: [
      {
        id: 'personal-info',
        label: 'Personal Information',
        fields: ['name', 'email', 'age'],
        scrollTarget: 'personal-info-section'
      },
      {
        id: 'fitness-goals',
        label: 'Fitness Goals',
        fields: ['primary-goal', 'experience-level'],
        scrollTarget: 'fitness-goals-section'
      }
    ],
    currentStepId: currentStep,
    setCurrentStep,
    isStepComplete: (stepId, data) => {
      if (stepId === 'personal-info') return !!(data.name && data.email && data.age);
      if (stepId === 'fitness-goals') return !!(data.primaryGoal && data.experienceLevel);
      return false;
    },
    getNextStep: (currentStepId) => {
      if (currentStepId === 'personal-info') return 'fitness-goals';
      return null;
    }
  });

  return (
    <div>
      {currentStep === 'personal-info' && (
        <ScrollTarget
          targetId="personal-info-section"
          registerScrollTarget={registerScrollTarget}
          as="section"
          className="space-y-6"
        >
          <h2>Personal Information</h2>
          <TextInput
            label="Full Name"
            value={formData.name}
            onChange={(value) => handleFieldSelection('name', value, formData, setFormData)}
          />
          <EmailInput
            label="Email Address"
            value={formData.email}
            onChange={(value) => handleFieldSelection('email', value, formData, setFormData)}
          />
          <NumberInput
            label="Age"
            value={formData.age}
            onChange={(value) => handleFieldSelection('age', value, formData, setFormData)}
          />
        </ScrollTarget>
      )}

      {currentStep === 'fitness-goals' && (
        <ScrollTarget
          targetId="fitness-goals-section"
          registerScrollTarget={registerScrollTarget}
          as="section"
          className="space-y-6"
        >
          <h2>Fitness Goals</h2>
          <DetailedSelector
            icon={Target}
            options={goalOptions}
            selectedValue={formData.primaryGoal}
            onChange={(value) => handleFieldSelection('primaryGoal', value, formData, setFormData)}
            question="What's your primary fitness goal?"
          />
          <DetailedSelector
            icon={TrendingUp}
            options={experienceOptions}
            selectedValue={formData.experienceLevel}
            onChange={(value) => handleFieldSelection('experienceLevel', value, formData, setFormData)}
            question="What's your fitness experience level?"
          />
        </ScrollTarget>
      )}
    </div>
  );
}
```

## Best Practices

### 1. Consistent Naming Conventions

Use consistent target ID patterns:

- `{stepId}-{fieldId}` for field-specific targets
- `{stepId}-question` for question-focused targets
- `{stepId}-section` for section-focused targets

### 2. Scroll Target Positioning

- Use `scroll-mt-4` or similar classes for proper scroll positioning
- Consider the visual hierarchy when choosing scroll targets
- Test on different screen sizes to ensure proper positioning

### 3. Step Configuration

- Define clear field relationships in `getNextField`
- Use `scrollTarget` in step config for step-level scrolling
- Keep step validation logic simple and predictable

### 4. Error Handling

- **Automatic Error Recovery**: The hook gracefully handles missing scroll targets and invalid configurations
- **Input Validation**: All public methods validate inputs and provide helpful warnings
- **Development Debugging**: Rich debug logging in development mode with context-specific messages
- **Production Safety**: All error conditions are handled without breaking the user experience

### 5. Performance Considerations

- **Memory Management**: Automatic cleanup on component unmount prevents memory leaks
- **Optimized Rendering**: Uses `useCallback` and proper dependency arrays for optimal performance
- **Efficient Lookups**: O(1) scroll target lookup using Map data structure
- **Type Safety**: Full TypeScript generics prevent runtime errors and improve performance

## Migration Guide

### From Manual Ref Management

**Before:**

```typescript
const durationSectionRef = useRef<HTMLDivElement>(null);

// Manual scroll logic
const handleSelection = (key, value) => {
  onChange(key, value);

  if (key === 'energy' && isStepComplete('focus-energy')) {
    setCurrentStep('duration-equipment');
    setTimeout(() => {
      durationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 800);
  }
};

<div ref={durationSectionRef}>
  <DetailedSelector ... />
</div>
```

**After:**

```typescript
// Type-safe configuration with proper error handling
const { registerScrollTarget, handleFieldSelection } = useFormAutoScroll<FormData>({
  formId: 'workout-customization', // Required for debugging and analytics
  // ... other configuration
});

<ScrollTarget
  targetId="duration-question"
  registerScrollTarget={registerScrollTarget}
  className="scroll-mt-4" // Proper scroll positioning
>
  <DetailedSelector
    onChange={(value) => handleFieldSelection('energy', value, formData, setFormData)}
    // ... other props
  />
</ScrollTarget>
```

## Benefits

1. **Consistency**: Same behavior across all forms
2. **Maintainability**: Centralized logic, easy to update
3. **Reusability**: Works with any multi-step form
4. **Type Safety**: Full TypeScript generics with compile-time error checking
5. **Performance**: Optimized with proper memoization and memory management
6. **Accessibility**: Respects user motion preferences
7. **Analytics**: Built-in tracking for user behavior
8. **Testing**: Easy to test with clear interfaces
9. **Error Resilience**: Comprehensive error handling and validation
10. **Developer Experience**: Rich debugging capabilities and helpful warnings

## Production Readiness Features

### Type Safety

- **Generic Support**: `useFormAutoScroll<TFormData>` provides full type inference
- **Strict Typing**: No `any` types, all parameters properly typed
- **Compile-time Validation**: TypeScript catches configuration errors before runtime

### Error Handling

- **Input Validation**: All public methods validate inputs and provide warnings
- **Graceful Degradation**: Missing scroll targets don't break functionality
- **Development Debugging**: Rich console logging with context-specific messages
- **Production Safety**: All errors are caught and handled gracefully

### Performance & Memory

- **Automatic Cleanup**: Scroll targets are cleaned up on component unmount
- **Optimized Rendering**: Proper `useCallback` usage prevents unnecessary re-renders
- **Efficient Data Structures**: Map-based scroll target storage for O(1) lookups
- **Memory Leak Prevention**: Comprehensive cleanup prevents memory leaks

### Developer Experience

- **Comprehensive Documentation**: Full JSDoc comments with examples
- **Debug Logging**: Development-only logging with contextual information
- **Configuration Validation**: Warns about invalid configurations on mount
- **Clear Error Messages**: Helpful error messages with context

This pattern provides a solid, production-ready foundation for implementing auto-scroll functionality across your entire application while maintaining consistency and reducing code duplication.
