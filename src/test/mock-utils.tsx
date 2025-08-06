import { vi } from 'vitest';

// Mock utilities for better test isolation
export const setupAuthMock = () => {
  const mockAuth = {
    isSignedIn: true,
    isLoaded: true,
    userId: 'test-user-id',
    user: {
      id: 'test-user-id',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'Test',
      lastName: 'User',
    },
    signOut: vi.fn(),
    getToken: vi.fn().mockResolvedValue('mock-token'),
  };

  vi.doMock('../hooks/auth', () => ({
    useAuth: () => mockAuth,
  }));

  return mockAuth;
};

export const setupAnalyticsMock = () => {
  const mockAnalytics = {
    track: vi.fn(),
    identify: vi.fn(),
    page: vi.fn(),
  };

  vi.doMock('../hooks/useAnalytics', () => ({
    useAnalytics: () => mockAnalytics,
  }));

  return mockAnalytics;
};

export const clearMocks = () => {
  vi.clearAllMocks();
  vi.resetModules();
};
