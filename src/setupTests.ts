import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('@/hooks/auth', () => ({
  useAuth: () => ({
    isSignedIn: true,
    isLoaded: true,
  }),
}));

// Mock API services
vi.mock('@/hooks/useApiService', () => ({
  useApiService: () => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }),
}));
