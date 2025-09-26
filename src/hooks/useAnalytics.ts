import { getAnalytics } from '@/services/analytics';
import type { AnalyticsService } from '@/services/analytics';
import { useTenant } from '@/hooks/useConfiguration';
import { useMemo } from 'react';

/**
 * Custom hook to access the analytics service
 *
 * @returns The analytics service instance
 */
export function useAnalytics(): AnalyticsService {
  // Get the analytics instance
  return getAnalytics();
}

/**
 * Enhanced analytics hook that automatically adds tenant to all events
 */
export function useAnalyticsWithTenant(): AnalyticsService {
  const analytics = useAnalytics();
  const tenant = useTenant();

  return useMemo(
    () => ({
      initialize: () => analytics.initialize(),
      page: (properties?: Record<string, unknown>) =>
        analytics.page({
          ...properties,
          tenant,
        }),
      track: (event: string, properties?: Record<string, unknown>) =>
        analytics.track(event, {
          ...properties,
          tenant,
        }),
      identify: (userId: string, traits?: Record<string, unknown>) =>
        analytics.identify(userId, {
          ...traits,
          tenant,
        }),
      reset: () => analytics.reset(),
    }),
    [analytics, tenant]
  );
}
