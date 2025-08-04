import { vi } from "vitest";

// Mock data factories for consistent test data
export const createMockUser = (overrides = {}) => ({
  id: "user-123",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  ...overrides,
});

export const createMockTrainerPersona = (overrides = {}) => ({
  id: "persona-123",
  name: "Test Trainer",
  personality: "Motivational",
  specialties: ["Strength Training"],
  ...overrides,
});

export const createMockWorkout = (overrides = {}) => ({
  id: "workout-123",
  title: "Test Workout",
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
    mockReturn: {
      isLoading: false,
      isLoaded: true,
      error: new Error("Test error"),
    },
  },
  success: {
    name: `${hookName} - success state`,
    mockReturn: { isLoading: false, isLoaded: true, error: null },
  },
});
