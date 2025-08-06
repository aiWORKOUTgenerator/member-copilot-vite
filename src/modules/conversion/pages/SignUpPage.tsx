'use client';

import {
  Button,
  ErrorIcon,
  FormContainer,
  InfoIcon,
  Input,
  SuccessIcon,
} from '@/ui';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { isClerkAPIResponseError } from '@clerk/clerk-react/errors';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function SignUpPage() {
  const [emailAddress, setEmailAddress] = useState('');
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [validation, setValidation] = useState<string>('');
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const analytics = useAnalytics();

  // Track sign-up page views
  useEffect(() => {
    analytics.track('Sign Up Page Viewed', {
      tracked_at: new Date().toISOString(),
    });
  }, [analytics]);

  // Track form field interactions
  const handleFieldFocus = (fieldName: string) => {
    analytics.track('Sign Up Field Focused', {
      fieldName,
      tracked_at: new Date().toISOString(),
    });
  };

  // Track authentication method selection
  const handleEmailSignUp = () => {
    analytics.track('Sign Up Method Selected', {
      method: 'email',
      location: 'signup_page',
    });
  };

  // Track form submission attempts
  const handleFormSubmit = () => {
    analytics.track('Sign Up Form Submitted', {
      method: 'email',
      tracked_at: new Date().toISOString(),
    });
  };

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Update validation message when email changes
  useEffect(() => {
    if (emailAddress && !validateEmail(emailAddress)) {
      setValidation('Please enter a valid email address');
    } else {
      setValidation('');
    }
  }, [emailAddress]);

  // Check for email query parameter and pre-fill form
  useEffect(() => {
    const emailParam = searchParams?.get('email');

    if (
      emailParam &&
      validateEmail(emailParam) &&
      isSignUpLoaded &&
      isSignInLoaded
    ) {
      // Just pre-fill the email address, don't auto-submit
      setEmailAddress(emailParam);
    }
  }, [searchParams, isSignUpLoaded, isSignInLoaded]);

  if (!isSignUpLoaded || !signUp || !isSignInLoaded || !signIn) {
    return (
      <FormContainer title="Sign up">
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </FormContainer>
    );
  }

  const { startEmailLinkFlow } = signUp.createEmailLinkFlow();

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Don't submit if email is invalid
    if (!validateEmail(emailAddress)) {
      setValidation('Please enter a valid email address');
      return;
    }

    // Reset states in case user resubmits form mid sign-up
    setVerified(false);
    setError('');
    setVerifying(true);

    try {
      await signUp?.create({
        emailAddress,
      });

      // Dynamically set the host domain for dev and prod
      const protocol = window.location.protocol;
      const host = window.location.host;

      // Send the user an email with the email link
      const signUpAttempt = await startEmailLinkFlow({
        // URL to navigate to after the user visits the link in their email
        redirectUrl: `${protocol}//${host}/conversion/verify`,
      });

      // Check the verification result
      const verification = signUpAttempt.verifications.emailAddress;

      // Handle if user visited the link and completed sign-up from /sign-up/verify
      if (verification.verifiedFromTheSameClient()) {
        setVerifying(false);
        setVerified(true);
      }
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));

      // Handle error case where user already exists
      if (err instanceof Error && isClerkAPIResponseError(err)) {
        // Check if the error is due to user already existing
        const identifierExists = err.errors.some(
          (error) => error.code === 'form_identifier_exists'
        );

        if (identifierExists && signIn) {
          // If user exists, redirect to the email verification sign-in page with email prefilled
          // This will create a fresh authentication session through the standard sign-in flow
          console.log('User already exists, redirecting to sign-in...');

          // Use a short timeout to ensure any pending state updates are complete before navigation
          setTimeout(() => {
            navigate(
              `/sign-in/email-otp?email=${encodeURIComponent(
                emailAddress
              )}&from=signup`
            );
          }, 100);
          return;
        } else {
          // For other errors, display the message
          setError(
            err.errors[0]?.longMessage ||
              'An error occurred with authentication.'
          );
        }
      } else {
        setError('An error occurred. Please try again.');
      }
      setVerifying(false);
    }
  }

  function reset(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(false);
    setEmailAddress('');
  }

  if (error) {
    return (
      <FormContainer
        title="Oops! Something went wrong"
        subtitle="We weren't able to process your request"
      >
        <div className="alert alert-error">
          <ErrorIcon size="md" className="shrink-0" />
          <span>{error}</span>
        </div>
        <div className="mt-6">
          <Button
            variant="primary"
            fullWidth
            onClick={() => setError('')}
            aria-label="Try again"
          >
            Try again
          </Button>
        </div>
      </FormContainer>
    );
  }

  if (verifying) {
    return (
      <FormContainer
        title="Check your email"
        subtitle="We've sent you a link to complete your sign up"
      >
        <div className="alert alert-info mb-6">
          <InfoIcon size="md" className="shrink-0" />
          <span>Click the link in your email to continue.</span>
        </div>
        <form onSubmit={reset}>
          <Button
            variant="secondary"
            fullWidth
            type="submit"
            aria-label="Start over"
          >
            Start over
          </Button>
        </form>
      </FormContainer>
    );
  }

  if (verified) {
    return (
      <FormContainer
        title="Successfully signed up!"
        subtitle="Your account has been created"
      >
        <div className="alert alert-success">
          <SuccessIcon size="md" className="shrink-0" />
          <span>Welcome! You are all set.</span>
        </div>
        <div className="mt-6">
          <Link to="/dashboard" className="block w-full">
            <Button variant="primary" fullWidth aria-label="Go to dashboard">
              Go to dashboard
            </Button>
          </Link>
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer
      title="Create your account"
      altAuthText="Already have an account?"
      altAuthLink="/sign-in"
      altAuthLinkText="Sign in"
    >
      <form onSubmit={submit} className="space-y-6">
        <Input
          type="email"
          label="Email address"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          placeholder="yourname@example.com"
          required
          autoComplete="email"
          error={validation}
          fullWidth
          isLoading={verifying}
          aria-label="Email address"
          aria-required="true"
          helperText="We'll send you a magic link to sign in"
          onFocus={() => handleFieldFocus('email')}
        />
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={verifying}
          disabled={!!validation || !emailAddress || verifying}
          aria-label="Continue with email"
          onClick={() => {
            handleEmailSignUp();
            handleFormSubmit();
          }}
        >
          Continue with email
        </Button>
      </form>
    </FormContainer>
  );
}
