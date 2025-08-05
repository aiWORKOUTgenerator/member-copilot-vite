"use client";

import { AuthRequired, PageLoading } from "@/ui";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import DashboardHomePage from "./DashboardHomePage";

export default function DashboardLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect to sign-in if not authenticated after loading
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/sign-in");
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Show loading state while checking auth status
  if (!isLoaded) {
    return <PageLoading message="Loading dashboard..." />;
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <AuthRequired signInLink="/sign-in" />;
  }

  // User is authenticated, show dashboard
  return <DashboardHomePage />;
}
