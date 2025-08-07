'use client';

import { useAuth } from '@/hooks/auth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ErrorBoundary } from '@/ui';
import { useEffect } from 'react';
import { ANALYTICS_EVENTS } from '../constants';
import { HomeNavbar, HeroSection } from '../components';

export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const analytics = useAnalytics();

  // Track landing page views
  useEffect(() => {
    if (isLoaded) {
      analytics.track(ANALYTICS_EVENTS.LANDING_PAGE_VIEWED, {
        userStatus: isSignedIn ? 'authenticated' : 'anonymous',
        tracked_at: new Date().toISOString(),
      });
    }
  }, [isLoaded, isSignedIn, analytics]);

  // Track navigation clicks
  const handleSignInClick = () => {
    analytics.track(ANALYTICS_EVENTS.SIGN_IN_CTA_CLICKED, {
      location: 'navbar',
      userStatus: 'anonymous',
    });
  };

  const handleDashboardClick = () => {
    analytics.track(ANALYTICS_EVENTS.DASHBOARD_NAVIGATION_CLICKED, {
      location: 'navbar',
      userStatus: 'authenticated',
    });
  };

  const handleCreateAccountClick = () => {
    analytics.track(ANALYTICS_EVENTS.CREATE_ACCOUNT_CTA_CLICKED, {
      location: 'navbar',
      userStatus: 'anonymous',
    });
  };

  const handleHeroCTAClick = () => {
    analytics.track(ANALYTICS_EVENTS.HERO_CTA_CLICKED, {
      location: 'hero_section',
      ctaText: 'Generate Your First Workout',
      userStatus: 'anonymous',
    });
  };

  const handleLogoClick = () => {
    analytics.track(ANALYTICS_EVENTS.LOGO_CLICKED, { location: 'navbar' });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-full w-full max-w-full flex flex-col bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 overflow-x-hidden">
        <HomeNavbar
          onSignInClick={handleSignInClick}
          onDashboardClick={handleDashboardClick}
          onCreateAccountClick={handleCreateAccountClick}
          onLogoClick={handleLogoClick}
        />

        <main className="flex-1 w-full">
          <HeroSection onHeroCTAClick={handleHeroCTAClick} />
        </main>
      </div>
    </ErrorBoundary>
  );
}
