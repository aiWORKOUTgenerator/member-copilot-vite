import { vi } from 'vitest';

// Mock data for testing
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockContact = {
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  phone_number: '+1234567890',
  phone_verified_at: new Date().toISOString(),
  source: 'web',
  status: 'active',
  attributes: {
    energy_level: 'medium',
    workout_focus: 'strength',
  },
  registration_status: 'completed',
  workout_count: 5,
  last_workout_date: new Date().toISOString(),
};

export const mockWorkout = {
  id: 'test-workout-id',
  userId: 'test-user-id',
  title: 'Test Workout',
  description: 'A test workout',
  exercises: [
    {
      name: 'Push-ups',
      sets: 3,
      reps: 10,
      rest: 60,
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockSubscription = {
  id: 'test-subscription-id',
  userId: 'test-user-id',
  status: 'active',
  plan: 'premium',
  currentPeriodStart: new Date().toISOString(),
  currentPeriodEnd: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockAttribute = {
  id: 'test-attribute-id',
  userId: 'test-user-id',
  typeId: 'test-type-id',
  value: 'test-value',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockTrainerPersona = {
  id: 'test-persona-id',
  userId: 'test-user-id',
  name: 'Test Trainer',
  description: 'A test trainer persona',
  personality: 'motivational',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Utility functions for creating mock API responses
export const mockApiResponse = <T>(data: T) => ({
  data,
  status: 200,
  message: 'Success',
});

export const mockApiError = (status: number, message: string) => ({
  error: message,
  status,
});

// Utility for creating mock services
export const createMockService = <T>(defaultData: T) => ({
  get: vi.fn().mockResolvedValue(mockApiResponse(defaultData)),
  create: vi.fn().mockResolvedValue(mockApiResponse(defaultData)),
  update: vi.fn().mockResolvedValue(mockApiResponse(defaultData)),
  delete: vi.fn().mockResolvedValue(mockApiResponse({ success: true })),
  list: vi.fn().mockResolvedValue(mockApiResponse([defaultData])),
});
