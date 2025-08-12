# FormAutoScroll API Reference

## Overview

This document provides the complete technical API reference for the FormAutoScroll system, including all hooks, interfaces, and usage patterns for implementing auto-scroll functionality in multi-step forms.

## 📚 **Hook APIs**

### **useFormAutoScroll**

The main hook that provides universal auto-scroll functionality for form-based interfaces.

#### **Interface**

```typescript
export interface FormStep {
  id: string;
  label: string;
  fields: string[];
  scrollTarget?: string; // Optional specific scroll target within step
}

export interface FormAutoScrollConfig<TFormData = Record<string, unknown>> {
  /** Form identifier for analytics */
  formId: string;
  /** Steps configuration */
  steps: FormStep[];
  /** Current step ID */
  currentStepId: string;
  /** Function to set current step */
  setCurrentStep: (stepId: string) => void;
  /** Function to check if step is complete */
  isStepComplete: (stepId: string, formData: TFormData) => boolean;
  /** Function to get next field within current step */
  getNextField?: (currentField: string, currentStepId: string) => string | null;
  /** Function to get next step after current step */
  getNextStep?: (currentStepId: string) => string | null;
  /** Custom timing overrides */
  timing?: {
    initialDelay?: number;
    stepAdvanceDelay?: number;
    stepScrollDelay?: number;
  };
  /** Custom scroll behavior */
  scrollBehavior?: {
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  };
}

export interface FormAutoScrollReturn<TFormData = Record<string, unknown>> {
  /** Register a scroll target for a field or step */
  registerScrollTarget: (targetId: string, element: HTMLElement | null) => void;
  /** Handle field selection with auto-scroll logic */
  handleFieldSelection: (
    fieldId: string,
    value: unknown,
    formData: TFormData,
    onFieldChange: (fieldId: string, value: unknown) => void
  ) => void;
  /** Manually trigger scroll to a target */
  scrollToTarget: (targetId: string) => void;
  /** Get current scroll targets */
  getScrollTargets: () => Map<string, HTMLElement>;
  /** Clear all scroll targets */
  clearScrollTargets: () => void;
}
```

#### **Usage Examples**

```typescript
// Basic multi-step form configuration
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
  }
});

// In your component:
<div ref={(el) => registerScrollTarget('duration-question', el)}>
  <h3>How long do you want your workout to be?</h3>
</div>

// Handle selection:
handleFieldSelection('energy', 5, formData, setFormData);
```

---

### **useAutoScroll**

Atomic hook for basic scroll triggering functionality.

#### **Interface**

```typescript
export interface AutoScrollConfig {
  /** Whether auto-scroll is enabled */
  enabled?: boolean;
  /** Delay before triggering scroll (ms) */
  delay?: number;
  /** Context for analytics tracking */
  trackingContext?: string;
  /** Custom scroll behavior */
  scrollBehavior?: {
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  };
}

export interface AutoScrollReturn {
  /** Trigger scroll to an element */
  triggerAutoScroll: (element: HTMLElement) => void;
  /** Check if auto-scroll is enabled */
  isEnabled: boolean;
}
```

#### **Usage Examples**

```typescript
// Basic usage
const { triggerAutoScroll } = useAutoScroll({
  enabled: true,
  delay: 100,
  trackingContext: 'WorkoutCustomization'
});

// Trigger scroll
const element = document.querySelector('.next-field');
if (element) {
  triggerAutoScroll(element);
}
```

---

### **useAutoScrollTiming**

Atomic hook for coordinating timing sequences in auto-scroll operations.

#### **Interface**

```typescript
export interface AutoScrollTimingConfig {
  /** Custom timing overrides */
  timing?: {
    initialDelay?: number;
    stepAdvanceDelay?: number;
    stepScrollDelay?: number;
  };
}

export interface AutoScrollTimingReturn {
  /** Schedule a sequence of auto-scroll operations */
  scheduleAutoScrollSequence: (sequence: {
    initial?: () => void;
    stepAdvance?: () => void;
    stepScroll?: () => void;
  }) => void;
}
```

#### **Usage Examples**

```typescript
// Advanced timing coordination
const { scheduleAutoScrollSequence } = useAutoScrollTiming({
  timing: {
    initialDelay: 100,
    stepAdvanceDelay: 800,
    stepScrollDelay: 100
  }
});

// Schedule complex sequence
scheduleAutoScrollSequence({
  initial: () => {
    console.log('Starting auto-scroll sequence');
  },
  stepAdvance: () => {
    setCurrentStep(nextStep);
  },
  stepScroll: () => {
    scrollToTarget(nextStepTarget);
  }
});
```

