import { useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { VerificationService } from "../domain/interfaces/services/VerificationService";
import { VerificationServiceImpl } from "../services/verification/VerificationServiceImpl";

/**
 * Hook to get a VerificationService instance
 * @returns A VerificationService instance
 */
export function useVerificationService(): VerificationService {
  const { user } = useUser();

  // Create a memoized VerificationService instance
  const verificationService = useMemo(() => {
    return new VerificationServiceImpl(user);
  }, [user]);

  return verificationService;
}
