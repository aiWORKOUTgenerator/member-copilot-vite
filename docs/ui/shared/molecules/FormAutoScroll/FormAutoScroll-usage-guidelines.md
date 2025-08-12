# FormAutoScroll Usage Guidelines

## Overview

The FormAutoScroll system provides a flexible, hook-based approach to implementing auto-scroll functionality across different types of forms and user interactions. It's designed to handle various use cases from complex multi-step forms to simple navigation-triggered scrolls.

For convenience, we provide:

- **`useFormAutoScroll`** - Universal hook for multi-step form auto-scroll functionality
- **`useAutoScroll`** - Atomic hook for basic scroll triggering
- **`useAutoScrollTiming`** - Atomic hook for timing coordination
- **`useAutoScrollPreferences`** - Atomic hook for user preference management

## When to Use Each Pattern

### Multi-Step Form Auto-Scroll

**Use when:**

- Complex forms with multiple steps and field-to-field navigation
- Forms that need automatic progression between steps
- When you want consistent auto-scroll behavior across all form fields
- Training or onboarding flows where guided progression is important
- Forms with validation that should trigger auto-advance

**Example use cases:**

- Workout customization with focus, energy, duration, and equipment steps
- User onboarding with multiple profile setup steps
- Complex configuration forms with interdependent fields
- Multi-step wizards with automatic progression

### Navigation-Triggered Scroll

**Use when:**

- Simple navigation between pages or sections
- Card-based selection interfaces
- When you want immediate navigation with delayed scroll
- Mobile interfaces where space is limited
- Quick selection workflows where speed is prioritized

**Example use cases:**

- Profile attribute type selection (like our Profile module)
- Dashboard navigation between sections
- Mobile navigation between workout types
- Quick equipment selection for familiar users

### Conditional Auto-Scroll

**Use when:**

- Auto-scroll should only work in certain modes or conditions
- User preferences should control auto-scroll behavior
- A/B testing different scroll behaviors
- Gradual migration scenarios
- Specific UX requirements that don't fit standard patterns

**Example use cases:**

- Quick vs. detailed mode in workout customization
- User preference-based auto-scroll control
- Mobile vs. desktop different behaviors
- Accessibility considerations

### Custom Timing Configuration

**Use when:**

- Forms need specific timing for auto-scroll sequences
- Complex animations require precise coordination
- Different devices need different timing
- Performance optimization requires custom delays
- Accessibility requirements need specific timing

**Example use cases:**

- Complex forms with heavy DOM updates
- Mobile devices with slower rendering
- Accessibility tools that need specific timing
- Performance-critical applications

## Decision Matrix

| Scenario                              | Recommended Pattern                        | Reasoning                                         |
| ------------------------------------- | ------------------------------------------ | ------------------------------------------------- |
| Multi-step form with field navigation | `useFormAutoScroll`                        | Handles complex form progression automatically    |
| Simple navigation between pages       | Navigation-Triggered Scroll                | Simple, direct approach with immediate navigation |
| User preference control               | Conditional Auto-Scroll                    | Respects user choices and accessibility needs     |
| Complex timing requirements           | Custom Timing Configuration                | Provides precise control over scroll timing       |
| Mobile-specific behavior              | Custom Scroll Behavior                     | Optimized for mobile interaction patterns         |
| Quick selection workflows             | Navigation-Triggered Scroll                | Prioritizes speed and immediate feedback          |
| Training/onboarding flows             | `useFormAutoScroll`                        | Provides guided progression through steps         |
| Mixed requirements                    | Conditional Auto-Scroll with custom timing | Combines multiple patterns for complex needs      |

## Performance Considerations

### Bundle Size Impact

- **Minimal**: The hook system adds only a few bytes to the bundle
- **Tree-shakeable**: Unused hooks can be eliminated
- **No duplication**: Single implementation handles all patterns

### Runtime Performance

- **Efficient rendering**: Scroll targets are registered only when needed
- **Optimized timing**: Uses `setTimeout` and `requestAnimationFrame` appropriately
- **Memory efficient**: Proper cleanup prevents memory leaks

### Memory Usage

- **Low overhead**: Minimal state management
- **Clean data flow**: No intermediate data transformations
- **Proper cleanup**: Scroll targets are unregistered on unmount

