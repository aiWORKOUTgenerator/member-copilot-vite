# Phase 2 Implementation Guide: Testing Foundation

**Priority:** Next Sprint (2-3 days)  
**Estimated Time:** 3-4 days  
**Impact:** High - Will catch 90% of issues and provide confidence in refactoring

## Overview

Phase 2 builds on the solid foundation established in Phase 1, focusing on comprehensive testing to catch the remaining 20% of issues. This phase implements unit tests, integration tests, and improves test coverage to reach our 80% threshold.

## Prerequisites

✅ **Phase 1 Complete**: All Phase 1 components must be working

- ESLint with accessibility rules
- Prettier formatting
- TypeScript strict checking
- Basic test setup with Vitest
- Husky hooks with lint-staged and commitlint
- Verify scripts working

## Quick Start Implementation

### Step 1: Analyze Current Test Coverage (30 minutes)

```bash
# Run coverage report to see current state
npm run test:run -- --coverage

# Expected: Very low coverage (likely <10%)
# This gives us a baseline to work from
```

### Step 2: Create Test Infrastructure (1 hour)

```bash
# Create comprehensive test directory structure
mkdir -p src/__tests__/{components,hooks,services,utils,modules}
mkdir -p src/__mocks__  # For Vitest auto-mocking

# Create test utilities
cat > src/__tests__/utils/test-utils.ts << 'EOF'
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Data-driven test helpers
export const createTestCases = <T extends Record<string, any>>(
  testCases: Array<{ name: string; input: T; expected: any }>
) => testCases;

export const runTestCases = <T extends Record<string, any>>(
  testCases: Array<{ name: string; input: T; expected: any }>,
  testFn: (input: T, expected: any) => void
) => {
  testCases.forEach(({ name, input, expected }) => {
    it(name, () => testFn(input, expected));
  });
};
EOF

# Create mock factories with auto-mocking support
cat > src/__tests__/utils/mock-factories.ts << 'EOF'
import { vi } from 'vitest';

// Mock data factories for consistent test data
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  ...overrides,
});

export const createMockTrainerPersona = (overrides = {}) => ({
  id: 'persona-123',
  name: 'Test Trainer',
  personality: 'Motivational',
  specialties: ['Strength Training'],
  ...overrides,
});

export const createMockWorkout = (overrides = {}) => ({
  id: 'workout-123',
  title: 'Test Workout',
  duration: 30,
  exercises: [],
  ...overrides,
});

// Mock service functions
export const mockApiService = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

export const mockAuthService = {
  isSignedIn: true,
  isLoaded: true,
  user: createMockUser(),
};

// Auto-mock configurations for common patterns
export const createHookTestCases = (hookName: string) => ({
  loading: {
    name: `${hookName} - loading state`,
    mockReturn: { isLoading: true, isLoaded: false, error: null },
  },
  error: {
    name: `${hookName} - error state`,
    mockReturn: { isLoading: false, isLoaded: true, error: new Error('Test error') },
  },
  success: {
    name: `${hookName} - success state`,
    mockReturn: { isLoading: false, isLoaded: true, error: null },
  },
});
EOF

# Create auto-mocks for common modules
cat > src/__mocks__/hooks.ts << 'EOF'
import { vi } from 'vitest';

// Auto-mock all hooks
export const useAuth = vi.fn(() => ({
  isSignedIn: true,
  isLoaded: true,
  user: { id: 'user-123', email: 'test@example.com' },
}));

export const useAnalytics = vi.fn(() => ({
  track: vi.fn(),
  identify: vi.fn(),
  page: vi.fn(),
}));

export const useApiService = vi.fn(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));
EOF
```

### Step 3: Implement Critical Hook Tests (2 hours)

