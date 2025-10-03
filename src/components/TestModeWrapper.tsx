import { ReactNode, useEffect } from 'react';

interface TestModeWrapperProps {
  children: ReactNode;
}

// Extend the Window interface to include Clerk
declare global {
  interface Window {
    Clerk?: {
      user?: {
        id: string;
        emailAddresses: Array<{ emailAddress: string }>;
        firstName: string;
        lastName: string;
      };
      isSignedIn?: () => boolean;
      isLoaded?: () => boolean;
      session?: {
        id: string;
        status: string;
      };
    };
  }
}

/**
 * TestModeWrapper - Provides mocked authentication when in test mode
 * This component sets up the same authentication mocks used in the test environment
 */
export const TestModeWrapper: React.FC<TestModeWrapperProps> = ({
  children,
}) => {
  useEffect(() => {
    console.log('TestModeWrapper: Component mounted');
    console.log(
      'TestModeWrapper: VITE_TEST_MODE =',
      import.meta.env.VITE_TEST_MODE
    );

    // Only run in test mode
    if (import.meta.env.VITE_TEST_MODE === 'true') {
      console.log('TestModeWrapper: Test mode enabled, setting up mocks');

      // Wait for Clerk to load, then mock it
      const mockClerk = (retryCount = 0, maxRetries = 10) => {
        if (window.Clerk) {
          console.log('TestModeWrapper: Clerk found, applying mocks');

          // Mock the user object exactly like in the test setup
          window.Clerk.user = {
            id: 'user-123',
            emailAddresses: [{ emailAddress: 'test@example.com' }],
            firstName: 'Test',
            lastName: 'User',
          };

          // Mock the authentication methods exactly like in the test setup
          window.Clerk.isSignedIn = () => true;
          window.Clerk.isLoaded = () => true;

          // Mock the session
          window.Clerk.session = {
            id: 'sess-123',
            status: 'active',
          };

          console.log(
            'TestModeWrapper: Clerk authentication mocked successfully'
          );
        } else if (retryCount < maxRetries) {
          const delay = Math.min(100 * Math.pow(2, retryCount), 2000); // Exponential backoff, max 2s
          console.log(
            `TestModeWrapper: Clerk not found, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`
          );
          setTimeout(() => mockClerk(retryCount + 1, maxRetries), delay);
        } else {
          console.warn(
            'TestModeWrapper: Failed to find Clerk after maximum retries. Test mode may not work correctly.'
          );
        }
      };

      mockClerk();
    } else {
      console.log('TestModeWrapper: Test mode disabled');
    }
  }, []);

  return <div data-testid="test-mode-wrapper">{children}</div>;
};