## Accessibility Features

### User Preference Respect

- **Auto-scroll toggle**: Users can disable auto-scroll globally
- **Reduced motion**: Respects `prefers-reduced-motion` media query
- **Keyboard navigation**: Works with keyboard-only navigation
- **Screen reader support**: Proper ARIA attributes and announcements

### Visual Design

- **Smooth animations**: Uses `scroll-behavior: smooth` for natural feel
- **Focus management**: Maintains proper focus order during scroll
- **High contrast**: Works with high contrast themes
- **Consistent timing**: Predictable scroll behavior

## Usage Examples

### Multi-Step Form Example

```typescript
// Complete multi-step form implementation
import { useFormAutoScroll } from '@/hooks/useFormAutoScroll';
import { useAutoScrollPreferences } from '@/hooks/useAutoScrollPreferences';

function WorkoutCustomization() {
  const [currentStep, setCurrentStep] = useState('focus-energy');
  const [formData, setFormData] = useState({});
  const { enabled: autoScrollEnabled } = useAutoScrollPreferences();

  const { registerScrollTarget, handleFieldSelection } = useFormAutoScroll({
    formId: 'workout-customization',
    steps: [
      { id: 'focus-energy', label: 'Focus & Energy', fields: ['focus', 'energy'] },
      { id: 'duration-equipment', label: 'Duration & Equipment', fields: ['duration', 'equipment'] }
    ],
    currentStepId: currentStep,
    setCurrentStep: setCurrentStep,
    isStepComplete: (stepId, data) => {
      if (stepId === 'focus-energy') return data.focus && data.energy;
      if (stepId === 'duration-equipment') return data.duration && data.equipment;
      return false;
    },
    enabled: autoScrollEnabled
  });

  return (
    <div>
      {currentStep === 'focus-energy' && (
        <>
          <div ref={(el) => registerScrollTarget('focus-question', el)}>
            <h3>What's your workout focus?</h3>
            <DetailedSelector
              options={focusOptions}
              selectedValue={formData.focus}
              onChange={(value) => handleFieldSelection('focus', value, formData, setFormData)}
            />
          </div>

          <div ref={(el) => registerScrollTarget('energy-question', el)}>
            <h3>What's your energy level?</h3>
            <DetailedSelector
              options={energyOptions}
              selectedValue={formData.energy}
              onChange={(value) => handleFieldSelection('energy', value, formData, setFormData)}
            />
          </div>
        </>
      )}

      {currentStep === 'duration-equipment' && (
        <>
          <div ref={(el) => registerScrollTarget('duration-question', el)}>
            <h3>How long do you want your workout to be?</h3>
            <DetailedSelector
              options={durationOptions}
              selectedValue={formData.duration}
              onChange={(value) => handleFieldSelection('duration', value, formData, setFormData)}
            />
          </div>

          <div ref={(el) => registerScrollTarget('equipment-question', el)}>
            <h3>What equipment do you have?</h3>
            <DetailedSelector
              options={equipmentOptions}
              selectedValue={formData.equipment}
              onChange={(value) => handleFieldSelection('equipment', value, formData, setFormData)}
            />
          </div>
        </>
      )}
    </div>
  );
}
```

### Navigation-Triggered Scroll Example

```typescript
// Simple navigation-triggered scroll implementation
import { useAutoScrollPreferences } from '@/hooks/useAutoScrollPreferences';
import { useAnalytics } from '@/hooks/useAnalytics';

function ProfileContainer() {
  const { enabled: autoScrollEnabled } = useAutoScrollPreferences();
  const analytics = useAnalytics();

  const handleCardSelection = (selected: SelectableItem) => {
    analytics.track('Profile Attribute Card Selected', {
      attributeTypeId: selected.id,
      attributeTypeName: selected.title,
      autoScrollEnabled,
    });

    navigate(`/dashboard/profile/${selected.id}`);

    if (autoScrollEnabled) {
      setTimeout(() => {
        const firstPrompt = document.querySelector('[data-scroll-target="first-prompt"]');
        if (firstPrompt) {
          firstPrompt.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  };

  return (
    <RadioGroupOfCards
      items={attributeTypes}
      onChange={handleCardSelection}
      legend="Choose an attribute type"
    />
  );
}
```

