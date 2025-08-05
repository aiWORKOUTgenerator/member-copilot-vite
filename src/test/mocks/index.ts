// Mock data for testing
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '+1234567890',
};

export const mockContact = {
  id: 'test-contact-id',
  userId: 'test-user-id',
  email: 'test@example.com',
  phoneNumber: '+1234567890',
  firstName: 'Test',
  lastName: 'User',
  isVerified: true,
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-01').toISOString(),
};

export const mockWorkout = {
  id: 'test-workout-id',
  userId: 'test-user-id',
  title: 'Test Workout',
  description: 'A test workout for testing purposes',
  exercises: [
    {
      name: 'Push-ups',
      sets: 3,
      reps: 10,
      restTime: 60,
    },
    {
      name: 'Squats',
      sets: 3,
      reps: 15,
      restTime: 60,
    },
  ],
  duration: 30,
  difficulty: 'intermediate',
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-01').toISOString(),
};

export const mockSubscription = {
  id: 'test-subscription-id',
  userId: 'test-user-id',
  status: 'active',
  plan: 'premium',
  currentPeriodStart: new Date('2024-01-01').toISOString(),
  currentPeriodEnd: new Date('2024-02-01').toISOString(),
  cancelAtPeriodEnd: false,
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-01').toISOString(),
};

export const mockAttribute = {
  id: 'test-attribute-id',
  userId: 'test-user-id',
  type: 'fitness_goal',
  value: 'weight_loss',
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-01').toISOString(),
};

export const mockTrainerPersona = {
  id: 'test-trainer-id',
  userId: 'test-user-id',
  name: 'Test Trainer',
  description: 'A test trainer persona',
  personality: 'motivational',
  expertise: ['strength', 'cardio'],
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-01').toISOString(),
};

// Mock API responses
export const mockApiResponse = <T>(data: T) => ({
  data,
  status: 200,
  message: 'Success',
});

export const mockApiError = (message: string, status: number = 400) => ({
  error: message,
  status,
  message,
});

// Mock service functions
export const createMockService = <T>(defaultData: T) => ({
  get: vi.fn().mockResolvedValue(mockApiResponse(defaultData)),
  create: vi.fn().mockResolvedValue(mockApiResponse(defaultData)),
  update: vi.fn().mockResolvedValue(mockApiResponse(defaultData)),
  delete: vi.fn().mockResolvedValue(mockApiResponse({ success: true })),
  list: vi.fn().mockResolvedValue(mockApiResponse([defaultData])),
}); 