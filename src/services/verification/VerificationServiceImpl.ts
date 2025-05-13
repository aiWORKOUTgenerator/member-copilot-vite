import { useUser } from "@clerk/clerk-react";
import { VerificationService } from "@/domain/interfaces/services/VerificationService";

/**
 * Implementation of the VerificationService using Clerk's authentication
 */
export class VerificationServiceImpl implements VerificationService {
  /**
   * The Clerk user object
   */
  private user: ReturnType<typeof useUser>["user"];

  constructor(user: ReturnType<typeof useUser>["user"]) {
    this.user = user;
  }

  /**
   * Checks if the user's primary email is verified
   * @returns True if the user has a primary email and it's verified
   */
  isEmailVerified(): boolean {
    // If user is not loaded or doesn't have a primary email, they're not verified
    if (!this.user || !this.user.primaryEmailAddress) {
      return false;
    }

    // Check if the email has a verification status and that it's complete
    return this.user.primaryEmailAddress.verification?.status === "verified";
  }

  /**
   * Checks if the user is verified through any means
   * Currently just checks email verification, but could be extended to include
   * other verification methods like phone, OAuth providers, etc.
   * @returns True if the user is verified through any method
   */
  isUserVerified(): boolean {
    // For now, we're just checking email verification
    // This could be expanded with other verification methods
    return this.isEmailVerified();
  }
}
