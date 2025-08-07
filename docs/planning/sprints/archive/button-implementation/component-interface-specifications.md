# Component Interface Specifications

## Overview

This document defines the interfaces and contracts for components that will integrate with the hybrid button state system, ensuring consistent behavior and clear separation of concerns.

## Core Interfaces

### 1. Button State Interface

```typescript
interface ButtonState {
  className: string;
  disabled: boolean;
  text: string;
  state: 'disabled' | 'partial' | 'active' | 'error' | 'loading';
  visualFeedback?: VisualFeedback;
}

interface VisualFeedback {
  indicatorColor: 'gray' | 'blue' | 'green' | 'red' | 'orange';
  message: string;
  icon?: 'error' | 'warning' | 'info' | 'success';
  progress?: number; // 0-100 percentage
}
```

### 2. Selection State Interface

```typescript
interface StepSelections {
  total: number;
  required: number;
  percentage: number;
  isComplete: boolean;
  isPartial: boolean;
  isEmpty: boolean;
  hasErrors: boolean;
  errorCount: number;
  canProceed: boolean;
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

### 3. Validation State Interface

```typescript
interface ValidationState {
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  touchedFields: Set<keyof PerWorkoutOptions>;
  hasErrors: boolean;
  errorCount: number;
  stepErrors: {
    focusEnergy: string[];
    durationEquipment: string[];
  };
}
```

## Component Specifications

### 1. GeneratePage Component

#### Current Interface

```typescript
// Current props and state
interface GeneratePageState {
  activeTab: 'quick' | 'detailed';
  activeQuickStep: 'focus-energy' | 'duration-equipment';
  perWorkoutOptions: PerWorkoutOptions;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  touchedFields: Set<keyof PerWorkoutOptions>;
  isGenerating: boolean;
}
```

#### Enhanced Interface

```typescript
// Enhanced with hybrid button state system
interface GeneratePageState {
  activeTab: 'quick' | 'detailed';
  activeQuickStep: 'focus-energy' | 'duration-equipment';
  perWorkoutOptions: PerWorkoutOptions;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  touchedFields: Set<keyof PerWorkoutOptions>;
  isGenerating: boolean;
  // New state for hybrid button system
  selectionState: SelectionState;
  validationState: ValidationState;
  buttonState: ButtonState;
}
```

#### Required Methods

```typescript
interface GeneratePageMethods {
  // Selection counting methods
  getFocusEnergySelections(): StepSelections;
  getDurationEquipmentSelections(): StepSelections;
  getCurrentStepSelections(): StepSelections;
  getSelectionState(): SelectionState;

  // Button state methods
  getHybridButtonState(): ButtonState;
  getButtonVisualFeedback(): VisualFeedback;

  // Validation methods
  getValidationState(): ValidationState;
  getStepSpecificErrors(step: string): string[];
  clearErrorsForField(field: keyof PerWorkoutOptions): void;

  // Event handlers
  handlePerWorkoutOptionChange(
    option: keyof PerWorkoutOptions,
    value: unknown
  ): void;
  handleSubmit(e: React.FormEvent): Promise<void>;
}
```

### 2. WorkoutCustomization Component

#### Current Interface

```typescript
interface WorkoutCustomizationProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
  mode?: 'detailed' | 'quick';
  validateFocusAndEnergy?: (values: PerWorkoutOptions) => boolean;
  validateDurationAndEquipment?: (values: PerWorkoutOptions) => boolean;
  touchedFields?: Set<keyof PerWorkoutOptions>;
}
```

#### Enhanced Interface

```typescript
interface WorkoutCustomizationProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
  mode?: 'detailed' | 'quick';
  validateFocusAndEnergy?: (values: PerWorkoutOptions) => boolean;
  validateDurationAndEquipment?: (values: PerWorkoutOptions) => boolean;
  touchedFields?: Set<keyof PerWorkoutOptions>;
  // New props for hybrid button system
  selectionState?: SelectionState;
  validationState?: ValidationState;
  onSelectionChange?: (selections: SelectionState) => void;
  onValidationChange?: (validation: ValidationState) => void;
}
```

#### Required Methods

```typescript
interface WorkoutCustomizationMethods {
  // Step management
  handleStepClick(stepId: string): void;
  canNavigateToStep(stepId: string): boolean;

  // Selection tracking
  trackFieldSelection(field: keyof PerWorkoutOptions, value: unknown): void;
  getStepProgress(stepId: string): number;