---

### **useAutoScrollPreferences**

Atomic hook for managing user preferences for auto-scroll functionality.

#### **Interface**

```typescript
export interface AutoScrollPreferencesReturn {
  /** Whether auto-scroll is enabled */
  enabled: boolean;
  /** Toggle auto-scroll on/off */
  toggle: () => void;
  /** Set auto-scroll enabled state */
  setEnabled: (enabled: boolean) => void;
}
```

#### **Usage Examples**

```typescript
// User preference management
const { enabled, toggle, setEnabled } = useAutoScrollPreferences();

// Check if auto-scroll should be used
if (enabled) {
  triggerAutoScroll(element);
}

// Toggle user preference
<button onClick={toggle}>
  {enabled ? 'Disable' : 'Enable'} Auto-Scroll
</button>
```

## 🎯 **Integration Patterns**

### **Multi-Step Form Pattern**

```typescript
// Form state management
const [currentStep, setCurrentStep] = useState('focus-energy');
const [formData, setFormData] = useState({});

// Auto-scroll configuration
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
  }
});

// Component usage
<div ref={(el) => registerScrollTarget('focus-question', el)}>
  <h3>What's your workout focus?</h3>
  <DetailedSelector
    options={focusOptions}
    selectedValue={formData.focus}
    onChange={(value) => handleFieldSelection('focus', value, formData, setFormData)}
  />
</div>
```

### **Navigation-Triggered Scroll Pattern**

```typescript
// Simple navigation-triggered scroll (like Profile module)
const { enabled: autoScrollEnabled } = useAutoScrollPreferences();

const handleCardSelection = (selected: SelectableItem) => {
  // Navigate immediately
  navigate(`/dashboard/profile/${selected.id}`);
  
  // Simple auto-scroll after navigation
  if (autoScrollEnabled) {
    setTimeout(() => {
      const firstPrompt = document.querySelector('[data-scroll-target="first-prompt"]');
      if (firstPrompt) {
        firstPrompt.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  }
};
```

### **Conditional Rendering Pattern**

```typescript
// Only register scroll targets when needed
{currentStep === 'focus-energy' && (
  <div ref={(el) => registerScrollTarget('energy-question', el)}>
    <h3>What's your energy level?</h3>
    <DetailedSelector
      options={energyOptions}
      selectedValue={formData.energy}
      onChange={(value) => handleFieldSelection('energy', value, formData, setFormData)}
    />
  </div>
)}
```

## 🔧 **Type Safety**

### **Generic Type Support**

```typescript
// FormAutoScroll supports any data type
const { handleFieldSelection } = useFormAutoScroll<WorkoutFormData>({
  formId: 'workout-customization',
  // ... other config
});

// Type-safe field selection
handleFieldSelection('energy', 5, formData, setFormData);
```

### **Interface Segregation**

```typescript
// Clear separation of concerns
interface FormAutoScrollConfig<TFormData> {
  // Core functionality
  formId: string;
  steps: FormStep[];
  currentStepId: string;
  
  // Business logic
  setCurrentStep: (stepId: string) => void;
  isStepComplete: (stepId: string, formData: TFormData) => boolean;
  
  // Optional enhancements
  getNextField?: (currentField: string, currentStepId: string) => string | null;
  getNextStep?: (currentStepId: string) => string | null;
  
  // Customization
  timing?: AutoScrollTimingConfig;
  scrollBehavior?: ScrollBehaviorConfig;
}
```

## 📊 **Testing Patterns**

### **Unit Test Structure**

```typescript
describe('useFormAutoScroll', () => {
  const defaultConfig = {
    formId: 'test-form',
    steps: [
      { id: 'step1', label: 'Step 1', fields: ['field1', 'field2'] }
    ],
    currentStepId: 'step1',
    setCurrentStep: vi.fn(),
    isStepComplete: vi.fn().mockReturnValue(false)
  };

  describe('Field Selection', () => {
    it('should handle field selection with auto-scroll', () => {
      const { result } = renderHook(() => useFormAutoScroll(defaultConfig));
      
      const onFieldChange = vi.fn();
      result.current.handleFieldSelection('field1', 'value', {}, onFieldChange);
      
      expect(onFieldChange).toHaveBeenCalledWith('field1', 'value');
    });
  });
});
```

