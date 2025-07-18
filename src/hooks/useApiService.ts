import { useAuth } from "@clerk/clerk-react";
import { useMemo } from "react";
import { ApiServiceImpl } from "@/services/api/ApiServiceImpl";
import { ClerkTokenProvider } from "@/services/api/ClerkTokenProvider";
import { ApiService } from "@/domain/interfaces/api/ApiService";

/**
 * Hook to get an API service instance with authentication configured
 * @param baseUrl Optional base URL for API requests
 * @returns An ApiService instance with authentication configured
 */
export function useApiService(
  baseUrl: string = import.meta.env.VITE_API_URL || ""
): ApiService {
  const { getToken } = useAuth();

  // Create a memoized API service instance that will only change when dependencies change
  const apiService = useMemo(() => {
    // Create a token provider that uses Clerk's getToken function
    const tokenProvider = new ClerkTokenProvider(() => getToken());

    // Create the API service with the token provider
    return new ApiServiceImpl(
      baseUrl,
      {
        "Content-Type": "application/json",
      },
      tokenProvider
    );
  }, [baseUrl, getToken]);

  return apiService;
}