  // Error handling
  shouldShowError(field: keyof PerWorkoutOptions): boolean;
  getFieldError(field: keyof PerWorkoutOptions): string | undefined;

  // Visual feedback
  getStepVisualState(stepId: string): StepVisualState;
}
```

### 3. StepIndicator Component

#### Current Interface

```typescript
interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  onStepClick: (stepId: string) => void;
  disabled?: boolean;
  showConnectors?: boolean;
  size?: 'sm' | 'md' | 'lg';
  spacing?: 'compact' | 'normal' | 'spacious';
}

interface Step {
  id: string;
  label: string;
  disabled: boolean;
  hasErrors: boolean;
}
```

#### Enhanced Interface

```typescript
interface StepIndicatorProps {
  steps: EnhancedStep[];
  currentStep: string;
  onStepClick: (stepId: string) => void;
  disabled?: boolean;
  showConnectors?: boolean;
  size?: 'sm' | 'md' | 'lg';
  spacing?: 'compact' | 'normal' | 'spacious';
  // New props for hybrid button system
  selectionState?: SelectionState;
  validationState?: ValidationState;
  showProgress?: boolean;
  showErrorCounts?: boolean;
}

interface EnhancedStep {
  id: string;
  label: string;
  disabled: boolean;
  hasErrors: boolean;
  // New properties
  progress: number; // 0-100
  selectionCount: number;
  requiredCount: number;
  errorCount: number;
  visualState: 'empty' | 'partial' | 'complete' | 'error';
}
```

#### Required Methods

```typescript
interface StepIndicatorMethods {
  // Step state calculation
  getStepProgress(stepId: string): number;
  getStepVisualState(stepId: string): StepVisualState;
  canNavigateToStep(stepId: string): boolean;

  // Visual rendering
  renderStepCircle(step: EnhancedStep): React.ReactNode;
  renderStepConnector(
    fromStep: EnhancedStep,
    toStep: EnhancedStep
  ): React.ReactNode;
  renderStepLabel(step: EnhancedStep): React.ReactNode;
}
```

### 4. Button Component

#### Current Interface

```typescript
// Current button implementation in GeneratePage
interface ButtonProps {
  type: 'submit';
  className: string;
  disabled: boolean;
  children: React.ReactNode;
}
```

#### Enhanced Interface

```typescript
interface HybridButtonProps {
  type: 'submit';
  buttonState: ButtonState;
  onStateChange?: (state: ButtonState) => void;
  showVisualFeedback?: boolean;
  showProgress?: boolean;
  className?: string;
  children?: React.ReactNode;
}
```

#### Required Methods

```typescript
interface HybridButtonMethods {
  // State management
  updateButtonState(newState: ButtonState): void;
  getButtonClassName(): string;
  isDisabled(): boolean;

  // Visual feedback
  renderVisualFeedback(): React.ReactNode;
  renderProgressIndicator(): React.ReactNode;
  renderStateIndicator(): React.ReactNode;

  // Accessibility
  getAriaLabel(): string;
  getAriaDescribedBy(): string;
}
```

## Integration Contracts

### 1. Data Flow Contract

```typescript
interface DataFlowContract {
  // Upward data flow (child to parent)
  onSelectionChange: (selections: SelectionState) => void;
  onValidationChange: (validation: ValidationState) => void;
  onButtonStateChange: (buttonState: ButtonState) => void;

  // Downward data flow (parent to child)
  selectionState: SelectionState;
  validationState: ValidationState;
  buttonState: ButtonState;

  // Bidirectional data flow
  options: PerWorkoutOptions;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
}
```

### 2. Event Handling Contract

```typescript
interface EventHandlingContract {
  // Field change events
  handleFieldChange: (field: keyof PerWorkoutOptions, value: unknown) => void;
  handleFieldBlur: (field: keyof PerWorkoutOptions) => void;
  handleFieldFocus: (field: keyof PerWorkoutOptions) => void;

  // Step navigation events
  handleStepClick: (stepId: string) => void;
  handleStepComplete: (stepId: string) => void;
  handleStepError: (stepId: string, errors: string[]) => void;

  // Form submission events
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleValidationError: (
    errors: Partial<Record<keyof PerWorkoutOptions, string>>
  ) => void;
}
```

### 3. State Management Contract

```typescript
interface StateManagementContract {
  // Selection state management
  updateSelectionState: (selections: Partial<SelectionState>) => void;
  resetSelectionState: () => void;
  getSelectionState: () => SelectionState;

  // Validation state management
  updateValidationState: (validation: Partial<ValidationState>) => void;
  clearValidationErrors: (fields?: (keyof PerWorkoutOptions)[]) => void;
  getValidationState: () => ValidationState;

