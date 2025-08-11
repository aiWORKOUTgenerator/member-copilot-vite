import { useMemo } from 'react';
import { useAnalytics } from './useAnalytics';
import type { AnalyticsService } from '@/services/analytics';

/**
 * Hook that conditionally provides analytics service
 * Returns a no-op analytics object when disabled to avoid unnecessary work
 */
export const useConditionalAnalytics = (enabled: boolean): AnalyticsService => {
  const analyticsService = useAnalytics();

  return useMemo(() => {
    if (enabled) {
      return analyticsService;
    }
    // No-op analytics object that implements all required methods
    return {
      initialize: () => {},
      page: () => {},
      track: () => {},
      identify: () => {},
      reset: () => {},
    };
  }, [enabled, analyticsService]);
};
