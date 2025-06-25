"use client";

import { useAuth } from "@/hooks/auth";
import {
  AlreadyLoggedIn,
  AuthMethodCard,
  FormContainer,
  PageLoading,
} from "@/ui";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const analytics = useAnalytics();

  // Track sign-in page views
  useEffect(() => {
    analytics.track("Sign In Page Viewed", {
      timestamp: new Date().toISOString(),
    });
  }, [analytics]);

  // Show loading state while checking auth status
  if (!isLoaded) {
    return <PageLoading message="Loading authentication status..." />;
  }

  // If already signed in, show already logged in page
  if (isSignedIn) {
    return <AlreadyLoggedIn />;
  }

  // If not signed in, show sign in options
  return (
    <FormContainer
      title="Sign In"
      altAuthText="Don't have an account?"
      altAuthLink="/conversion"
      altAuthLinkText="Sign up"
    >
      <div className="space-y-6">
        <AuthMethodCard
          title="Magic Link"
          description="Receive a secure link via email to sign in without a password"
          buttonLabel="Continue with Magic Link"
          buttonVariant="primary"
          href="/sign-in/magic-link"
          ariaLabel="Sign in with magic link"
        />

        <AuthMethodCard
          title="Email Verification Code"
          description="Receive a 6-digit code via email to verify your identity"
          buttonLabel="Continue with Verification Code"
          buttonVariant="secondary"
          href="/sign-in/email-otp"
          ariaLabel="Sign in with verification code"
        />
      </div>
    </FormContainer>
  );
}
