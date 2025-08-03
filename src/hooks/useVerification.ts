import { useContext } from "react";
import {
  VerificationContext,
  VerificationState,
} from "@/contexts/verification.types";

/**
 * Custom hook to access the verification state from the VerificationContext.
 * Throws an error if used outside of a VerificationProvider.
 */
export function useVerification(): VerificationState {
  const context = useContext(VerificationContext);

  if (context === undefined) {
    throw new Error(
      "useVerification must be used within a VerificationProvider"
    );
  }

  return context;
}

/**
 * Convenience hook to check if the user's email is verified
 */
export function useIsEmailVerified(): boolean {
  const { isEmailVerified } = useVerification();
  return isEmailVerified;
}

/**
 * Convenience hook to check if the user is verified through any means
 */
export function useIsUserVerified(): boolean {
  const { isUserVerified } = useVerification();
  return isUserVerified;
}
