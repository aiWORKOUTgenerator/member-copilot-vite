import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { ClerkProvider } from '@clerk/clerk-react';
import { CombinedProviders } from '../contexts/CombinedProviders';
import { ContactProvider } from '../contexts/ContactContext';

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

// Custom render function that includes all necessary providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider publishableKey="pk_test_mock">
      <BrowserRouter>
        <ContactProvider>
          <CombinedProviders>
            {children}
          </CombinedProviders>
        </ContactProvider>
      </BrowserRouter>
    </ClerkProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Export mock functions for testing
export { mockUseAuth, mockAnalytics }; 