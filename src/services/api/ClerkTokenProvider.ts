import { TokenProvider } from '@/domain/interfaces/api/TokenProvider';

/**
 * Token provider that uses Clerk for authentication tokens
 * This implementation serves as a bridge between Clerk and our API service
 */
export class ClerkTokenProvider implements TokenProvider {
  // Function to get token from Clerk
  private getTokenFn: () => Promise<string | null>;

  /**
   * Creates a new ClerkTokenProvider
   * @param getTokenFn Function that retrieves the token from Clerk
   */
  constructor(getTokenFn: () => Promise<string | null>) {
    this.getTokenFn = getTokenFn;
  }

  /**
   * Get the current authentication token from Clerk
   * @returns Promise resolving to the token string or null if no token is available
   */
  async getToken(): Promise<string | null> {
    try {
      return await this.getTokenFn();
    } catch (error) {
      console.error('Error getting authentication token:', error);
      return null;
    }
  }
}
