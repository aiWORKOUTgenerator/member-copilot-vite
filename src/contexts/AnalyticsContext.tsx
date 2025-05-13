"use client";

import { useEffect } from "react";
import { getAnalytics } from "@/services/analytics";
import { useAuth } from "@/hooks/auth";
import { useLocation, useSearchParams } from "react-router";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

/**
 * Analytics Provider Component
 *
 * Initializes the analytics service and provides tracking functionality
 * throughout the application. Automatically identifies users when logged in
 * and resets analytics when users log out. Tracks page views on route changes.
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const { user, isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const searchParams = useSearchParams();

  // Initialize analytics
  useEffect(() => {
    try {
      // Initialize analytics on client-side only
      getAnalytics().initialize();
      console.log("Analytics service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize analytics service:", error);
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    try {
      const analytics = getAnalytics();

      // Construct full URL with search params if available
      const search = searchParams ? searchParams.toString() : "";
      const url = `${location.pathname}${search ? `?${search}` : ""}`;

      // Track page view with path and URL
      analytics.page({
        path: location.pathname,
        url: url,
        search: search,
        title: document.title,
      });

      console.log(`Page view tracked: ${url}`);
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }, [location.pathname, searchParams]);

  // Handle user authentication state changes
  useEffect(() => {
    if (!isLoaded) return; // Wait until auth state is loaded

    const analytics = getAnalytics();

    if (isSignedIn && user) {
      // User is signed in - identify them in analytics
      const userId = user.id;
      const userTraits = {
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        // Add any other relevant user traits here
      };

      analytics.identify(userId, userTraits);
      console.log("User identified in analytics");
    } else if (isLoaded && !isSignedIn) {
      // User is signed out - reset analytics
      analytics.reset();
      console.log("Analytics reset after user sign out");
    }
  }, [isLoaded, isSignedIn, user]);

  return <>{children}</>;
}
