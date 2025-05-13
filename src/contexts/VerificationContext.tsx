"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { useVerificationService } from "@/hooks/useVerificationService";

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
const VerificationContext = createContext<VerificationState | undefined>(
  undefined
);

interface VerificationProviderProps {
  children: ReactNode;
}

/**
 * VerificationProvider component that makes verification state available to all child components.
 */
export function VerificationProvider({ children }: VerificationProviderProps) {
  const verificationService = useVerificationService();

  // Create a memoized value for the verification state
  const value = useMemo<VerificationState>(
    () => ({
      isEmailVerified: verificationService.isEmailVerified(),
      isUserVerified: verificationService.isUserVerified(),
    }),
    [verificationService]
  );

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}

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
