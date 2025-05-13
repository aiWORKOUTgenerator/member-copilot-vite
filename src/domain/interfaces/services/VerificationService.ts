/**
 * VerificationService interface defines operations for user verification.
 * This service encapsulates logic related to verifying a user's identity.
 */
export interface VerificationService {
  /**
   * Checks if the current user's primary email is verified
   * @returns True if the user's primary email is verified
   */
  isEmailVerified(): boolean;

  /**
   * Checks if the user's identity is verified through any means
   * @returns True if the user is verified through any method
   */
  isUserVerified(): boolean;
}
