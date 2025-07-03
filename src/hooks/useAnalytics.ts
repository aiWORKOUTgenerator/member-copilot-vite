import { useMemo } from "react";
import { getAnalytics } from "@/services/analytics";
import type { AnalyticsService } from "@/services/analytics";

/**
 * Custom hook to access the analytics service
 * Memoized to ensure stable object references across renders
 *
 * @returns The analytics service instance
 */
export function useAnalytics(): AnalyticsService {
  // Memoize the analytics instance to prevent unnecessary re-renders
  return useMemo(() => getAnalytics(), []);
}
