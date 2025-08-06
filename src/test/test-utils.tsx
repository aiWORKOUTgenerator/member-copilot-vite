import { ReactElement } from 'react';
import {
  render,
  RenderOptions,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { vi } from 'vitest';

// Mock Clerk authentication
const mockUseAuth = {
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

// Mock the auth hook
vi.mock('../hooks/auth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock analytics
const mockAnalytics = {
  track: vi.fn(),
  identify: vi.fn(),
  page: vi.fn(),
};

vi.mock('../hooks/useAnalytics', () => ({
  useAnalytics: () => mockAnalytics,
}));

// Import the component from a separate file
import { AllTheProviders } from './test-providers';

// Custom render function that includes all necessary providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Export testing library functions
export { screen, fireEvent, waitFor };
export { customRender as render };

// Export mock functions for testing
export { mockUseAuth, mockAnalytics };
