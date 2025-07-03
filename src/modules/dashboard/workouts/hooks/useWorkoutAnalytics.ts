import { useAnalytics } from "@/hooks/useAnalytics";
import { useCallback, useRef, useMemo } from "react";
import { sanitizeAnalyticsData } from "../components/utils/validation";

/**
 * Custom hook for workout-related analytics tracking
 * Encapsulates common analytics patterns used in workout generation
 * 
 * ✅ FIXED: Returns stable object reference to prevent infinite re-renders
 */
export const useWorkoutAnalytics = () => {
  const analytics = useAnalytics();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Stable debounced handler for preference changes to prevent infinite loops
  const trackPreferenceChange = useCallback((preferenceType: string, value: unknown) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      analytics.track("Workout Preference Changed", {
        preferenceType,
        value: sanitizeAnalyticsData(value),
        tracked_at: new Date().toISOString(),
      });
    }, 1000);
  }, [analytics]);

  // Track workout summary page views
  const trackSummaryPageView = useCallback((mode: "custom" | "quick", customizationCount: number) => {
    analytics.track("Workout Summary Viewed", {
      mode,
      customizations: customizationCount,
      tracked_at: new Date().toISOString(),
    });
  }, [analytics]);

  // Track successful workout generation
  const trackGenerationSuccess = useCallback((workoutId: string) => {
    analytics.track("Workout Generated Successfully", {
      workoutId,
      tracked_at: new Date().toISOString(),
    });
  }, [analytics]);

  // Track generation failures
  const trackGenerationError = useCallback((error: string) => {
    analytics.track("Workout Generation Failed", {
      error,
      tracked_at: new Date().toISOString(),
    });
  }, [analytics]);

  // ✅ CRITICAL FIX: Memoize the returned object to ensure stable reference
  // This prevents workoutAnalytics from changing every render in GeneratePage
  return useMemo(() => ({
    trackSummaryPageView,
    trackGenerationSuccess,
    trackGenerationError,
    trackPreferenceChange,
  }), [trackSummaryPageView, trackGenerationSuccess, trackGenerationError, trackPreferenceChange]);
}; 