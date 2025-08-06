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