### Conditional Auto-Scroll Example

```typescript
// Conditional auto-scroll implementation
function ConditionalAutoScroll() {
  const [mode, setMode] = useState<'quick' | 'detailed'>('quick');
  const { enabled: autoScrollEnabled } = useAutoScrollPreferences();

  // Only use auto-scroll in quick mode
  const { registerScrollTarget, handleFieldSelection } = useFormAutoScroll({
    formId: 'conditional-form',
    steps: formSteps,
    currentStepId: currentStep,
    setCurrentStep: setCurrentStep,
    isStepComplete: (stepId, data) => isStepComplete(stepId, data),
    enabled: mode === 'quick' && autoScrollEnabled
  });

  return (
    <div>
      <SimpleDetailedViewSelector
        value={mode}
        onChange={setMode}
        labels={{ quick: 'Quick', detailed: 'Detailed' }}
      />

      {mode === 'quick' ? (
        // Auto-scroll enabled
        <div ref={(el) => registerScrollTarget('field1', el)}>
          <input onChange={(e) => handleFieldSelection('field1', e.target.value, formData, setFormData)} />
        </div>
      ) : (
        // Auto-scroll disabled
        <div>
          <input onChange={(e) => setFormData(prev => ({ ...prev, field1: e.target.value }))} />
        </div>
      )}
    </div>
  );
}
```

### Custom Timing Example

```typescript
// Custom timing configuration
const { registerScrollTarget, handleFieldSelection } = useFormAutoScroll({
  formId: 'complex-form',
  steps: complexSteps,
  currentStepId: currentStep,
  setCurrentStep: setCurrentStep,
  isStepComplete: (stepId, data) => isStepComplete(stepId, data),
  timing: {
    initialDelay: 200, // Wait longer for complex forms
    stepAdvanceDelay: 1000, // Longer delay for step transitions
    stepScrollDelay: 200, // Longer scroll delay
  },
  scrollBehavior: {
    block: 'center', // Center the element
    inline: 'nearest', // Minimal horizontal scroll
  },
});
```

## Migration Guide

### From Manual Scroll Implementation

```typescript
// Before (manual implementation)
const handleSelection = (value: string) => {
  setFormData((prev) => ({ ...prev, field: value }));

  setTimeout(() => {
    const nextField = document.querySelector('.next-field');
    if (nextField) {
      nextField.scrollIntoView({ behavior: 'smooth' });
    }
  }, 500);
};

// After (useFormAutoScroll)
const { handleFieldSelection } = useFormAutoScroll(config);

const handleSelection = (value: string) => {
  handleFieldSelection('field', value, formData, setFormData);
};
```

### From Existing Form Components

```typescript
// Before (existing form)
function ExistingForm() {
  const [formData, setFormData] = useState({});

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <input onChange={(e) => handleChange('field1', e.target.value)} />
      <input onChange={(e) => handleChange('field2', e.target.value)} />
    </div>
  );
}

// After (with auto-scroll)
function EnhancedForm() {
  const [formData, setFormData] = useState({});

  const { registerScrollTarget, handleFieldSelection } = useFormAutoScroll({
    formId: 'enhanced-form',
    steps: [{ id: 'step1', label: 'Step 1', fields: ['field1', 'field2'] }],
    currentStepId: 'step1',
    setCurrentStep: () => {},
    isStepComplete: () => false
  });

  return (
    <div>
      <div ref={(el) => registerScrollTarget('field1', el)}>
        <input onChange={(e) => handleFieldSelection('field1', e.target.value, formData, setFormData)} />
      </div>
      <div ref={(el) => registerScrollTarget('field2', el)}>
        <input onChange={(e) => handleFieldSelection('field2', e.target.value, formData, setFormData)} />
      </div>
    </div>
  );
}
```

## Best Practices

### 1. Choose the Right Pattern

- Start with the simplest pattern that meets your needs
- Use `useFormAutoScroll` for complex multi-step forms
- Use Navigation-Triggered Scroll for simple navigation
- Use Conditional Auto-Scroll for user preference control

### 2. Respect User Preferences

