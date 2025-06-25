"use client";

import { useAuth } from "@/hooks/auth";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Link } from "react-router";
import { Button, DashboardIcon } from "@/ui";
import { useEffect } from "react";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const analytics = useAnalytics();

  // Track landing page views
  useEffect(() => {
    if (isLoaded) {
      analytics.track("Landing Page Viewed", {
        userStatus: isSignedIn ? "authenticated" : "anonymous",
        tracked_at: new Date().toISOString(),
      });
    }
  }, [isLoaded, isSignedIn, analytics]);

  // Track navigation clicks
  const handleSignInClick = () => {
    analytics.track("Sign In CTA Clicked", {
      location: "navbar",
      userStatus: "anonymous",
    });
  };

  const handleDashboardClick = () => {
    analytics.track("Dashboard Navigation Clicked", {
      location: "navbar",
      userStatus: "authenticated",
    });
  };

  const handleCreateAccountClick = () => {
    analytics.track("Create Account CTA Clicked", {
      location: "navbar",
      userStatus: "anonymous",
    });
  };

  const handleHeroCTAClick = () => {
    analytics.track("Hero CTA Clicked", {
      location: "hero_section",
      ctaText: "Generate Your First Workout",
      userStatus: "anonymous",
    });
  };

  return (
    <div className="min-h-full flex flex-col bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
      {/* Navbar */}
      <nav className="navbar bg-base-100 bg-opacity-70 backdrop-blur-sm sticky top-0 z-10">
        <div className="navbar-start">
          <Link
            to="/"
            className="btn btn-ghost text-xl"
            onClick={() =>
              analytics.track("Logo Clicked", { location: "navbar" })
            }
          >
            AI Workout Generator
          </Link>
        </div>

        <div className="navbar-end">
          {isLoaded ? (
            isSignedIn ? (
              <Link to="/dashboard" onClick={handleDashboardClick}>
                <Button variant="primary">
                  <DashboardIcon size="sm" className="mr-2" />
                  My Workouts
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="btn btn-ghost mr-2"
                  onClick={handleSignInClick}
                >
                  Sign In
                </Link>
                <Link to="/conversion" onClick={handleCreateAccountClick}>
                  <Button variant="primary">Create Account</Button>
                </Link>
              </>
            )
          ) : (
            <div className="h-10 w-32 bg-base-300 rounded"></div>
          )}
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <div className="hero min-h-[70vh] bg-transparent">
          <div className="hero-content text-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold">
                Your Personal AI Workout Generator
              </h1>
              <p className="py-6 text-lg">
                Get customized workout plans tailored to your fitness level,
                goals, and available equipment. Powered by advanced AI to
                optimize your training and results.
              </p>

              {isLoaded && !isSignedIn && (
                <div className="mt-4">
                  <Link to="/conversion/signup" onClick={handleHeroCTAClick}>
                    <Button variant="primary" size="lg">
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
