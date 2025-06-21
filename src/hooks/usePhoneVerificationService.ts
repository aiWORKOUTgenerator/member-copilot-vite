import { useMemo } from "react";
import { useApiService } from "./useApiService";
import { PhoneVerificationServiceImpl } from "@/services/phoneVerification/PhoneVerificationServiceImpl";
import { PhoneVerificationService } from "@/domain/interfaces/services/PhoneVerificationService";

/**
 * Hook to get a phone verification service instance
 * @returns A PhoneVerificationService instance configured with the API service
 */
export function usePhoneVerificationService(): PhoneVerificationService {
  const apiService = useApiService();

  // Create a memoized phone verification service instance
  const phoneVerificationService = useMemo(() => {
    return new PhoneVerificationServiceImpl(apiService);
  }, [apiService]);

  return phoneVerificationService;
}
