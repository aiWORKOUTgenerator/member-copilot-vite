/**
 * Interface for providing authentication tokens to API services
 */
export interface TokenProvider {
  /**
   * Get the current authentication token
   * @returns Promise resolving to the token string or null if no token is available
   */
  getToken(): Promise<string | null>;
}