### **Mock Data Pattern**

```typescript
const mockFormData = {
  focus: 'strength',
  energy: 5,
  duration: 30,
  equipment: ['dumbbells']
};

const mockSteps = [
  { id: 'focus-energy', label: 'Focus & Energy', fields: ['focus', 'energy'] },
  { id: 'duration-equipment', label: 'Duration & Equipment', fields: ['duration', 'equipment'] }
];
```

## 🎨 **Styling Reference**

### **Scroll Target Classes**

```css
/* Scroll margin for better positioning */
.scroll-mt-4

/* Focus indicators for accessibility */
.focus-within:ring-2.focus-within:ring-primary.focus-within:ring-opacity-50

/* Data attributes for targeting */
[data-scroll-target="first-prompt"]
```

### **Component Styling**

```css
/* Smooth scroll behavior */
scroll-behavior: smooth

/* Scroll positioning */
scroll-margin-top: 1rem

/* Focus management */
outline: none
```

## 🚀 **Performance Considerations**

### **Conditional Registration**

```typescript
// Only register when component is mounted and visible
useEffect(() => {
  if (isVisible && elementRef.current) {
    registerScrollTarget(targetId, elementRef.current);
  }
  
  return () => {
    registerScrollTarget(targetId, null);
  };
}, [isVisible, targetId, registerScrollTarget]);
```

### **State Management**

```typescript
// Efficient state updates
const handleFieldSelection = useCallback((
  fieldId: string,
  value: unknown,
  formData: TFormData,
  onFieldChange: (fieldId: string, value: unknown) => void
) => {
  // Update field immediately
  onFieldChange(fieldId, value);
  
  // Schedule auto-scroll sequence
  scheduleAutoScrollSequence({
    initial: () => checkNextAction(),
    stepAdvance: () => advanceStep(),
    stepScroll: () => scrollToTarget()
  });
}, [scheduleAutoScrollSequence]);
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Scroll Target Not Found**

```typescript
// Ensure target is registered before use
useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (elementRef.current) {
      registerScrollTarget('my-target', elementRef.current);
    }
  }, 50);
  
  return () => {
    clearTimeout(timeoutId);
    registerScrollTarget('my-target', null);
  };
}, [registerScrollTarget]);
```

#### **Timing Issues**

```typescript
// Use proper timing configuration
const { scheduleAutoScrollSequence } = useAutoScrollTiming({
  timing: {
    initialDelay: 100,    // Wait for DOM updates
    stepAdvanceDelay: 800, // Wait for state changes
    stepScrollDelay: 100   // Wait for new content
  }
});
```

#### **TypeScript Errors**

```typescript
// Ensure proper generic types
const { handleFieldSelection } = useFormAutoScroll<MyFormData>({
  formId: 'my-form',
  // ... other config
});

// Use type-safe field names
handleFieldSelection('fieldName', value, formData, setFormData);
```

### **Debug Patterns**

```typescript
// Add console logging for debugging
if (import.meta.env.DEV) {
  console.debug(`${formId}: Field ${fieldId} selected with value:`, value);
}

// Check scroll targets
const scrollTargets = getScrollTargets();
console.log('Available scroll targets:', Array.from(scrollTargets.keys()));
```

## 📝 **Migration Guide**

### **From Manual Scroll Implementation**

```typescript
// Before (manual implementation)
const handleSelection = (value: string) => {
  setFormData(prev => ({ ...prev, field: value }));
  
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

### **Adding Auto-Scroll to Existing Forms**

```typescript
// 1. Import hook
import { useFormAutoScroll } from '@/hooks/useFormAutoScroll';

// 2. Configure auto-scroll
const { registerScrollTarget, handleFieldSelection } = useFormAutoScroll({
  formId: 'my-form',
  steps: [{ id: 'step1', label: 'Step 1', fields: ['field1', 'field2'] }],
  currentStepId: 'step1',
  setCurrentStep: () => {},
  isStepComplete: () => false
});

// 3. Register scroll targets
<div ref={(el) => registerScrollTarget('field1', el)}>
  <input onChange={(e) => handleFieldSelection('field1', e.target.value, formData, setFormData)} />
</div>

// 4. Handle field changes
const handleChange = (fieldId: string, value: string) => {
  handleFieldSelection(fieldId, value, formData, setFormData);
};
```

This API reference provides complete technical documentation for implementing and using the FormAutoScroll system in your React applications.
