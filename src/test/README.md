# Testing Infrastructure

This directory contains the comprehensive testing infrastructure for the member-copilot-vite application.

## 🏗️ Structure

```
src/test/
├── setup.ts              # Test environment setup
├── test-utils.tsx        # Custom render utilities
├── mock-utils.tsx        # Controlled mocking utilities
├── mocks/                # Mock data and services
│   └── index.ts         # Centralized mock exports
└── README.md            # This file

src/
├── components/__tests__/ # Component tests
├── hooks/__tests__/     # Hook tests
├── services/__tests__/  # Service tests
└── modules/__tests__/   # Module-specific tests
```

## 🚀 Getting Started

### Running Tests

```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Coverage

The project uses Vitest with coverage thresholds:

- **Global**: 60% (branches, functions, lines, statements)
- **Critical Components**: 80% (trainer module, hooks, services)
- **UI Components**: 40-50% (molecules, atoms)
- **Workout Module**: 30% (increasing to 50% in next sprint)

## 📝 Testing Patterns

### Component Testing

Use the custom `render` function from `test-utils.tsx`:

```typescript
import { render, screen, fireEvent } from '../../test/test-utils';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Testing

Use `renderHook` for testing custom hooks:

```typescript
import { renderHook } from "@testing-library/react";
import { useContact } from "../useContact";

describe("useContact", () => {
  it("returns contact data", () => {
    const { result } = renderHook(() => useContact());

    expect(result.current.contact).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });
});
```

### Service Testing

Mock external dependencies and test service methods:

```typescript
import { ApiServiceImpl } from "../ApiServiceImpl";

// Mock fetch globally
global.fetch = vi.fn();

describe("ApiServiceImpl", () => {
  it("makes successful GET request", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: "test" }),
    } as Response);

    const result = await apiService.get("/test");
    expect(result).toEqual({ data: "test" });
  });
});
```

## 🎭 Controlled Mocking

### Why Controlled Mocking?

Global mocks at the top level of test utilities can cause test isolation issues. We use a controlled approach that:

- **Prevents test pollution** between test files
- **Allows fine-grained control** over mock behavior
- **Enables proper cleanup** between tests
- **Improves test reliability** and debugging

### Using Controlled Mocks

#### For Authentication

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupAuthMock, clearMocks } from '../../test/mock-utils';

describe('MyComponent', () => {
  let mockAuth: any;

  beforeEach(async () => {
    clearMocks();
    mockAuth = setupAuthMock();
    
    // Import component after setting up mocks
    const { MyComponent } = await import('../MyComponent');
  });

  it('shows user info when authenticated', () => {
    mockAuth.isSignedIn = true;
    // ... test implementation
  });
});
```

#### For Analytics

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupAnalyticsMock, clearMocks } from '../../test/mock-utils';

describe('MyComponent', () => {
  let mockAnalytics: any;

  beforeEach(async () => {
    clearMocks();
    mockAnalytics = setupAnalyticsMock();
    
    // Import component after setting up mocks
    const { MyComponent } = await import('../MyComponent');
  });

  it('tracks user interactions', () => {
    // ... test implementation
    expect(mockAnalytics.track).toHaveBeenCalledWith('button_clicked');
  });
});
```

#### For Custom Hooks

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { clearMocks } from '../../test/mock-utils';

describe('useCustomHook', () => {
  let useCustomHook: any;

  beforeEach(async () => {
    clearMocks();
    
    // Create fresh mocks for each test
    const mockService = {
      getData: vi.fn().mockResolvedValue({ data: 'test' }),
    };

    // Mock the service with controlled approach
    vi.doMock('../services/CustomService', () => ({
      CustomService: mockService,
    }));

    // Import after mocking for better isolation
    const module = await import('../useCustomHook');
    useCustomHook = module.useCustomHook;
  });

  it('returns data from service', async () => {
    const { result } = renderHook(() => useCustomHook());
    
    // ... test implementation
  });
});
```

### Mock Utilities

#### `setupAuthMock()`
Creates a controlled mock for authentication hooks.

#### `setupAnalyticsMock()`
Creates a controlled mock for analytics hooks.

#### `clearMocks()`
Clears all mocks and resets modules for proper test isolation.

## 🧪 Test Utilities

### Custom Render Function

The `render` function from `test-utils.tsx` includes:

- React Router (`BrowserRouter`)
- All context providers (`CombinedProviders`)
- No global mocks (use controlled mocking instead)

### User Event Testing

Use `@testing-library/user-event` for realistic user interactions:

```typescript
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();
await user.type(input, "test@example.com");
await user.click(button);
```

## 📋 Best Practices

### Test Organization

1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain the behavior
3. **Test one thing per test** - keep tests focused
4. **Arrange, Act, Assert** pattern for test structure

### Mocking Best Practices

1. **Use controlled mocking** instead of global mocks
2. **Reset mocks between tests** using `clearMocks()`
3. **Import modules after mocking** for better isolation
4. **Create fresh mocks** in `beforeEach` hooks
5. **Avoid top-level `vi.mock()`** in test utilities

### Accessibility Testing

1. **Use semantic queries** (`getByRole`, `getByLabelText`)
2. **Test keyboard navigation** and screen readers
3. **Verify ARIA attributes** and labels
4. **Test focus management** for modals and forms

### Error Handling

1. **Test error states** and error messages
2. **Mock failed API calls** and network errors
3. **Verify error boundaries** work correctly
4. **Test loading states** and spinners

### Performance Testing

1. **Mock expensive operations** (API calls, heavy computations)
2. **Test component re-renders** and memoization
3. **Verify cleanup** in `useEffect` hooks
4. **Test async operations** with proper waiting

## 🔧 Configuration

### Vitest Configuration

The Vitest config (`vitest.config.ts`) includes:

- **jsdom environment** for DOM testing
- **React plugin** for JSX support
- **Coverage thresholds** by module type
- **Test retries** for flaky tests in CI
- **Parallel execution** for faster tests

### ESLint Testing Rules

Add these to your ESLint config for testing:

```json
{
  "env": {
    "vitest": true
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "vitest/expect-expect": "error",
    "vitest/no-disabled-tests": "warn"
  }
}
```

## 🚨 Common Issues

### Mocking Issues

- **Clear mocks** in `beforeEach` hooks
- **Use `vi.doMock()`** for controlled mocking
- **Import after mocking** for better isolation
- **Reset modules** when needed

### Async Testing

- **Use `waitFor`** for async operations
- **Mock timers** for time-based operations
- **Handle promises** properly in tests

### Provider Issues

- **Wrap components** with necessary providers
- **Use controlled mocks** for context values
- **Test provider behavior** separately

## 📈 Coverage Goals

### Current Targets

- **Global**: 60% (increasing to 80%)
- **Critical Path**: 80% (auth, workout generation)
- **UI Components**: 40-50% (increasing to 60-70%)
- **Services**: 80% (increasing to 90%)

### Coverage Reports

Run `npm run test:coverage` to generate:

- **Console report** with summary
- **HTML report** in `coverage/` directory
- **JSON report** for CI integration

## 🔄 Continuous Integration

### GitHub Actions

Tests run automatically on:

- **Pull requests** - Full test suite
- **Main branch** - Tests + coverage
- **Scheduled** - Nightly test runs

### Pre-commit Hooks

Husky hooks ensure:

- **Tests pass** before commit
- **Coverage thresholds** are met
- **Code formatting** is correct

## 📚 Resources

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [User Event Testing](https://testing-library.com/docs/user-event/intro/)