- Always check `useAutoScrollPreferences` before implementing auto-scroll
- Provide a way for users to disable auto-scroll
- Respect accessibility settings like `prefers-reduced-motion`

### 3. Optimize Performance

- Only register scroll targets when needed
- Use conditional rendering to prevent unnecessary registrations
- Clean up scroll targets on component unmount

### 4. Test User Experience

- Test auto-scroll behavior with real users
- Measure completion rates and time to completion
- Gather feedback on scroll timing and behavior

### 5. Consider Context

- Match pattern to user expertise level
- Adapt to device and screen size
- Align with overall application design patterns

### 6. Use Named Constants

- Always use `AUTO_SCROLL_CONFIG.timing.*` instead of magic numbers
- Import configuration from `@/config/autoScroll`
- Document timing choices with clear comments
- Maintain consistency across similar use cases

## Common Patterns

### Quick Setup Flow

```typescript
// Step 1: Multi-step form for first-time users
const { registerScrollTarget, handleFieldSelection } = useFormAutoScroll({
  formId: 'quick-setup',
  steps: [
    { id: 'goals', label: 'Goals', fields: ['focus', 'energy'] },
    {
      id: 'preferences',
      label: 'Preferences',
      fields: ['duration', 'equipment'],
    },
  ],
  // ... other config
});

// Step 2: Simple navigation for subsequent selections
const handleQuickSelection = (selected: SelectableItem) => {
  navigate(`/quick/${selected.id}`);
  // Simple auto-scroll after navigation
};
```

### Responsive Design

```typescript
// Desktop: Full auto-scroll functionality
const { registerScrollTarget, handleFieldSelection } = useFormAutoScroll({
  formId: 'responsive-form',
  // ... full config
});

// Mobile: Simplified navigation scroll
const handleMobileSelection = (selected: SelectableItem) => {
  navigate(`/mobile/${selected.id}`);
  // Simple scroll with mobile-optimized timing
};
```

### Progressive Enhancement

```typescript
// Basic functionality without auto-scroll
const handleBasicChange = (field: string, value: any) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};

// Enhanced with auto-scroll when available
const { enabled: autoScrollEnabled } = useAutoScrollPreferences();

if (autoScrollEnabled) {
  const { handleFieldSelection } = useFormAutoScroll(config);
  // Use enhanced functionality
} else {
  // Use basic functionality
}
```

## Troubleshooting

### Common Issues

**Q: Auto-scroll isn't working**
A: Check if `useAutoScrollPreferences` returns `enabled: true` and ensure scroll targets are properly registered.

**Q: Scroll timing feels off**
A: Adjust the timing configuration in `useFormAutoScroll` or use custom timing with `useAutoScrollTiming`.

**Q: Scroll targets aren't found**
A: Ensure scroll targets are registered before auto-scroll is triggered, and use proper cleanup in useEffect.

**Q: Performance seems slow**
A: Use conditional rendering to only register scroll targets when needed, and ensure proper cleanup.

**Q: Auto-scroll interferes with user interaction**
A: Respect user preferences and provide a way to disable auto-scroll.

**Q: TypeScript errors with generic types**
A: Ensure proper generic type parameters are passed to `useFormAutoScroll<TFormData>`.

**Q: Scroll behavior is inconsistent**
A: Use consistent scroll behavior configuration across all auto-scroll implementations.

### Debug Tips

1. **Check user preferences**: Verify `useAutoScrollPreferences` returns the expected value
2. **Verify scroll targets**: Use browser dev tools to check if scroll targets are registered
3. **Test timing**: Add console logs to verify timing sequences
4. **Monitor performance**: Use React DevTools to check for unnecessary re-renders

## Future Enhancements

### Planned Features

- Animation support for scroll transitions
- Scroll history and back navigation
- Global auto-scroll configuration
- Enhanced mobile touch interactions
- Additional scroll target identification methods
- Performance monitoring and analytics
- Enhanced accessibility features
- Custom scroll animations
- Scroll state persistence
- Advanced timing coordination

### Contributing

When adding new features:

- Maintain backward compatibility
- Add comprehensive tests
- Update documentation
- Consider performance implications
- Follow the established atomic design patterns
- Respect user preferences and accessibility
