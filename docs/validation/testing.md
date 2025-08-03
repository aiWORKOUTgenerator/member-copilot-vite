# 🧪 Validation Testing Guide

## Overview
This document outlines the testing strategy for the validation system, including unit tests, integration tests, and test coverage requirements.

## Test Structure

### Unit Tests

#### 1. Selection Counter Tests
```typescript
describe("SelectionCounter", () => {
  describe("getFieldSelectionState", () => {
    it("validates energy level within range", () => {
      const validState = SelectionCounter.getFieldSelectionState("customization_energy", 4);
      expect(validState.isValid).toBe(true);
      expect(validState.hasValue).toBe(true);
      expect(validState.errorMessage).toBeUndefined();
    });
  });
});
```

#### 2. Validation Logic Tests
```typescript
describe("ValidationLogic", () => {
  it("shows error for partial selection", () => {
    const errors = generateValidationErrors({
      customization_focus: "energizing_boost"
    });
    expect(errors.customization_energy).toBe(VALIDATION_MESSAGES.ENERGY_REQUIRED);
  });
});
```

### Integration Tests

#### 1. Form Flow Tests
```typescript
describe("Form Validation Flow", () => {
  it("progresses through steps correctly", () => {
    render(<WorkoutCustomization {...defaultProps} />);
    
    // Step 1: Focus & Energy
    userEvent.click(getByText("Energizing Boost"));
    expect(screen.getByText(VALIDATION_MESSAGES.ENERGY_REQUIRED)).toBeInTheDocument();
    
    userEvent.click(getByText("High Energy"));
    expect(screen.queryByText(VALIDATION_MESSAGES.ENERGY_REQUIRED)).not.toBeInTheDocument();
  });
});
```

#### 2. Error State Tests
```typescript
describe("Error State Management", () => {
  it("clears errors on valid selection", () => {
    // Test implementation
  });
});
```

## Test Coverage Requirements

### Required Coverage Areas
1. **Field Validation**
   - Range validation
   - Required field validation
   - Format validation

2. **Step Validation**
   - Step completion
   - Step transition
   - Error persistence

3. **User Interactions**
   - Selection handling
   - Error display
   - Error clearing

### Coverage Targets
- Lines: > 90%
- Branches: > 85%
- Functions: > 95%
- Statements: > 90%

## Test Data

### Valid Test Cases
```typescript
const validTestCases = {
  focus: "energizing_boost",
  energy: 4,
  duration: 30,
  equipment: "bodyweight"
};
```

### Invalid Test Cases
```typescript
const invalidTestCases = {
  energy: 0,  // Below range
  duration: 60,  // Above range
  equipment: "",  // Empty string
};
```

## Running Tests

### Unit Tests
```bash
# Run validation tests
npm test src/modules/dashboard/workouts/__tests__/selectionCountingLogic.test.ts

# Run with coverage
npm test -- --coverage
```

### Integration Tests
```bash
# Run all workout tests
npm test src/modules/dashboard/workouts/__tests__/
```

## Test Environment Setup

### Jest Configuration
```typescript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
```

### Test Utilities
```typescript
// test-utils.ts
export const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <ValidationProvider>{children}</ValidationProvider>
    ),
  });
};
```

## Mocking Strategy

### Service Mocks
```typescript
vi.mock("@/services/validation", () => ({
  validateField: vi.fn(),
  validateStep: vi.fn(),
}));
```

### Component Mocks
```typescript
vi.mock("@/components/ValidationMessage", () => ({
  ValidationMessage: ({ message }: { message: string }) => (
    <div data-testid="validation-message">{message}</div>
  ),
}));
```

## Debugging Tests

### Common Issues
1. **Async Validation**
   - Use `await` with async validation
   - Wait for error messages
   - Check state updates

2. **Component Updates**
   - Use `act()` for state changes
   - Wait for re-renders
   - Check cleanup

### Debug Tools
```typescript
// Add debug logs
console.log("Validation State:", result);
screen.debug();
```