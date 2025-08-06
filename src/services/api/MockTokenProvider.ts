import { TokenProvider } from '@/domain/interfaces/api/TokenProvider';

/**
 * Mock implementation of TokenProvider for testing purposes
 */
export class MockTokenProvider implements TokenProvider {
  private mockToken: string | null;

  /**
   * Creates a new MockTokenProvider
   * @param mockToken The token to return or null to simulate no token
   */
  constructor(mockToken: string | null = 'mock-token') {
    this.mockToken = mockToken;
  }

  /**
   * Sets the mock token value
   * @param token The new token value or null
   */
  setToken(token: string | null): void {
    this.mockToken = token;
  }

  /**
   * Get the current mock authentication token
   * @returns Promise resolving to the token string or null
   */
  async getToken(): Promise<string | null> {
    return this.mockToken;
  }
}
