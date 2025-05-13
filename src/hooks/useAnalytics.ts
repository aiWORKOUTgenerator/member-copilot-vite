import { getAnalytics } from "@/services/analytics";
import type { AnalyticsService } from "@/services/analytics";

/**
 * Custom hook to access the analytics service
 *
 * @returns The analytics service instance
 */
export function useAnalytics(): AnalyticsService {
  // Get the analytics instance
  return getAnalytics();
}
