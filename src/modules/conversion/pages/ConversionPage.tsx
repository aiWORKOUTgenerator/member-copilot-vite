"use client";

import {
  AlreadyLoggedIn,
  AuthMethodCard,
  FormContainer,
  PageLoading,
} from "@/ui";
import { useAuth } from "@clerk/clerk-react";

export default function ConversionPage() {
  const { isLoaded, isSignedIn } = useAuth();

  // Show loading state while checking auth status
  if (!isLoaded) {
    return <PageLoading message="Loading authentication status..." />;
  }

  // If already signed in, show already logged in page
  if (isSignedIn) {
    return <AlreadyLoggedIn />;
  }

  // If not signed in, show sign up options
  return (
    <FormContainer
      title="Choose Sign Up Method"
      subtitle="Select how you'd like to create your account"
      altAuthText="Already have an account?"
      altAuthLink="/sign-in"
      altAuthLinkText="Sign in"
    >
      <div className="space-y-6">
        <AuthMethodCard
          title="Magic Link"
          description="Receive a secure link via email to verify your identity"
          buttonLabel="Continue with Magic Link"
          buttonVariant="primary"
          href="/conversion/signup"
          ariaLabel="Sign up with magic link"
        />

        <AuthMethodCard
          title="Email Verification Code"
          description="Receive a 6-digit code via email to verify your identity"
          buttonLabel="Continue with Verification Code"
          buttonVariant="secondary"
          href="/conversion/email-otp"
          ariaLabel="Sign up with verification code"
        />
      </div>
    </FormContainer>
  );
}