```bash
# Create comprehensive hook tests with data-driven approach
cat > src/__tests__/hooks/useTrainerPersona.test.ts << 'EOF'
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTrainerPersona } from '@/hooks/useTrainerPersona';
import { createMockTrainerPersona, createHookTestCases } from '../utils/mock-factories';

// Auto-mock the context (Vitest will pick this up from __mocks__)
vi.mock('@/contexts/TrainerPersonaContext');

describe('useTrainerPersona', () => {
  const mockContext = vi.mocked(require('@/contexts/TrainerPersonaContext'));

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation
    mockContext.TrainerPersonaContext.Consumer.mockImplementation(({ children }) => children({
      trainerPersona: null,
      isLoading: false,
      error: null,
      isLoaded: true,
      hasNoPersona: false,
      refetch: vi.fn(),
      generateTrainerPersona: vi.fn(),
    }));
  });

  // Data-driven test cases for common hook patterns
  const testCases = createHookTestCases('useTrainerPersona');

  it.each([
    [testCases.loading.name, testCases.loading.mockReturn],
    [testCases.error.name, testCases.error.mockReturn],
    [testCases.success.name, testCases.success.mockReturn],
  ])('%s', (testName, mockReturn) => {
    mockContext.TrainerPersonaContext.Consumer.mockImplementation(({ children }) => children(mockReturn));

    const { result } = renderHook(() => useTrainerPersona());

    expect(result.current).toBeDefined();
    expect(result.current.isLoading).toBe(mockReturn.isLoading);
    expect(result.current.isLoaded).toBe(mockReturn.isLoaded);
    if (mockReturn.error) {
      expect(result.current.error).toBe(mockReturn.error);
    }
  });

  it('should handle successful trainer persona data', () => {
    const mockPersona = createMockTrainerPersona();

    mockContext.TrainerPersonaContext.Consumer.mockImplementation(({ children }) => children({
      trainerPersona: mockPersona,
      isLoading: false,
      error: null,
      isLoaded: true,
      hasNoPersona: false,
      refetch: vi.fn(),
      generateTrainerPersona: vi.fn(),
    }));

    const { result } = renderHook(() => useTrainerPersona());

    expect(result.current.trainerPersona).toEqual(mockPersona);
    expect(result.current.hasNoPersona).toBe(false);
  });

  it('should handle refetch functionality', async () => {
    const mockRefetch = vi.fn().mockResolvedValue(true);

    mockContext.TrainerPersonaContext.Consumer.mockImplementation(({ children }) => children({
      trainerPersona: null,
      isLoading: false,
      error: null,
      isLoaded: true,
      hasNoPersona: false,
      refetch: mockRefetch,
      generateTrainerPersona: vi.fn(),
    }));

    const { result } = renderHook(() => useTrainerPersona());

    await result.current.refetch();
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
EOF
```

# Create phone verification hook tests

cat > src/**tests**/hooks/usePhoneVerification.test.ts << 'EOF'
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';

// Mock the context
vi.mock('@/contexts/VerificationContext', () => ({
VerificationContext: {
Consumer: ({ children }: { children: any }) => children({
isVerified: false,
isLoading: false,
error: null,
verifyPhone: vi.fn(),
sendVerificationCode: vi.fn(),
}),
},
}));

describe('usePhoneVerification', () => {
beforeEach(() => {
vi.clearAllMocks();
});

it('should return verification state', () => {
const { result } = renderHook(() => usePhoneVerification());

    expect(result.current).toBeDefined();
    expect(result.current.isVerified).toBe(false);
    expect(result.current.isLoading).toBe(false);

});

it('should handle phone verification', async () => {
const mockVerifyPhone = vi.fn().mockResolvedValue(true);

    vi.mocked(require('@/contexts/VerificationContext').VerificationContext.Consumer)
      .mockImplementation(({ children }) => children({
        isVerified: false,
        isLoading: false,
        error: null,
        verifyPhone: mockVerifyPhone,
        sendVerificationCode: vi.fn(),
      }));

    const { result } = renderHook(() => usePhoneVerification());

    await act(async () => {
      await result.current.verifyPhone('+1234567890', '123456');
    });

    expect(mockVerifyPhone).toHaveBeenCalledWith('+1234567890', '123456');

});

it('should handle verification errors', () => {
const error = new Error('Invalid code');

    vi.mocked(require('@/contexts/VerificationContext').VerificationContext.Consumer)
      .mockImplementation(({ children }) => children({
        isVerified: false,
        isLoading: false,
        error,
        verifyPhone: vi.fn(),
        sendVerificationCode: vi.fn(),
      }));

    const { result } = renderHook(() => usePhoneVerification());

    expect(result.current.error).toBe(error);

});
});
EOF

````

### Step 4: Implement Critical Component Tests (3 hours)

