import { useMemo } from "react";
import { useApiService } from "./useApiService";
import { MemberService } from "../domain/interfaces/services/MemberService";
import { MemberServiceImpl } from "../services/member/MemberServiceImpl";

/**
 * Hook to get a MemberService instance with authentication configured
 * @returns A MemberService instance with authentication configured
 */
export function useMemberService(): MemberService {
  // Get the authenticated API service
  const apiService = useApiService();

  // Create a memoized MemberService instance that will only change when dependencies change
  const memberService = useMemo(() => {
    return new MemberServiceImpl(apiService);
  }, [apiService]);

  return memberService;
}
