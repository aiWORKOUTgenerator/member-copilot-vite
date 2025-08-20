import { useCallback } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

// Helper function to extract essential browser info without sensitive details
function getSanitizedBrowserInfo(): {
  browser: string;
  version: string;
  platform: string;
} {
  const userAgent = navigator.userAgent;

  // Extract browser name and version
  let browser = 'Unknown';
  let version = 'Unknown';

  if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
    const match = userAgent.match(/Edge\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  }

  // Extract platform (OS family only)
  let platform = 'Unknown';
  if (userAgent.includes('Windows')) {
    platform = 'Windows';
  } else if (userAgent.includes('Mac')) {
    platform = 'macOS';
  } else if (userAgent.includes('Linux')) {
    platform = 'Linux';
  } else if (userAgent.includes('Android')) {
    platform = 'Android';
  } else if (userAgent.includes('iOS')) {
    platform = 'iOS';
  }

  return { browser, version, platform };
}

export function useWorkoutPathSelection() {
  const analytics = useAnalytics();

  const selectPath = useCallback(
    (path: 'quick' | 'detailed') => {
      const browserInfo = getSanitizedBrowserInfo();

      analytics.track('workout_path_selected', {
        path,
        timestamp: new Date().toISOString(),
        browser: browserInfo.browser,
        browserVersion: browserInfo.version,
        platform: browserInfo.platform,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
      });
    },
    [analytics]
  );

  const trackPageView = useCallback(() => {
    analytics.track('workout_path_page_viewed', {
      timestamp: new Date().toISOString(),
    });
  }, [analytics]);

  return { selectPath, trackPageView };
}