  // Button state management
  updateButtonState: (buttonState: Partial<ButtonState>) => void;
  calculateButtonState: () => ButtonState;
  getButtonState: () => ButtonState;
}
```

## Component Communication Patterns

### 1. Props Drilling Pattern

```typescript
// Parent component passes state down
<GeneratePage>
  <WorkoutCustomization
    selectionState={selectionState}
    validationState={validationState}
    onSelectionChange={handleSelectionChange}
    onValidationChange={handleValidationChange}
  />
  <HybridButton
    buttonState={buttonState}
    onStateChange={handleButtonStateChange}
  />
</GeneratePage>
```

### 2. Callback Pattern

```typescript
// Child components call parent callbacks
const handleFieldChange = (field: keyof PerWorkoutOptions, value: unknown) => {
  // Update local state
  setPerWorkoutOptions((prev) => ({ ...prev, [field]: value }));

  // Notify parent of changes
  onSelectionChange?.(calculateNewSelectionState());
  onValidationChange?.(calculateNewValidationState());
};
```

### 3. State Synchronization Pattern

```typescript
// Components synchronize state through shared interfaces
useEffect(() => {
  const newSelectionState = getSelectionState();
  const newValidationState = getValidationState();
  const newButtonState = getHybridButtonState();

  setSelectionState(newSelectionState);
  setValidationState(newValidationState);
  setButtonState(newButtonState);
}, [perWorkoutOptions, errors, activeQuickStep]);
```

## Testing Interfaces

### 1. Component Testing Interface

```typescript
interface ComponentTestInterface {
  // Test data
  mockPerWorkoutOptions: PerWorkoutOptions;
  mockErrors: Partial<Record<keyof PerWorkoutOptions, string>>;
  mockSelectionState: SelectionState;
  mockValidationState: ValidationState;
  mockButtonState: ButtonState;

  // Test utilities
  renderComponent(props: Partial<ComponentProps>): RenderResult;
  fireEvent(event: string, element: HTMLElement): void;
  waitForStateChange(): Promise<void>;

  // Assertions
  expectButtonState(expectedState: ButtonState): void;
  expectSelectionState(expectedState: SelectionState): void;
  expectValidationState(expectedState: ValidationState): void;
}
```

### 2. Integration Testing Interface

```typescript
interface IntegrationTestInterface {
  // Test scenarios
  testSelectionProgression(): void;
  testValidationErrorHandling(): void;
  testButtonStateTransitions(): void;
  testStepNavigation(): void;

  // Test utilities
  simulateUserJourney(actions: UserAction[]): Promise<void>;
  verifyComponentState(expectedState: ComponentState): void;
  captureUserInteractions(): UserInteraction[];
}
```

## Performance Considerations

### 1. Memoization Interfaces

```typescript
interface MemoizationInterface {
  // Memoized calculations
  memoizedSelectionState: SelectionState;
  memoizedValidationState: ValidationState;
  memoizedButtonState: ButtonState;

  // Dependency tracking
  selectionDependencies: (keyof PerWorkoutOptions)[];
  validationDependencies: (keyof PerWorkoutOptions)[];
  buttonDependencies: (
    | keyof PerWorkoutOptions
    | 'errors'
    | 'activeQuickStep'
  )[];
}
```

### 2. Optimization Interfaces

```typescript
interface OptimizationInterface {
  // Lazy evaluation
  shouldRecalculateSelections: boolean;
  shouldRecalculateValidation: boolean;
  shouldRecalculateButtonState: boolean;

  // Batch updates
  batchUpdateQueue: UpdateOperation[];
  processBatchUpdates(): void;

  // Performance monitoring
  measureCalculationTime(operation: string): number;
  trackRerenderCount(component: string): number;
}
```

## Implementation Checklist

### Phase 1: Interface Definition

- [ ] Define all core interfaces
- [ ] Create TypeScript type definitions
- [ ] Document component contracts
- [ ] Establish communication patterns

### Phase 2: Component Integration

- [ ] Update existing components with new interfaces
- [ ] Implement required methods
- [ ] Add state management logic
- [ ] Integrate event handling

### Phase 3: Testing Implementation

- [ ] Create test interfaces
- [ ] Implement component tests
- [ ] Add integration tests
- [ ] Performance testing

### Phase 4: Documentation

- [ ] Update component documentation
- [ ] Create usage examples
- [ ] Document best practices
- [ ] Performance guidelines