```bash
# Create component test for GeneratingTrainerPage
cat > src/__tests__/components/GeneratingTrainerPage.test.tsx << 'EOF'
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import GeneratingTrainerPage from '@/modules/dashboard/trainer/pages/GeneratingTrainerPage';
import { createMockTrainerPersona } from '../utils/mock-factories';

// Mock the hooks
vi.mock('@/hooks/useTrainerPersona', () => ({
  useTrainerPersona: vi.fn(),
}));

vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track: vi.fn(),
  }),
}));

describe('GeneratingTrainerPage', () => {
  const mockUseTrainerPersona = vi.mocked(require('@/hooks/useTrainerPersona').useTrainerPersona);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    mockUseTrainerPersona.mockReturnValue({
      trainerPersona: null,
      isLoading: true,
      error: null,
      isLoaded: false,
      hasNoPersona: false,
      refetch: vi.fn(),
      generateTrainerPersona: vi.fn(),
    });

    render(
      <BrowserRouter>
        <GeneratingTrainerPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Generating personality traits/i)).toBeInTheDocument();
    expect(screen.getByText(/This may take a few moments/i)).toBeInTheDocument();
  });

  it('should show error state', () => {
    const error = new Error('Failed to generate trainer');

    mockUseTrainerPersona.mockReturnValue({
      trainerPersona: null,
      isLoading: false,
      error,
      isLoaded: true,
      hasNoPersona: false,
      refetch: vi.fn(),
      generateTrainerPersona: vi.fn(),
    });

    render(
      <BrowserRouter>
        <GeneratingTrainerPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('should redirect when trainer persona is generated', () => {
    const mockPersona = createMockTrainerPersona();

    mockUseTrainerPersona.mockReturnValue({
      trainerPersona: mockPersona,
      isLoading: false,
      error: null,
      isLoaded: true,
      hasNoPersona: false,
      refetch: vi.fn(),
      generateTrainerPersona: vi.fn(),
    });

    const { container } = render(
      <BrowserRouter>
        <GeneratingTrainerPage />
      </BrowserRouter>
    );

    // Should redirect to trainer page
    expect(container.innerHTML).toContain('Redirecting');
  });

  it('should handle timeout scenario', async () => {
    mockUseTrainerPersona.mockReturnValue({
      trainerPersona: null,
      isLoading: false,
      error: null,
      isLoaded: true,
      hasNoPersona: true,
      refetch: vi.fn(),
      generateTrainerPersona: vi.fn(),
    });

    render(
      <BrowserRouter>
        <GeneratingTrainerPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/took longer than expected/i)).toBeInTheDocument();
    });
  });
});
EOF

# Create UI component tests
cat > src/__tests__/components/Button.test.tsx << 'EOF'
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/ui/shared/atoms/Button';

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-md');
  });

  it('should render with custom variant and size', () => {
    render(
      <Button variant="secondary" size="lg">
        Large Secondary
      </Button>
    );

    const button = screen.getByRole('button', { name: /large secondary/i });
    expect(button).toHaveClass('btn', 'btn-secondary', 'btn-lg');
  });

  it('should show loading state', () => {
    render(
      <Button isLoading>
        Loading Button
      </Button>
    );

    const button = screen.getByRole('button', { name: /loading button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('loading');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick}>
        Click me
      </Button>
    );

    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole('button', { name: /disabled button/i });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
EOF
````

### Step 5: Implement Service Tests (2 hours)

```bash
# Create service tests
cat > src/__tests__/services/TrainerPersonaService.test.ts << 'EOF'
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrainerPersonaServiceImpl } from '@/services/trainerPersona/TrainerPersonaServiceImpl';
import { createMockTrainerPersona } from '../utils/mock-factories';

// Mock the API service
vi.mock('@/services/api/ApiServiceImpl', () => ({
  ApiServiceImpl: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  })),
}));

