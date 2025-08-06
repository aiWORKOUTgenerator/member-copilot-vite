'use client';

import { useAuth } from '@/hooks/auth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button, DashboardIcon } from '@/ui';
import { useEffect } from 'react';
import { Link } from 'react-router';
import { ANALYTICS_EVENTS } from '../constants';

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
    <div className="min-h-full w-full max-w-full flex flex-col bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 overflow-x-hidden">
      {/* Navbar */}
      <nav className="navbar bg-base-100 bg-opacity-70 backdrop-blur-sm sticky top-0 z-10 w-full">
        <div className="navbar-start min-w-0 flex-1">
          <Link
            to="/"
            className="btn btn-ghost text-base sm:text-xl truncate"
            onClick={handleLogoClick}
          >
            <span className="hidden sm:inline">AI Workout Generator</span>
            <span className="sm:hidden">AI Workout</span>
          </Link>
        </div>

        <div className="navbar-end flex-shrink-0">
          {isLoaded ? (
            isSignedIn ? (
              <Link to="/dashboard" onClick={handleDashboardClick}>
                <Button variant="primary" size="sm">
                  <DashboardIcon size="sm" className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">My Workouts</span>
                  <span className="sm:hidden">Workouts</span>
                </Button>
              </Link>
            ) : (
              <div className="flex gap-1 sm:gap-2">
                <Link
                  to="/sign-in"
                  className="btn btn-ghost btn-sm sm:btn-md"
                  onClick={handleSignInClick}
                >
                  Sign In
                </Link>
                <Link to="/conversion" onClick={handleCreateAccountClick}>
                  <Button variant="primary" size="sm">
                    <span className="hidden sm:inline">Create Account</span>
                    <span className="sm:hidden">Sign Up</span>
                  </Button>
                </Link>
              </div>
            )
          ) : (
            <div className="h-8 w-24 sm:h-10 sm:w-32 bg-base-300 rounded"></div>
          )}
        </div>
      </nav>

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <div className="hero min-h-[70vh] bg-transparent w-full">
          <div className="hero-content text-center w-full max-w-none px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Your Personal AI Workout Generator
              </h1>
              <p className="py-4 sm:py-6 text-base sm:text-lg leading-relaxed">
                Get customized workout plans tailored to your fitness level,
                goals, and available equipment. Powered by advanced AI to
                optimize your training and results.
              </p>

              {isLoaded && !isSignedIn && (
                <div className="mt-4">
                  <Link to="/conversion/signup" onClick={handleHeroCTAClick}>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Generate Your First Workout
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
