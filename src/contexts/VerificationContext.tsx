"use client";

import { ReactNode, useMemo } from "react";
import { useVerificationService } from "@/hooks/useVerificationService";
import { VerificationContext, VerificationState } from "./verification.types";

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
    [verificationService],
  );

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}