describe('TrainerPersonaServiceImpl', () => {
  let service: TrainerPersonaServiceImpl;
  let mockApiService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new TrainerPersonaServiceImpl();
    mockApiService = service['apiService'];
  });

  describe('getTrainerPersona', () => {
    it('should fetch trainer persona successfully', async () => {
      const mockPersona = createMockTrainerPersona();
      mockApiService.get.mockResolvedValue({ data: mockPersona });

      const result = await service.getTrainerPersona();

      expect(mockApiService.get).toHaveBeenCalledWith('/trainer-persona');
      expect(result).toEqual(mockPersona);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockApiService.get.mockRejectedValue(error);

      await expect(service.getTrainerPersona()).rejects.toThrow('API Error');
    });

    it('should return null when no persona exists', async () => {
      mockApiService.get.mockResolvedValue({ data: null });

      const result = await service.getTrainerPersona();

      expect(result).toBeNull();
    });
  });

  describe('generateTrainerPersona', () => {
    it('should generate trainer persona successfully', async () => {
      const mockPersona = createMockTrainerPersona();
      const attributes = { personality: 'Motivational', focus: 'Strength' };

      mockApiService.post.mockResolvedValue({ data: mockPersona });

      const result = await service.generateTrainerPersona(attributes);

      expect(mockApiService.post).toHaveBeenCalledWith('/trainer-persona/generate', attributes);
      expect(result).toEqual(mockPersona);
    });

    it('should handle generation errors', async () => {
      const error = new Error('Generation failed');
      mockApiService.post.mockRejectedValue(error);

      await expect(service.generateTrainerPersona({})).rejects.toThrow('Generation failed');
    });
  });
});
EOF
```

### Step 6: Implement Integration Tests (2 hours)

```bash
# Create integration test for workout generation flow (minimal mocking)
cat > src/__tests__/integration/WorkoutGenerationFlow.test.tsx << 'EOF'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import GeneratePage from '@/modules/dashboard/workouts/GeneratePage';
import { createMockWorkout } from '../utils/mock-factories';

// Only mock external API layer, let hooks run real logic
vi.mock('@/services/api/ApiServiceImpl', () => ({
  ApiServiceImpl: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Mock analytics to avoid tracking in tests
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track: vi.fn(),
  }),
}));

