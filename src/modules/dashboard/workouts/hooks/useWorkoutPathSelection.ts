import { useCallback } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

// Helper function to extract essential, privacy-safe browser info without parsing userAgent
function getSanitizedBrowserInfo(): {
  browser: string;
  version: string;
  platform: string;
} {
  type UADataBrand = { brand: string; version: string };
  type UAData = { brands?: UADataBrand[]; platform?: string };

  let browser = 'Unknown';
  let version = 'Unknown';
  let platform = 'Unknown';

  const nav = navigator as Navigator & {
    userAgentData?: UAData;
    vendor?: string;
    platform?: string;
  };
  const uaData = nav.userAgentData;

  // Prefer User-Agent Client Hints when available (Chromium-based browsers)
  if (uaData?.brands && uaData.brands.length > 0) {
    const brands = uaData.brands.map((b) => b.brand);
    if (brands.includes('Google Chrome') || brands.includes('Chromium')) {
      browser = 'Chrome';
      const chromeBrand = uaData.brands.find(
        (b) => b.brand === 'Google Chrome' || b.brand === 'Chromium'
      );
      if (chromeBrand?.version)
        version = chromeBrand.version.split('.')[0] ?? 'Unknown';
    } else if (brands.includes('Microsoft Edge')) {
      browser = 'Edge';
      const edgeBrand = uaData.brands.find((b) => b.brand === 'Microsoft Edge');
      if (edgeBrand?.version)
        version = edgeBrand.version.split('.')[0] ?? 'Unknown';
    } else if (brands.includes('Opera')) {
      browser = 'Opera';
    }

    // Coarse platform mapping from UA-CH low-entropy platform if present
    if (typeof uaData.platform === 'string') {
      if (uaData.platform.startsWith('Win')) platform = 'Windows';
      else if (uaData.platform.startsWith('Mac')) platform = 'macOS';
      else if (uaData.platform.startsWith('Linux')) platform = 'Linux';
      else if (uaData.platform.startsWith('Android')) platform = 'Android';
      else if (uaData.platform.startsWith('iOS')) platform = 'iOS';
    }
  }

  // Fallbacks for non-Chromium browsers (Safari, Firefox)
  if (browser === 'Unknown') {
    // Safari exposes vendor as 'Apple Computer, Inc.'
    if (nav.vendor && /^Apple/.test(nav.vendor)) {
      browser = 'Safari';
    } else if (
      typeof (window as unknown as { InstallTrigger?: unknown })
        .InstallTrigger !== 'undefined'
    ) {
      browser = 'Firefox';
    }
  }

  // Coarse platform fallback using navigator.platform (low-entropy)
  if (platform === 'Unknown' && typeof nav.platform === 'string') {
    const p = nav.platform;
    if (p.startsWith('Win')) platform = 'Windows';
    else if (p.startsWith('Mac')) platform = 'macOS';
    else if (p.startsWith('Linux')) platform = 'Linux';
    else if (/Android/i.test(p)) platform = 'Android';
    else if (/iPhone|iPad|iPod/i.test(p)) platform = 'iOS';
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
