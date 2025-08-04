import { createContext } from "react";

/**
 * VerificationState interface defines the shape of our verification context value.
 */
export interface VerificationState {
  isEmailVerified: boolean;
  isUserVerified: boolean;
}

/**
 * Create the context with a default undefined value.
 * This forces consumers to use the useVerification hook which performs a null check.
 */
export const VerificationContext = createContext<VerificationState | undefined>(
  undefined
);