describe('Workout Generation Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render workout generation form', () => {
    render(
      <BrowserRouter>
        <GeneratePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/generate workout/i)).toBeInTheDocument();
    expect(screen.getByText(/workout duration/i)).toBeInTheDocument();
    expect(screen.getByText(/focus area/i)).toBeInTheDocument();
  });

  it('should handle form interactions and validation', async () => {
    render(
      <BrowserRouter>
        <GeneratePage />
      </BrowserRouter>
    );

    // Test form validation
    const durationInput = screen.getByLabelText(/workout duration/i);
    fireEvent.change(durationInput, { target: { value: '0' } });

    // Should show validation error for 0 duration
    await waitFor(() => {
      expect(screen.getByText(/duration must be greater than 0/i)).toBeInTheDocument();
    });

    // Fix the input
    fireEvent.change(durationInput, { target: { value: '30' } });

    // Validation error should disappear
    await waitFor(() => {
      expect(screen.queryByText(/duration must be greater than 0/i)).not.toBeInTheDocument();
    });
  });

  it('should handle edge cases in selection counting', async () => {
    render(
      <BrowserRouter>
        <GeneratePage />
      </BrowserRouter>
    );

    // Test edge case: no selections
    const generateButton = screen.getByRole('button', { name: /generate/i });
    fireEvent.click(generateButton);

    // Should show error for insufficient selections
    await waitFor(() => {
      expect(screen.getByText(/please select at least one/i)).toBeInTheDocument();
    });
  });

  it('should handle network errors gracefully', async () => {
    // Mock API to throw error
    const mockApi = require('@/services/api/ApiServiceImpl').ApiServiceImpl;
    mockApi.mockImplementation(() => ({
      get: vi.fn().mockRejectedValue(new Error('Network error')),
      post: vi.fn().mockRejectedValue(new Error('Network error')),
      put: vi.fn(),
      delete: vi.fn(),
    }));

    render(
      <BrowserRouter>
        <GeneratePage />
      </BrowserRouter>
    );

    // Try to generate workout
    const durationInput = screen.getByLabelText(/workout duration/i);
    fireEvent.change(durationInput, { target: { value: '30' } });

    const generateButton = screen.getByRole('button', { name: /generate/i });
    fireEvent.click(generateButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
EOF

# Create edge case tests for selection counting logic
cat > src/__tests__/integration/SelectionCountingEdgeCases.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import { getFieldSelectionState } from '@/modules/dashboard/workouts/selectionCountingLogic';

describe('Selection Counting Edge Cases', () => {
  it('should handle zero duration', () => {
    const result = getFieldSelectionState({ duration: 0 });
    expect(result.duration.isValid).toBe(false);
    expect(result.duration.error).toBe('Duration must be greater than 0');
  });

  it('should handle out-of-range energy level', () => {
    const result = getFieldSelectionState({ energyLevel: 11 }); // Max is 10
    expect(result.energyLevel.isValid).toBe(false);
    expect(result.energyLevel.error).toBe('Energy level must be between 1 and 10');
  });

  it('should handle negative soreness values', () => {
    const result = getFieldSelectionState({ soreness: -1 });
    expect(result.soreness.isValid).toBe(false);
    expect(result.soreness.error).toBe('Soreness must be between 0 and 10');
  });

  it('should handle empty focus areas array', () => {
    const result = getFieldSelectionState({ focusAreas: [] });
    expect(result.focusAreas.isValid).toBe(false);
    expect(result.focusAreas.error).toBe('Please select at least one focus area');
  });

  it('should handle maximum equipment selections', () => {
    const maxEquipment = Array(20).fill('equipment'); // Assuming max is 20
    const result = getFieldSelectionState({ availableEquipment: maxEquipment });
    expect(result.availableEquipment.isValid).toBe(true);
  });

  it('should handle over-maximum equipment selections', () => {
    const tooMuchEquipment = Array(25).fill('equipment'); // Over max
    const result = getFieldSelectionState({ availableEquipment: tooMuchEquipment });
    expect(result.availableEquipment.isValid).toBe(false);
    expect(result.availableEquipment.error).toBe('Too many equipment items selected');
  });
});
EOF
```

### Step 7: Update Coverage Thresholds with Staggered Approach (15 minutes)

```bash
# Update vitest.config.ts with staggered thresholds and retry logic
cat > vitest.config.ts << 'EOF'
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    globals: true,
    // Retry flaky tests (especially integration tests)
    retry: process.env.CI ? 2 : 0,
    // Parallelize tests for faster execution
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        // Start with lower thresholds, increase gradually
        global: {
          branches: 60, // Start at 60%, increase to 80% in next sprint
          functions: 60,
          lines: 60,
          statements: 60,
        },
        // Critical components should have higher coverage
        "./src/modules/dashboard/trainer/": {
          branches: 80, // Start at 80%, increase to 90% in next sprint
          functions: 80,
          lines: 80,
          statements: 80,
        },
        "./src/hooks/": {
          branches: 70, // Start at 70%, increase to 85% in next sprint
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
      exclude: [
        "src/setupTests.ts",
        "src/__tests__/**",
        "src/**/*.d.ts",
        "src/**/*.config.*",
        "src/**/*.test.*",
        "src/**/*.spec.*",
        "src/__mocks__/**",
      ],
    },
  },
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
EOF
```

### Step 8: Create Test Scripts with Parallel Execution (15 minutes)

```bash
# Add test scripts to package.json with fast/slow separation
npm pkg set scripts.test:coverage="vitest run --coverage"
npm pkg set scripts.test:watch="vitest --watch"
npm pkg set scripts.test:ui="vitest --ui"
npm pkg set scripts.test:fast="vitest run src/__tests__/{hooks,components,services}/"
npm pkg set scripts.test:slow="vitest run src/__tests__/integration/"
npm pkg set scripts.test:unit="vitest run src/__tests__/{hooks,components,services}/"
npm pkg set scripts.test:integration="vitest run src/__tests__/integration/"
npm pkg set scripts.test:ci="npm run test:fast && npm run test:coverage"
```

## Verification Steps

### 1. Test the Implementation

```bash
# Run all tests
npm run test:run

# Check coverage
npm run test:coverage

# Run specific test types
npm run test:unit
npm run test:integration
```

### 2. Verify Coverage Thresholds

```bash
# Should pass with 80%+ coverage
npm run test:coverage

# Check HTML coverage report
open coverage/index.html
```

### 3. Test Integration with Verify Scripts

```bash
# Full verification should now include tests
npm run verify

# Quick verification should include basic tests
npm run verify:quick
```

## Expected Results

After implementation, you should see:

✅ **Tests passing**: All unit and integration tests pass  
✅ **Coverage met**: 80%+ coverage across the codebase  
✅ **Critical paths covered**: Trainer persona, workout generation, phone verification  
✅ **Integration tests**: End-to-end user flows tested  
✅ **Verify scripts updated**: Tests included in verification pipeline

## Success Metrics

### Coverage Goals (Staggered Approach)

- **Sprint 1**: Overall 60%+, Critical 80%+, Hooks 70%+, UI 50%+
- **Sprint 2**: Overall 70%+, Critical 85%+, Hooks 80%+, UI 60%+
- **Sprint 3**: Overall 80%+, Critical 90%+, Hooks 85%+, UI 70%+
- **Future**: Maintain 80%+ overall, 90%+ critical components

### Test Quality Goals

- **Unit tests**: All critical hooks and services
- **Integration tests**: Key user flows (workout generation, trainer creation)
- **Component tests**: All major UI components
- **Error handling**: All error states covered

## Testing Style Guide

### Best Practices

#### 1. Use Auto-Mocking for Common Patterns

```typescript
// Instead of vi.mock() in every test file
// Create __mocks__/hooks.ts for common hooks
vi.mock("@/hooks/useAuth"); // Auto-mocked
```

#### 2. Data-Driven Tests for Similar Patterns

```typescript
// Use it.each for similar test cases
it.each([
  ["loading", { isLoading: true, isLoaded: false }],
  ["error", { isLoading: false, error: new Error("Test") }],
  ["success", { isLoading: false, data: mockData }],
])("should handle %s state", (state, mockReturn) => {
  // Test implementation
});
```

#### 3. Minimal Mocking in Integration Tests

```typescript
// Only mock external dependencies
vi.mock("@/services/api/ApiServiceImpl"); // External API
// Let hooks run real logic against real components
```

#### 4. Test Edge Cases Explicitly

```typescript
// Test boundary conditions
it("should handle zero duration", () => {
  expect(validateDuration(0)).toBe(false);
});

it("should handle maximum equipment", () => {
  expect(validateEquipment(maxEquipment)).toBe(true);
});
```

### Workshop Setup

#### 30-Minute Test-Drive Workshop

1. **Pair Programming Session**: Write one hook test and one component test together
2. **Pattern Demonstration**: Show auto-mocking and data-driven tests
3. **Common Pitfalls**: Discuss over-mocking and flaky tests
4. **Tools Setup**: Ensure everyone has Vitest UI and coverage reports working

#### Workshop Agenda

```bash
# 1. Setup (5 minutes)
npm run test:ui  # Show visual test runner

# 2. Write Hook Test (15 minutes)
# - Use data-driven approach
# - Demonstrate auto-mocking
# - Show error handling

# 3. Write Component Test (10 minutes)
# - Test user interactions
# - Verify accessibility
# - Check edge cases
```

## Troubleshooting

### Common Issues

**Tests failing due to missing mocks**

```bash
# Check if all dependencies are properly mocked
# Add missing mocks to __mocks__/ directory
# Use auto-mocking for common patterns
```

**Coverage thresholds not met**

```bash
# Use staggered approach: start at 60%, increase by 10% each sprint
# Focus on critical business logic first
# Add edge case tests for validation logic
```

**Integration tests timing out**

```bash
# Use retry logic: retry: process.env.CI ? 2 : 0
# Check for async operations not properly awaited
# Verify mock implementations are correct
```

**Flaky tests**

```bash
# Add retry logic for integration tests
# Use waitFor instead of setTimeout
# Mock time-based operations consistently
```

### Getting Help

- Check the [Testing Guide](../testing/README.md)
- Review [Vitest Documentation](https://vitest.dev/)
- Contact the development team

## Next Steps

1. **Run the full test suite**: `npm run test:coverage`
2. **Review coverage report**: Identify uncovered critical paths
3. **Add more tests**: Focus on business logic and error handling
4. **Plan Phase 3**: E2E testing and performance monitoring

---

**Implementation Time:** ~8 hours  
**Impact:** Catches 90% of issues, provides confidence for refactoring  
**Risk:** Medium - Requires understanding of existing codebase
